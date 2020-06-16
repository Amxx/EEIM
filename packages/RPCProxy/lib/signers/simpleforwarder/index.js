'use strict'

const { ethers } = require('ethers')
const FORWARDER  = require('@eeim/administered-wallets/build/contracts/SimpleForwarder.json')

class SimpleForwarderSigner extends ethers.Signer
{
	// provider: types.Provider
	// _signer:  types.wallet
	// _relayer: types.wallet

	constructor(signer, relayer, options = {})
	{
		super()
		this.provider = relayer.provider
		this._signer  = signer
		this._relayer = relayer
		this._options = options
	}

	async connect()
	{
		this._forwarder = new ethers.Contract(
			this._options.forwarder || FORWARDER.networks[await this.provider.send('eth_chainId')].address,
			FORWARDER.abi,
			this._relayer
		)
		return this;
	}

	getAddress()
	{
		return this._signer.getAddress()
	}

	signMessage(message)
	{
		return this._signer.signMessage(message)
	}

	signTypedData(data)
	{
		return this._signer.signTypedData(data)
	}

	signTransaction(tx)
	{
		return new Promise((resolve, reject) => reject('signTransaction not implemented in SimpleForwarderSigner'))
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
			this._signer.getAddress()
			.then(address =>
				Promise.all([
					tx.to,
					tx.data,
					this._forwarder.nonces(address),
					this._forwarder.chainId(),
					this._forwarder.resolvedAddress,
				])
				.then(([ to, data, nonce, chainId, forwarder ]) => resolve({
					to:        to,
					data:      data || "0x",
					nonce:     nonce,
					chainId:   chainId,
					forwarder: forwarder,
				}))
				.catch(reject)
			)
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

module.exports = SimpleForwarderSigner
