'use strict'

import { BigNumberish } from '@ethersproject/bignumber';
import { BytesLike    } from '@ethersproject/bytes';
import { Signer       } from '../interfaces';
import wrapper          from '../wrapper';

type txRequest = {
	to?:       string,
	from?:     string,
	nonce?:    BigNumberish,
	gas?:      BigNumberish,
	gasPrice?: BigNumberish,
	data?:     BytesLike,
	value?:    BigNumberish,
	chainId?:  number,
}

export default (signer: Signer) => wrapper(
	'eth_signTransaction',
	(params: Array<txRequest>) => new Promise((resolve, reject) => {
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
			check:   async (tx: txRequest) => !tx.from || tx.from.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign transaction: invalid account',
		}
	]
)
