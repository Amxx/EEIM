'use strict'

const { ethers }  = require('ethers')
const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_sendTransaction',
	(params) => new Promise((resolve, reject) => {
		signer.sendTransaction({
			to:       params[0].to,
			value:    params[0].value,
			data:     params[0].data,
			gasLimit: params[0].gas,
			gasPrice: params[0].gasPrice,
			nonce:    params[0].nonce,
		})
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
