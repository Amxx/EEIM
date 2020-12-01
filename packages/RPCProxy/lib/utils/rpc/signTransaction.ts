'use strict'

import { TxRequest } from './_types';
import { Signer    } from '../interfaces';
import wrapper       from '../wrapper';

export default (signer: Signer) => wrapper(
	'eth_signTransaction',
	(params: Array<TxRequest>) => new Promise((resolve, reject) => {
		signer.populateTransaction({
			to:       params[0].to,
			from:     params[0].from,
			nonce:    params[0].nonce,
			gasLimit: params[0].gas,
			gasPrice: params[0].gasPrice,
			data:     params[0].data,
			value:    params[0].value,
			chainId:  params[0].chainId,
		}).then(tx => {
			signer.signTransaction(tx).then(resolve).catch(reject);
		}).catch(reject);
	}),
	[
		{
			check:   async (tx: TxRequest) => !tx.from || tx.from.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign transaction: invalid account',
		}
	]
)
