'use strict'

const { ethers } = require('ethers')
const NFWALLET   = require('./abi/NFWallet.json')

class NFWalletSigner extends ethers.Signer
{
	// provider: types.Provider
	// _proxy:   types.contract
	// _signer:  types.wallet
	// _relayer: types.wallet

	constructor(
		provider,
		relayer,
		signer,
		proxy,
	)
	{
		super()
		this.provider = provider
		this._relayer = new ethers.Wallet(relayer, provider)
		this._signer  = new ethers.Wallet(signer,  provider)
		this._proxy   = new ethers.Contract(proxy, NFWALLET.abi, this._relayer)
		this.address  = this._proxy.address
	}

	getAddress()
	{
		return new Promise((resolve, reject) => resolve(this._proxy.address))
	}

	signMessage(message)
	{
		return this._signer.signMessage(message)
	}

	sendTransaction(transaction)
	{
		return this._proxy.forward(
			transaction.to,
			transaction.value || 0,
			transaction.data  || "0x"
		)
	}
}

module.exports = NFWalletSigner
