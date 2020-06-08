'use strict';

const { ethers } = require('ethers');
const rpcserver  = require('./lib/RPCServer');
const signers    = require('./lib/signers');

const provider = new ethers.providers.InfuraProvider('goerli');
// const provider = new ethers.providers.JsonRpcProvider('localhost:8545');

// Private key EOA
// const signer = new signers.eoa(process.env.MNEMONIC2, provider); // EOA

// NFWallet
// const signer = new signers.nfwallet(
// 	new signers.eoa(process.env.MNEMONIC2, provider), // Controller
// 	'0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1',
// );

// relaying
// const signer = new signers.simpleforwarder(
// 	new signers.eoa(process.env.MNEMONIC2, provider), // Signer
// 	new signers.eoa(process.env.MNEMONIC,  provider), // Relayer
// );



// NFWallet + relaying
const signer = new signers.nfwallet(
	'0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1',
	new signers.simpleforwarder(
		new signers.eoa(process.env.MNEMONIC2, provider), // Signer
		new signers.eoa(process.env.MNEMONIC,  provider), // Relayer
	),
);

(new rpcserver(signer)).start(process.env.PORT || 8545)
