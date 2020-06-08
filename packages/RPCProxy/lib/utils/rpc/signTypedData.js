'use strict'

const { ethers }  = require('ethers')
const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_signTypedData',
	(params) => signer.signTypedData(params[1]),
	[
		{
			check:   (addr) => addr.toLowerCase() === signer.address.toLowerCase(),
			message: 'Cannot sign message: invalid account',
		},
		null, // TODO
	]
)
