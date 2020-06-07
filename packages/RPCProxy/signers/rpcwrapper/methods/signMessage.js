'use strict'

const { ethers }  = require('ethers')
const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_sign',
	(params) => signer.signMessage(ethers.utils.toUtf8String(params[1])),
	[
		{
			check:   (addr) => addr.toLowerCase() === signer.address.toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		{
			check:   ethers.utils.isHexString,
			message: 'Cannot sign message: data must be hex string',
		},
	]
)
