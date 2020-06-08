#!/bin/bash

function test()
{
	for ENDPOINT in $ENDPOINTS;
	do
		echo $ENDPOINT/$1/$2
		curl -s -X POST --header "Content-Type: application/json" --data "{\"jsonrpc\":\"2.0\",\"method\":\"$1\",\"params\":$2,\"id\":42}" $ENDPOINT | jqn 'pick(["result","error"])'
	done
}

ENDPOINTS='127.0.0.1:8545'

test \
	'eth_blockNumber' \
	'[]'

test \
	'eth_accounts' \
	'[]'

# test \
# 	'eth_sign' \
# 	'["0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1","0x68656c6c6f"]' # Hello

test \
	'eth_sign' \
	'["0x7bd4783FDCAD405A28052a0d1f11236A741da593","0x68656c6c6f"]' # Hello

# test \
# 	'eth_sendTransaction' \
# 	'[{
# 		"from": "0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1",
# 		"to": "0x7bd4783FDCAD405A28052a0d1f11236A741da593",
# 		"value": "0x0"
# 	}]'

test \
	'eth_sendTransaction' \
	'[{
		"from": "0x7bd4783FDCAD405A28052a0d1f11236A741da593",
		"to": "0x2c3723b6813f3b9c8eafb28e68ca12504fada0c1",
		"value": "0x0"
	}]'
