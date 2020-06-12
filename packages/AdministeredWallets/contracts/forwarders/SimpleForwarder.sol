pragma solidity ^0.6.0;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";

contract SimpleForwarder
{
	using ECDSA for bytes32;

	mapping(address => uint256) public nonces;

	function verifyAndRelay(
		address        to,
		bytes calldata data,
		uint256        nonce,
		bytes calldata sign)
	external
	{
		address sender = verify(to, data, nonce, sign);
		require(nonces[sender]++ == nonce, "invalid-nonce");
		(bool success, bytes memory returndata) = to.call(abi.encodePacked(data, sender));
		require(success, string(returndata));
	}

	function verify(
		address        to,
		bytes calldata data,
		uint256        nonce,
		bytes calldata sign)
	public view returns (address)
	{
		return hash(to, data, nonce).toEthSignedMessageHash().recover(sign);
	}

	function hash(address to, bytes calldata data, uint256 nonce)
	public view returns (bytes32)
	{
		return keccak256(abi.encodePacked(
			address(this),
			chainId(),
			to,
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
