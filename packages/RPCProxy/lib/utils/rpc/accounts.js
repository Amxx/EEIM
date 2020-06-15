'use strict'

const { wrapper } = require('../wrapper')

module.exports = (signer) => wrapper(
	'eth_accounts',
	() => new Promise((resolve, reject) => signer.getAddress().then(address => resolve([ address ])).catch(reject)),
	[]
)
