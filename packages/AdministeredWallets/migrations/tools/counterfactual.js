/*****************************************************************************
 *                                   Tools                                   *
 *****************************************************************************/
function getSerializedObject(entry)
{
	return (entry.type == 'tuple')
		? `(${entry.components.map(getSerializedObject).join(',')})`
		: entry.type;
}

function getFunctionSignatures(abi)
{
	return [
		...abi
			.filter(entry => entry.type == 'receive')
			.map(entry => 'receive;'),
		...abi
			.filter(entry => entry.type == 'fallback')
			.map(entry => 'fallback;'),
		...abi
			.filter(entry => entry.type == 'function')
			.map(entry => `${entry.name}(${entry.inputs.map(getSerializedObject).join(',')});`),
	].filter(Boolean).join('');
}

async function factoryDeployer(contract, options = {})
{
	console.log(`[factoryDeployer] ${contract.contractName}`);
	const factory          = await options.factory.deployed();
	const libraryAddresses = await Promise.all(options.libraries.map(contract => ({ pattern: new RegExp(`__${contract.contractName}${'_'.repeat(38-contract.contractName.length)}`, 'g'), library: contract })).filter(({ pattern }) => contract.bytecode.search(pattern) != -1).map(async ({ pattern, library }) => ({ pattern, ...await library.deployed() })));
	const constructorABI   = contract._json.abi.find(e => e.type == 'constructor');
	const coreCode         = libraryAddresses.reduce((code, { pattern, address }) => code.replace(pattern, address.slice(2).toLowerCase()), contract.bytecode);
	const argsCode         = constructorABI ? options.factory.web3.eth.abi.encodeParameters(constructorABI.inputs.map(e => e.type), options.args || []).slice(2) : '';
	const code             = coreCode + argsCode;
	const salt             = options.salt  || '0x0000000000000000000000000000000000000000000000000000000000000000';

	contract.address = options.call
		? await factory.predictAddressWithCall(code, salt, options.call)
		: await factory.predictAddress(code, salt);

	if (await options.factory.web3.eth.getCode(contract.address) == '0x')
	{
		console.log(`[factory] Preparing to deploy ${contract.contractName} ...`);
		options.call
			? await factory.createContractAndCall(code, salt, options.call)
			: await factory.createContract(code, salt);
		console.log(`[factory] ${contract.contractName} successfully deployed at ${contract.address}`);
	}
	else
	{
		console.log(`[factory] ${contract.contractName} already deployed at ${contract.address}`);
	}
}

module.exports = {
	factoryDeployer,
	getFunctionSignatures,
}
