'use strict'

const { ethers }         = require('ethers')
const ADMINISTEREDWALLET = require('@eeim/administered-wallets/build/contracts/AdministeredWallet.json')

class AdministeredWalletSigner extends ethers.Signer
{
	constructor(address, signer, provider = null)
	{
		super()
		this.provider   = provider || signer.provider
		this.address    = address
		this.interface  = new ethers.utils.Interface(ADMINISTEREDWALLET.abi)
		this.signer     = signer
	}

	getAddress()
	{
		return new Promise((resolve, reject) => resolve(this.address));
	}

	signMessage(message)
	{
		return this.signer.signMessage(message)
	}

	signTypedData(data)
	{
		return this.signer.signTypedData(data)
	}

	signTransaction(tx)
	{
		return new Promise((resolve, reject) => {
			this.signer.signTransaction({
				to: this.address,
				data: this.interface.encodeFunctionData(
					'forward(address,uint256,bytes)',
					[
							tx.to,
							tx.value || 0,
							tx.data  || "0x",
					],
					{
						gasPrice: tx.gasPrice,
					}
				),
			})
			.then(resolve)
			.catch(reject)
		})
	}
}

module.exports = AdministeredWalletSigner
