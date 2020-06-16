'use strict'

const express              = require('express');
const { ethers }           = require('ethers');
const { success, failure } = require('@eeim/rpcproxy/lib/utils/format');
const FACTORY              = require('@eeim/administered-wallets/build/contracts/AdministeredWalletFactory.json');

const signer    = new ethers.providers.JsonRpcProvider(process.env.JSONRPC).getSigner();
const factory   = new ethers.Contract(process.env.FACTORY, FACTORY.abi, signer);

const app = express();

app.use(express.json());
app.route('/get').post(async (req, res) => {

	// TODO:
	// - reuse existing wallets

	const tx        = await (await factory.createWallet(req.body.address, ethers.utils.randomBytes(32))).wait()
	const tokenid   = tx.events.find(({ event }) => 'Transfer').args.tokenId
	const wallet    = ethers.utils.getAddress(ethers.utils.hexZeroPad(tokenid, 20))
	const forwarder = await factory.getTrustedForwarder()
	success(req,res)({ wallet, forwarder })
});

app.listen(process.env.PORT || 8000);
console.info('RESTful API server started');
