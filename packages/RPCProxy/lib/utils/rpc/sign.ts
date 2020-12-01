'use strict'

import { isHexString  } from '@ethersproject/bytes';
import { toUtf8String } from '@ethersproject/strings';
import { Signer       } from '../interfaces';
import wrapper          from '../wrapper';

export default (signer: Signer) => wrapper(
	'eth_sign',
	(params: Array<string>) => signer.signMessage(toUtf8String(params[1])),
	[
		{
			check:   async (addr) => addr.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		{
			check:   isHexString,
			message: 'Cannot sign message: data must be hex string',
		},
	]
)
