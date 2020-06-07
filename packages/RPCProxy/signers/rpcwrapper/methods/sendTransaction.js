'use strict'

const { ethers }  = require('ethers')
const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_sendTransaction',
	(params) => new Promise((resolve, reject) => {
		signer.sendTransaction(params[0])
		.then(({ hash }) => resolve(hash))
		.catch(reject)
	}),
	[
		{
			check:   (tx) => !tx.from || tx.from.toLowerCase() === signer.address.toLowerCase(),
			message: 'Cannot send transaction: invalid account',
		}
	]
)
