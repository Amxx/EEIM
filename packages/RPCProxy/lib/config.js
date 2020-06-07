'use strict'

const { ethers } = require('ethers')
const signers    = require('./signers')

const provider = new ethers.providers.InfuraProvider('goerli')

module.exports = new signers.nfwallet(
	new signers.gsn(
		new ethers.Wallet(process.env.MNEMONIC2, provider), // Signer
		new ethers.Wallet(process.env.MNEMONIC2, provider), // Relayer
	),
	"0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1",
)
