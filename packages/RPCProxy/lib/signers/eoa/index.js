'use strict'

const { ethers } = require('ethers');
const sigUtil    = require('eth-sig-util');

class EOASigner extends ethers.Wallet
{
	constructor(...args)
	{
		super(...args)
	}

	signTypedData(data)
	{
		return new Promise((resolve, reject) => resolve(sigUtil.signTypedData(Buffer.from(this._signingKey().privateKey.substring(2), 'hex'), { data })))
	}

	signTransaction(tx)
	{
		return new Promise((resolve, reject) => {
			this.populateTransaction(tx)
			.then(populated => {
				super.signTransaction(populated)
				.then(resolve)
				.catch(reject)
			})
			.catch(reject)
		})
	}
}

module.exports = EOASigner
