'use strict'

import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { SignerExtended                  } from '../interfaces';
import wrapper                             from '../wrapper';

type types   = Record<string, Array<TypedDataField>>;
type domain  = TypedDataDomain;
type payload = Record<string, any>;

type typedData = {
	types:       types,
	primaryType: string,
	domain:      domain,
	message:     payload,
};

export function extractTypes(types: types, primaryType: string, acc: types = {})
{
	acc[primaryType] = types[primaryType];
	return types[primaryType].reduce((acc, { type }) => (type in types && !(type in acc)) ? extractTypes(types, type, acc) : acc, acc);
}

export default (signer: SignerExtended) => wrapper(
	'eth_signTypedData',
	(params: Array<any>) => signer._signTypedData(
		(params[1] as typedData).domain,
		extractTypes((params[1] as typedData).types, (params[1] as typedData).primaryType),
		(params[1] as typedData).message
	),
	[
		{
			check:   async (addr: string) => addr.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		null, // TODO
	]
)
