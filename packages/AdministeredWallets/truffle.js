var HDWalletProvider = require("@truffle/hdwallet-provider");

var useEnv = !!process.env.MNEMONIC && !!process.env.DEV_NODE;

module.exports =
{
	plugins:
	[
		"solidity-coverage",
		"truffle-plugin-verify"
	],
	api_keys:
	{
    etherscan: process.env.ETHERSCAN
  },
	networks:
	{
		docker:
		{
			host:       "ganache",
			port:       8545,
			network_id: "*",        // Match any network id,
			gasPrice:   8000000000, // 8 Gwei
		},
		development:
		{
			provider:   useEnv ? () => new HDWalletProvider(process.env.MNEMONIC, process.env.DEV_NODE) : undefined,
			host:       useEnv ? undefined : "localhost",
			port:       useEnv ? undefined : 8545,
			network_id: "*",
			gasPrice:   8000000000, // 8 Gwei
		},
		mainnet:
		{
			provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.MAINNET_NODE),
			network_id: '1',
			gasPrice:   8000000000, // 8 Gwei
		},
		ropsten:
		{
			provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.ROPSTEN_NODE),
			network_id: '3',
			gasPrice:   8000000000, // 8 Gwei
		},
		rinkeby:
		{
			provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.RINKEBY_NODE),
			network_id: '4',
			gasPrice:   8000000000, // 8 Gwei
		},
		goerli:
		{
			provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.GOERLI_NODE),
			network_id: '5',
			gasPrice:   20000000000, // 8 Gwei
		},
		kovan: {
			provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.KOVAN_NODE),
			network_id: '42',
			gasPrice:   8000000000, // 8 Gwei
		}
	},
	compilers: {
		solc: {
			version: "0.6.10",
			settings: {
				optimizer: {
					enabled: true,
					runs: 200
				}
			}
		}
	},
	mocha:
	{
		enableTimeouts: false
	}
};
