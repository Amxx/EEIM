'use strict';

const request    = require('request');
const { ethers } = require('ethers');
const rpcserver  = require('../lib/RPCServer');
const signers    = require('../lib/signers');

const relayer    = new ethers.providers.JsonRpcProvider(process.env.JSONRPC).getSigner();
const disposable = new signers.eoa(process.env.MNEMONIC || ethers.utils.randomBytes(32));

request.post(
	`${process.env.MANAGER}/get`,
	{ json: { address: disposable.address } },
	(error, res) => {

		const signer = new signers.administeredwallets(
			res.body.result.wallet,
			new signers.simpleforwarder(
				disposable,
				relayer,
				{
					forwarder: res.body.result.forwarder,
					manager:   process.env.MANAGER,
				}
			),
		);

		signer.connect().then(ready => {
			(new rpcserver(ready)).start(process.env.PORT || 8545)
		});

	}
)
