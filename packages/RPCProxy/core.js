'use strict'

const express              = require('express')
const { ethers }           = require('ethers')
const { success, failure } = require('./utils/format')
const NFWalletSigner       = require('./signers/nfwalletsigner')
const RPCWrapper           = require('./signers/rpcwrapper')
const CONFIG               = require('./config')

// TODO customize based on config
const fallback = new ethers.providers.InfuraProvider('goerli')

const rpc = new RPCWrapper(
	// TODO add GSN/better relaying support
	new NFWalletSigner(
		fallback,
		CONFIG.relayer,
		CONFIG.signer,
		CONFIG.proxy,
	)
)

/*****************************************************************************
 *                                 Endpoint                                  *
 *****************************************************************************/
const app  = express()
const port = CONFIG.port || 8545

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
				fallback.send(req.body.method, req.body.params)
				.then(success(req,res))
				.catch(failure(req,res))
				break
		}
	})

// start server
app.listen(port)

console.log(`RESTful API server started on: ${port}`)
console.log(`Wallet:  ${rpc.signer.getAddress()}`)
console.log(`Signer:  ${rpc.signer._signer.address}`)
console.log(`Relayer: ${rpc.signer._relayer.address}`)
