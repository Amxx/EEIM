'use strict'

const { ethers } = require('ethers')
const FORWARDER  = require('./abi/SimpleForwarder.json')

class SimpleForwarder extends ethers.Signer
{
	// provider: types.Provider
	// _signer:  types.wallet
	// _relayer: types.wallet

	constructor(signer, relayer)
	{
		super()
		this.provider   = signer.provider
		this.address    = signer.address
		this._signer    = signer
		this._relayer   = relayer
		this._forwarder = new ethers.Contract(
			// FORWARDER.networks[this.provider._network.chainId].address,
			'0xE8AB70C0bFF15D2286a8953641803224A66Eb09E',
			FORWARDER.abi,
			relayer
		)
	}

	getAddress()
	{
		return new Promise((resolve, reject) => resolve(this.address))
	}

	signMessage(message)
	{
		return this._signer.signMessage(message)
	}

	sendTransaction(tx)
	{
		return new Promise((resolve, reject) => {
			this._prepare(tx)
			.then(metatx => {
				this.signMessage(ethers.utils.arrayify(this._hash(metatx)))
				.then(signature => {
					this._forwarder.verifyAndRelay(
						metatx.to,
						metatx.data,
						metatx.nonce,
						signature,
					)
					.then(resolve)
					.catch(reject)
				})
				.catch(reject)
			})
			.catch(reject)
		})
	}

	_prepare(tx)
	{
		return new Promise((resolve, reject) => {
			Promise.all([
				tx.to,
				tx.data,
				this._forwarder.nonces(this.address),
				this._forwarder.chainId(),
				this._forwarder.addressPromise,
			])
			.then(([ to, data, nonce, chainId, forwarder ]) => resolve({
					to:        to,
					data:      data || "0x",
					nonce:     nonce,
					chainId:   chainId,
					forwarder: forwarder,
			}))
			.catch(reject)
		})
	}

	_hash(metatx)
	{
		return ethers.utils.solidityKeccak256([
			'address',
			'uint256',
			'address',
			'bytes',
			'uint256',
		],[
			metatx.forwarder,
			metatx.chainId,
			metatx.to,
			metatx.data,
			metatx.nonce,
		])
	}
}

module.exports = SimpleForwarder
