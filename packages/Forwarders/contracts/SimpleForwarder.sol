pragma solidity ^0.6.0;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract SimpleForwarder
{
	using ECDSA for bytes32;

	mapping(address => uint256) public nonces;

	function relayRequest(
		address        target,
		bytes calldata data,
		uint256        nonce,
		bytes calldata sign)
	external
	{
		address sender = hash(target, data, nonce).toEthSignedMessageHash().recover(sign);
		require(nonces[sender]++ == nonce, "invalid-nonce");
		(bool success, bytes memory returndata) = target.call(abi.encodePacked(data, sender));
		require(success, string(returndata));
	}

	function hash(address target, bytes calldata data, uint256 nonce)
	public returns (bytes32)
	{
		return keccak256(abi.encodePacked(
			address(this),
			chainId(),
			target,
			data,
			nonce
		));
	}

	function chainId()
	public pure returns (uint256 id)
	{
		assembly { id := chainid() }
	}
}
