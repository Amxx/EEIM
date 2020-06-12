#!/bin/bash

function test()
{
	for ENDPOINT in $ENDPOINTS;
	do
		echo $ENDPOINT/$1/$2
		curl -s -X POST --header "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"$1\",\"params\":$2,\"id\":42}" $ENDPOINT | jqn 'pick(["result","error"])'
	done
}

ENDPOINTS='127.0.0.1:8546'

test \
	'eth_blockNumber' \
	'[]'

test \
	'eth_accounts' \
	'[]'

test \
	'eth_sign' \
	'["0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1","0x68656c6c6f"]' # Hello

test \
	'eth_signTypedData' \
	'["0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1",{"types":{"EIP712Domain":[{"type":"string","name":"name"},{"type":"string","name":"version"},{"type":"uint256","name":"chainId"},{"type":"address","name":"verifyingContract"}],"AppOrder":[{"type":"address","name":"app"},{"type":"uint256","name":"appprice"},{"type":"uint256","name":"volume"},{"type":"bytes32","name":"tag"},{"type":"address","name":"datasetrestrict"},{"type":"address","name":"workerpoolrestrict"},{"type":"address","name":"requesterrestrict"},{"type":"bytes32","name":"salt"}],"DatasetOrder":[{"type":"address","name":"dataset"},{"type":"uint256","name":"datasetprice"},{"type":"uint256","name":"volume"},{"type":"bytes32","name":"tag"},{"type":"address","name":"apprestrict"},{"type":"address","name":"workerpoolrestrict"},{"type":"address","name":"requesterrestrict"},{"type":"bytes32","name":"salt"}],"WorkerpoolOrder":[{"type":"address","name":"workerpool"},{"type":"uint256","name":"workerpoolprice"},{"type":"uint256","name":"volume"},{"type":"bytes32","name":"tag"},{"type":"uint256","name":"category"},{"type":"uint256","name":"trust"},{"type":"address","name":"apprestrict"},{"type":"address","name":"datasetrestrict"},{"type":"address","name":"requesterrestrict"},{"type":"bytes32","name":"salt"}],"RequestOrder":[{"type":"address","name":"app"},{"type":"uint256","name":"appmaxprice"},{"type":"address","name":"dataset"},{"type":"uint256","name":"datasetmaxprice"},{"type":"address","name":"workerpool"},{"type":"uint256","name":"workerpoolmaxprice"},{"type":"address","name":"requester"},{"type":"uint256","name":"volume"},{"type":"bytes32","name":"tag"},{"type":"uint256","name":"category"},{"type":"uint256","name":"trust"},{"type":"address","name":"beneficiary"},{"type":"address","name":"callback"},{"type":"string","name":"params"},{"type":"bytes32","name":"salt"}],"AppOrderOperation":[{"type":"AppOrder","name":"order"},{"type":"uint256","name":"operation"}],"DatasetOrderOperation":[{"type":"DatasetOrder","name":"order"},{"type":"uint256","name":"operation"}],"WorkerpoolOrderOperation":[{"type":"WorkerpoolOrder","name":"order"},{"type":"uint256","name":"operation"}],"RequestOrderOperation":[{"type":"RequestOrder","name":"order"},{"type":"uint256","name":"operation"}]},"primaryType":"RequestOrder","domain":{"name":"iExecODB","version":"5.0.0","chainId":"1","verifyingContract":"0xCE85117c25E357232ca4013B96a01d1522178995"},"message":{"app":"0xf9c88c2ab121cDBd5118985009452ac3f5348857","appmaxprice":3,"dataset":"0x6A0437eECDB3Ac6FD7f44200e9C71B01C64C4EA4","datasetmaxprice":1,"workerpool":"0x0000000000000000000000000000000000000000","workerpoolmaxprice":25,"volume":1,"category":4,"trust":4,"tag":"0x0000000000000000000000000000000000000000000000000000000000000000","requester":"0xF70c73E50C31382Fa02D1dC35e7e2A621eEBf611","beneficiary":"0xF70c73E50C31382Fa02D1dC35e7e2A621eEBf611","callback":"0x0000000000000000000000000000000000000000","params":"<parameters>","salt":"0x63bf8eae99ad066b339ee438248a694c92e7d2917bd35697ca2907e94c7cfeb4","sign":"0x"}}]'

# test \
# 	'eth_sign' \
# 	'["0x7bd4783FDCAD405A28052a0d1f11236A741da593","0x68656c6c6f"]' # Hello

# test \
# 	'eth_sendTransaction' \
# 	'[{
# 		"from": "0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1",
# 		"to": "0xF037353a9B47f453d89E9163F21a2f6e1000B07d",
# 		"value": "0x016345785d8a0000"
# 	}]'

# test \
# 	'eth_sendTransaction' \
# 	'[{
# 		"from": "0x7bd4783FDCAD405A28052a0d1f11236A741da593",
# 		"to": "0xF037353a9B47f453d89E9163F21a2f6e1000B07d",
# 		"value": "0x0"
# 	}]'
