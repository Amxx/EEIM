'use strict'

import { Signer } from '../interfaces';
const { wrapper } = require('../wrapper');

export default (signer: Signer) => wrapper(
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
			check:   async (tx) => !tx.from || tx.from.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot send transaction: invalid account',
		}
	]
)
