'use strict'

const methods = require('./methods')

class RPCSigner
{
	// provider: types.Provider
	// signer:   types.wallet

	constructor(signer)
	{
		this.signer   = signer
		this.provider = signer.provider

		// load all methods
		Object.entries(methods).forEach(([ name, method]) => {
			this[name] = method(signer)
		})
	}
}

module.exports = RPCSigner
