'use strict'

const methods = require('./methods')

class RPCSigner
{
	constructor(signer)
	{
		this.signer = signer

		// load all methods
		Object.entries(methods).forEach(([ name, method]) => {
			this[name] = method(signer)
		})
	}
}

module.exports = RPCSigner
