'use strict'

const { ethers }         = require('ethers')
const ADMINISTEREDWALLET = require('@eeim/administered-wallets/build/contracts/AdministeredWallet.json')

class AdministeredWalletSigner extends ethers.Signer
{
	// provider: types.Provider
	// _owner:   types.wallet
	// _proxy:   types.contract

	constructor(proxy, owner)
	{
		super()
		this.provider = owner.provider
		this._owner   = owner
		this._proxy   = new ethers.Contract(proxy, ADMINISTEREDWALLET.abi, owner)
	}

	async connect()
	{
		await this._owner.connect();
		return this;
	}

	getAddress()
	{
		return this._proxy.resolvedAddress
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

module.exports = AdministeredWalletSigner
