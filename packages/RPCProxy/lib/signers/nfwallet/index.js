'use strict'

const { ethers } = require('ethers')
const NFWALLET   = require('./abi/NFWallet.json')

class NFWalletSigner extends ethers.Signer
{
	// provider: types.Provider
	// _owner:   types.wallet
	// _proxy:   types.contract

	constructor(proxy, owner)
	{
		super()
		this.provider = owner.provider
		this.address  = proxy // resolve ?
		this._owner  = owner
		this._proxy   = new ethers.Contract(proxy, NFWALLET.abi, owner)
	}

	getAddress()
	{
		return new Promise((resolve, reject) => resolve(this._proxy.address))
	}

	signMessage(message)
	{
		return this._owner.signMessage(message)
	}

	signTypedData(data)
	{
		return this._owner.signTypedData(data)
	}

	sendTransaction(tx)
	{
		return this._proxy.forward(
			tx.to,
			tx.value || 0,
			tx.data  || "0x",
		)
	}
}

module.exports = NFWalletSigner
