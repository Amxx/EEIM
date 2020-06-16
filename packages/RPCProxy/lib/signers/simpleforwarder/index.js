'use strict'

const { ethers } = require('ethers')
const FORWARDER  = require('@eeim/administered-wallets/build/contracts/SimpleForwarder.json')

class SimpleForwarderSigner extends ethers.Signer
{
	constructor(signer, relayer, forwarder)
	{
		super()
		this.provider  = relayer.provider
		this.forwarder = forwarder
		this.interface = new ethers.utils.Interface(FORWARDER.abi)
		this.signer    = signer
		this.relayer   = relayer
	}

	getAddress()
	{
		return this.signer.getAddress()
	}

	signMessage(message)
	{
		return this.signer.signMessage(message)
	}

	signTypedData(data)
	{
		return this.signer.signTypedData(data)
	}

	signTransaction(tx)
	{
		return new Promise((resolve, reject) => {
			this._prepare(tx)
			.then(metatx => {
				this.signMessage(ethers.utils.arrayify(this._hash(metatx)))
				.then(signature => {
					this.relayer.signTransaction({
						to: this.forwarder,
						data: this.interface.encodeFunctionData(
							'verify(address,bytes,uint256,bytes)',
							[
									metatx.to,
									metatx.data,
									metatx.nonce,
									signature,
							],
							{
								gasPrice: tx.gasPrice,
							}
						),
					})
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
			this.signer.getAddress()
			.then(address => {
				const contract = new ethers.Contract(this.forwarder, this.interface, this.provider);
				Promise.all([
					tx.to,
					tx.data,
					contract.nonces(address),
					contract.chainId(),
					contract.resolvedAddress,
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
