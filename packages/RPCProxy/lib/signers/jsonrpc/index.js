'use strict'

const { ethers } = require('ethers');
const sigUtil    = require('eth-sig-util');

class JsonRpcSigner extends ethers.Signer
{
	constructor(provider)
	{
		super()
		this.provider = provider
		this._signer  = provider.getSigner()
	}

	async connect()
	{
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
		return this._signer.signTransaction(tx)
	}

	sendTransaction(tx)
	{
		return this._signer.sendTransaction(tx)
	}
}

module.exports = JsonRpcSigner
