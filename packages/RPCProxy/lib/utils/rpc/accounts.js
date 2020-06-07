'use strict'

const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_accounts',
	() => new Promise((resolve, reject) => resolve([ signer.address ])),
	[]
)
