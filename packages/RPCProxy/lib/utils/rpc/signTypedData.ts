'use strict'

import { TypedData, TypedDataTypes } from './_types';
import { SignerExtended            } from '../interfaces';
import wrapper                       from '../wrapper';

export function extractTypes(types: TypedDataTypes, primaryType: string, acc: TypedDataTypes = {})
{
	acc[primaryType] = types[primaryType];
	return types[primaryType].reduce((acc, { type }) => (type in types && !(type in acc)) ? extractTypes(types, type, acc) : acc, acc);
}

export default (signer: SignerExtended) => wrapper(
	'eth_signTypedData',
	(params: Array<any>) => signer._signTypedData(
		(params[1] as TypedData).domain,
		extractTypes((params[1] as TypedData).types, (params[1] as TypedData).primaryType),
		(params[1] as TypedData).message
	),
	[
		{
			check:   async (addr: string) => addr.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		null, // TODO
	]
)
