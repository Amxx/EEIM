'use strict'

const { ethers } = require('ethers');
const sigUtil    = require('eth-sig-util');

class JsonRpcSigner extends ethers.Signer
{
	constructor(provider)
	{
		super()
		this.provider = provider
	}

	getAddress()
	{
		return this.provider.getSigner().getAddress()
	}

	signMessage(message)
	{
		return this.provider.getSigner().signMessage(message)
	}

	signTypedData(data)
	{
		return new Promise((resolve, reject) => {
			this.getAddress()
			.then(address => {
				this.provider.send('eth_signTypedData', [ address, data ])
				.then(resolve)
				.catch(reject)
			})
			.catch(reject)
		})
	}

	signTransaction(tx)
	{
		return new Promise((resolve, reject) => {
			this.getAddress()
			.then(address => {
				this.provider.send('eth_signTransaction', [ tx ])
				.then(resolve)
				.catch(reject)
			})
			.catch(reject)
		})
	}

	sendTransaction(tx)
	{
		return this.provider.getSigner().sendTransaction(tx)
	}
}

module.exports = JsonRpcSigner
