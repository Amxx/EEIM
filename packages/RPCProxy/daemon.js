'use strict';

const { ethers } = require('ethers');
const rpcserver  = require('./lib/RPCServer');
const signers    = require('./lib/signers');

const provider = new ethers.providers.InfuraProvider('goerli');

const signer = new signers.nfwallet(
	new signers.gsn(
		new ethers.Wallet(process.env.MNEMONIC2, provider), // Signer
		new ethers.Wallet(process.env.MNEMONIC2, provider), // Relayer
	),
	'0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1',
);

(new rpcserver(signer)).start(process.env.PORT)
