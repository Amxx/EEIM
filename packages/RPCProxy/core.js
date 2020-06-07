'use strict'

const express              = require('express')
const RPCWrapper           = require('./utils/rpcwrapper')
const { success, failure } = require('./utils/format')
const signer               = require('./config')

const rpc = new RPCWrapper(signer)

/*****************************************************************************
 *                                 Endpoint                                  *
 *****************************************************************************/
const app  = express()
const port = process.env.RPCPORT || 8545

// Setup app
app.use(express.json())

// main endpoint
app
	.route('/')
	.post((req, res) => {
		switch (req.body.method)
		{
			case 'eth_accounts':
				rpc.accounts(req.body.params)
				.then(success(req,res))
				.catch(failure(req,res))
				break

			case 'eth_sign':
			case 'eth_signMessage':
				rpc.signMessage(req.body.params)
				.then(success(req,res))
				.catch(failure(req,res))
				break

			case 'eth_signTypedData':
			case 'eth_signTypedData_v3':
			case 'eth_signTypedData_v4':
				failure(req,res)({ message: 'not implemented yet' })
				break

			case 'eth_sendTransaction':
				rpc.sendTransaction(req.body.params)
				.then(success(req,res))
				.catch(failure(req,res))
				break

			case 'eth_sendRawTransaction':
				rpc.sendRawTransaction(req.body.params)
				.then(success(req,res))
				.catch(failure(req,res))
				break

			default:
				rpc.provider.send(req.body.method, req.body.params)
				.then(success(req,res))
				.catch(failure(req,res))
				break
		}
	})

// start server
app.listen(port)

console.log(`RESTful API server started on: ${port}`)
rpc.signer.address  && console.log(`Wallet:  ${rpc.signer.address}`)
rpc.signer._signer  && console.log(`Signer:  ${rpc.signer._signer.address}`)
rpc.signer._relayer && console.log(`Relayer: ${rpc.signer._relayer.address}`)
