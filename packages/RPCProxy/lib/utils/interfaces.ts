'use strict'

import { Provider                } from '@ethersproject/abstract-provider';
import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer';

interface SignerExtended extends Signer, TypedDataSigner
{
	connect: (provider: Provider) => SignerExtended;
}

export { Signer, SignerExtended };
