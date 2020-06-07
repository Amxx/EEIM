'use strict'

const { ethers }      = require('ethers')
const { wrapper }     = require('../wrapper')
const sendTransaction = require('./sendTransaction')

module.exports = (signer) => wrapper(
	'eth_sendRawTransaction',
	(params) => sendTransaction([ethers.utils.parseTransaction(params[0])]),
	[
		{
			check:   ethers.utils.isHexString,
			message: 'Cannot send raw transaction: data must be hex string',
		}
	]
)
