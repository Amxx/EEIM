'use strict'

const express              = require('express')
const { success, failure } = require('./utils/format')
const rpc                  = require('./utils/rpc')

class RPCServer
{
	constructor(signer)
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
				case 'eth_signMessage':
					rpc.signMessage(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				case 'eth_signTypedData':
				case 'eth_signTypedData_v3':
				case 'eth_signTypedData_v4':
					failure(req,res)({ message: 'not implemented yet' })
					break

				case 'eth_sendTransaction':
					rpc.sendTransaction(signer)(req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break

				default:
					signer.provider.send(req.body.method, req.body.params)
					.then(success(req,res))
					.catch(failure(req,res))
					break
			}
		})
		console.info(`Using signer for address ${signer.address}`)
	}

	start(port = 8545)
	{
		this.app.listen(port)
		console.info(`RESTful API server started on: ${port}`)
	}
}

module.exports = RPCServer
