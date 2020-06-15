'use strict';

const { ethers } = require('ethers');
const rpcserver  = require('@eeim/rpcproxy/lib/RPCServer');
const signers    = require('@eeim/rpcproxy/lib/signers');
const FACTORY    = require('@eeim/administered-wallets/build/contracts/AdministeredWalletFactory.json');
const FORWARDER  = require('@eeim/administered-wallets/build/contracts/SimpleForwarder.json')

class FilterSigner extends ethers.Signer
{
	constructor(signer, filters = {})
	{
		super()
		this.provider = signer.provider
		this._signer  = signer
		this._filters = filters
	}

	async connect()
	{
		await this._signer.connect();
		return this;
	}

	getAddress()
	{
		return this._signer.getAddress()
	}

	signMessage(message)
	{
		return new Promise(async (resolve, reject) => {
			try
			{
				if (!this._filters.signMessage || await this._filters.signMessage(message))
				{
					this._signer.signMessage(message)
					.then(resolve)
					.catch(reject)
				}
				else
				{
					reject('unauthorized operation')
				}
			}
			catch (error)
			{
				reject(error)
			}
		})
	}

	signTypedData(data)
	{
		return new Promise(async (resolve, reject) => {
			try
			{
				if (!this._filters.signTypedData || await this._filters.signTypedData(data))
				{
					this._signer.signTypedData(data)
					.then(resolve)
					.catch(reject)
				}
				else
				{
					reject('unauthorized operation')
				}
			}
			catch (error)
			{
				reject(error)
			}
		})
	}

	sendTransaction(tx)
	{
		return new Promise(async (resolve, reject) => {
			try
			{
				if (!this._filters.sendTransaction || await this._filters.sendTransaction(tx))
				{
					this._signer.sendTransaction(tx)
					.then(resolve)
					.catch(reject)
				}
				else
				{
					reject('unauthorized operation')
				}
			}
			catch (error)
			{
				reject(error)
			}
		})
	}
}

const provider = new ethers.providers.JsonRpcProvider(process.env.JSONRPC);
const signer   = new FilterSigner(
	new signers.jsonrpc(provider),
	{
		signMessage:     async () => false,
		signTypedData:   async () => false,
		sendTransaction: (tx) => new Promise((resolve, reject) => {
			try
			{
				const factory   = new ethers.Contract('0x9412Ae211FB8AB408e35e648cFb4674b6BF0950B', FACTORY.abi, provider);
				const forwarder = new ethers.utils.Interface(FORWARDER.abi);
				const params    = forwarder.decodeFunctionData('verifyAndRelay(address,bytes,uint256,bytes)', tx.data);

				console.log(1)
				factory.ownerOf(params.to)
				.then(owner => resolve(owner !== ethers.constants.AddressZero))
				.catch(reject);
			}
			catch(error)
			{
				reject(error);
			}
		})
	}
);

signer.connect().then(ready => {
	(new rpcserver(ready)).start(process.env.PORT || 8545)
});
