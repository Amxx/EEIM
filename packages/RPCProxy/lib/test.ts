'use strict'

import { JsonRpcProvider  } from '@ethersproject/providers';
import { Wallet           } from '@ethersproject/wallet';
import { SignerExtended   } from './utils/interfaces';
import { RPCServer        } from './RPCServer';
import * as extrasigners    from './signers';

(async () => {
	/***************************************************************************
	 *                                Provider                                 *
	 ***************************************************************************/
	const provider = new JsonRpcProvider('http://localhost:8540');

	/***************************************************************************
	 *                              Wallet (EOA)                               *
	 ***************************************************************************/
	const signer : SignerExtended = new Wallet(process.env.MNEMONIC2, provider);

	/***************************************************************************
	 *                             JSONRPC signer                              *
	 ***************************************************************************/
	// const signer : SignerExtended = provider.getSigner();
	// signer._signTypedData = extrasigners.jsonrpc.prototype._signTypedData;

	/***************************************************************************
	 *                                RPCServer                                *
	 ***************************************************************************/
	(new RPCServer(signer)).start();

})().catch(console.error)
