'use strict';

const request    = require('request');
const { ethers } = require('ethers');
const rpcserver  = require('@eeim/rpcproxy/lib/RPCServer');
const signers    = require('@eeim/rpcproxy/lib/signers');

const relayer    = new signers.jsonrpc(new ethers.providers.JsonRpcProvider(process.env.JSONRPC));
const disposable = new signers.eoa(process.env.MNEMONIC || ethers.utils.randomBytes(32));

request.post(
	`${process.env.MANAGER}/get`,
	{ json: { address: disposable.address } },
	(error, res) => {

		(new rpcserver(
			new signers.administeredwallets(
				res.body.result.wallet,
				new signers.simpleforwarder(
					disposable,
					relayer,
					res.body.result.forwarder,
				),
			)
		)).start(process.env.PORT || 8545);

	}
)
