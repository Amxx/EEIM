'use strict'

const { ethers }  = require('ethers')
const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_sign',
	(params) => signer.signMessage(ethers.utils.toUtf8String(params[1])),
	[
		{
			check:   async (addr) => addr.toLowerCase() === (await signer.getAddress()).toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		{
			check:   ethers.utils.isHexString,
			message: 'Cannot sign message: data must be hex string',
		},
	]
)
