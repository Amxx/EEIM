'use strict'

import { Signer } from '../interfaces';
const { wrapper } = require('../wrapper');

export default (signer: Signer) => wrapper(
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
			check:   async (tx) => !tx.from || tx.from.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign transaction: invalid account',
		}
	]
)
