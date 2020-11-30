'use strict'

import { TypedDataField } from '@ethersproject/abstract-signer';
import { SignerExtended } from '../interfaces';
const { wrapper } = require('../wrapper')

export function extractTypes(
	types:       Record<string, Array<TypedDataField>>,
	primaryType: string,
	acc:         Record<string, Array<TypedDataField>> = {}
)
{
	acc[primaryType] = types[primaryType];
	return types[primaryType].reduce((acc, { type }) => (type in types && !(type in acc)) ? extractTypes(types, type, acc) : acc, acc);
}

export default (signer: SignerExtended) => wrapper(
	'eth_signTypedData',
	(params) => signer._signTypedData(params[1].domain, extractTypes(params[1].types, params[1].primaryType), params[1].message),
	[
		{
			check:   async (addr) => addr.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		null, // TODO
	]
)
