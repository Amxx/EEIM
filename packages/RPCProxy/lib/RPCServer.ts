'use strict'

import express              from 'express';
import { ethers }           from 'ethers';
import { success, failure } from './utils/format';
import { SignerExtended }   from './utils/interfaces';
import * as rpc             from './utils/rpc';
import * as extrasigners    from './signers';

export class RPCServer
{
	app: ReturnType<typeof express>

	constructor(signer: SignerExtended)
	{
		this.app = express()
		this.app.use(express.json())
		this.app.route('/').post((req, res) => {
			switch (req.body.method)
			{
				case 'eth_accounts':
					rpc.accounts(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				case 'eth_sign':
					rpc.sign(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				case 'eth_signTypedData':
				case 'eth_signTypedData_v3':
				case 'eth_signTypedData_v4':
					rpc.signTypedData(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				case 'eth_signTransaction':
					rpc.signTransaction(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				case 'eth_sendTransaction':
					rpc.sendTransaction(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				default:
					(signer.provider as ethers.providers.JsonRpcProvider).send(req.body.method, req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break
			}
		})
		signer.getAddress().then(address => console.info(`Using signer for address ${address}`))
	}

	start(port = 8545): void
	{
		this.app.listen(port)
		console.info(`RESTful API server started on: ${port}`)
	}
}

(async () => {
	/***************************************************************************
	 *                                Provider                                 *
	 ***************************************************************************/
	const provider = new ethers.providers.JsonRpcProvider('http://localhost:8540');

	/***************************************************************************
	 *                              Wallet (EOA)                               *
	 ***************************************************************************/
	// const signer : SignerExtended = new ethers.Wallet(process.env.MNEMONIC2, provider);

	/***************************************************************************
	 *                             JSONRPC signer                              *
	 ***************************************************************************/
	const signer : SignerExtended = provider.getSigner();
	signer._signTypedData = extrasigners.jsonrpc.prototype._signTypedData;

	/***************************************************************************
	 *                                RPCServer                                *
	 ***************************************************************************/
	(new RPCServer(signer)).start();

})().catch(console.error)
