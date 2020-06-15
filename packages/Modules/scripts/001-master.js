'use strict';

const { ethers } = require('ethers');
const rpcserver  = require('@eeim/rpcproxy/lib/RPCServer');
const signers    = require('@eeim/rpcproxy/lib/signers');

const provider = new ethers.providers.JsonRpcProvider(process.env.JSONRPC);
const signer   = new signers.eoa(process.env.MNEMONIC, provider);

signer.connect().then(ready => {
	(new rpcserver(ready)).start(process.env.PORT || 8545)
});
