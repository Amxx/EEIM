'use strict'

const { ethers } = require('ethers')
// const FORWARDER  = require('./abi/NFWallet.json')

class GSNSigner extends ethers.Signer
{
	// provider: types.Provider
	// _signer:  types.wallet
	// _relayer: types.wallet

	constructor(signer, relayer)
	{
		super()
		this.provider   = signer.provider
		this.address    = signer.address
		this._signer    = signer
		this._relayer   = relayer
		// this._forwarder = new ethers.Contract(proxy, NFWALLET.abi, relayer)
	}

	getAddress()
	{
		return new Promise((resolve, reject) => resolve(this.address))
	}

	signMessage(message)
	{
		return this._signer.signMessage(message)
	}

	sendTransaction(tx)
	{
		return this._relayer.sendTransaction(tx)
		// return new Promise((resolve, reject) => {
		// 	const relayrequest = {
		// 		target:          transaction.to,
		// 		encodedFunction: transaction.data,
		// 		gasData: {
		// 			gasLimit:     undefined, // todo
		// 			gasPrice:     undefined, // todo
		// 			pctRelayFee:  undefined, // todo
		// 			baseRelayFee: undefined, // todo
		// 		},
		// 		relayData: {
		// 			senderAddress: this._signer.address,
		// 			senderNonce:   undefined, // todo
		// 			relayWorker:   this._relayer.address,
		// 			paymaster:     undefined, // todo
		// 		},
		// 	}
		//
		// 	this._hash(relayrequest)
		// 	.then(digest => {
		// 		this.signMessage(digest)
		// 		.then(signature => {
		// 			this._forwarder.verifyAndCall(relayrequest, signature)
		// 			.then(resolve)
		// 			.catch(reject)
		// 		})
		// 		.catch(reject)
		// 	})
		// 	.catch(reject)
		// })
	}

	_hash(metatx)
	{
		return ethers.constants.HashZeo
	}
}

module.exports = GSNSigner
