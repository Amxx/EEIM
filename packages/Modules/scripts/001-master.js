'use strict';

const { ethers } = require('ethers');
const rpcserver  = require('@eeim/rpcproxy/lib/RPCServer');
const signers    = require('@eeim/rpcproxy/lib/signers');

(new rpcserver(
	new signers.eoa(
		process.env.MNEMONIC,
		new ethers.providers.JsonRpcProvider(process.env.JSONRPC),
	)
)).start(process.env.PORT || 8545);
