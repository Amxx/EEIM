const assert         = require('assert')
const counterfactual = require('./tools/counterfactual')

var SimpleForwarder           = artifacts.require('@eeim/forwarder/SimpleForwarder')
var AdministeredWalletFactory = artifacts.require('AdministeredWalletFactory')

const factoryOptions = {
	salt:      process.env.SALT,
	factory:   artifacts.require('@iexec/solidity/GenericFactory'),
	libraries: [],
}

/*****************************************************************************
 *                                   Main                                    *
 *****************************************************************************/
module.exports = async function(deployer, network, accounts)
{
	console.log('# web3 version:', web3.version);
	const chainid   = await web3.eth.net.getId();
	const chaintype = await web3.eth.net.getNetworkType();
	console.log('Chainid is:', chainid);
	console.log('Chaintype is:', chaintype);
	console.log('Deployer is:', accounts[0]);

	await counterfactual.factoryDeployer(
		SimpleForwarder,
		factoryOptions
	);
	SimpleForwarderInstance = await SimpleForwarder.deployed();
	console.log(`SimpleForwarder deployed at ${SimpleForwarder.address}`);
};
