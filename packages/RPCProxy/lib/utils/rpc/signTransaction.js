'use strict'

const { ethers }  = require('ethers')
const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_signTransaction',
	(params) => new Promise((resolve, reject) => {
		signer.signTransaction({
			to:       params[0].to,
			value:    params[0].value,
			data:     params[0].data,
			gasLimit: params[0].gas,
			gasPrice: params[0].gasPrice,
			nonce:    params[0].nonce,
		})
		.then(resolve)
		.catch(reject)
	}),
	[
		{
			check:   (tx) => !tx.from || tx.from.toLowerCase() === signer.address.toLowerCase(),
			message: 'Cannot sign transaction: invalid account',
		}
	]
)
