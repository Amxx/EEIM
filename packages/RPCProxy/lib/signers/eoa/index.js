'use strict'

const { ethers } = require('ethers');
const sigUtil    = require('eth-sig-util');

class EOASigner extends ethers.Wallet
{
	constructor(...args)
	{
		super(...args)
	}

	async ready()
	{
		return this;
	}

	signTypedData(data)
	{
		return new Promise((resolve, reject) => resolve(sigUtil.signTypedData(Buffer.from(this._signingKey().privateKey.substring(2), 'hex'), { data })))
	}
}

module.exports = EOASigner
