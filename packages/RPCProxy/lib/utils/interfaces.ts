'use strict'

import { Signer, TypedDataSigner } from '@ethersproject/abstract-signer';

interface SignerExtended extends Signer, TypedDataSigner {}

export { Signer, SignerExtended };
