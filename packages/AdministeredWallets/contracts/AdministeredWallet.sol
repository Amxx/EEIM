pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "@iexec/solidity/contracts/ERC1271/IERC1271.sol";
import "@iexec/solidity/contracts/ERC1654/IERC1654.sol";
import "@iexec/solidity/contracts/Libs/ECDSA.sol";
import "./core/CounterfactualTokenEntity.sol";

struct Call
{
	address to;
	uint256 value;
	bytes   data;
}

contract AdministeredWallet is
	CounterfactualTokenEntity,
	BaseRelayRecipient,
	ECDSA,
	IERC721Receiver,
	IERC777Recipient,
	IERC1271,
	IERC1654
{
	using Address for address;

	event Executed(address indexed to, uint256 value, bytes data);

	// Potentially usefull: receive eth with data (gsn appended data?)
	// receive()
	// external payable
	// {
	// 	emit Received(msg.sender, msg.value);
	// }
	//
	// fallback()
	// external payable
	// {
	// 	require(msg.value > 0, 'invalid-function-call');
	// 	emit Received(msg.sender, msg.value);
	// }

	// GSN support
	function _msgSender()
	internal view override(Context, BaseRelayRecipient) returns (address payable sender)
	{
		return BaseRelayRecipient._msgSender();
	}

	function versionRecipient()
	external virtual view override returns (string memory)
	{
		return "1.0";
	}

	function getTrustedForwarder()
	public view returns(address)
	{
		return trustedForwarder;
	}

	// Configure
	function configure(address _trustedForwarder)
	public onlyRegistry()
	{
		trustedForwarder = _trustedForwarder;
	}

	// Wallet
	function forward(address to, uint256 value, bytes calldata data)
	external onlyOwnerOrRegistry()
	{
		_execute(to, value, data);
	}

	function forwardBatch(Call[] calldata calls)
	external onlyOwnerOrRegistry()
	{
		for (uint256 i = 0; i < calls.length; ++i)
		{
			_execute(calls[i].to, calls[i].value, calls[i].data);
		}
	}

	function _execute(address to, uint256 value, bytes memory data)
	internal
	{
		(bool success, bytes memory returndata) = payable(to).call{value: value}(data);
		require(success, string(returndata));
		emit Executed(to, value, data);
	}

	// ERC721
	function onERC721Received(address, address, uint256, bytes memory)
	public override returns (bytes4)
	{
		// TODO: emit event ?
		return this.onERC721Received.selector;
	}

	// ERC777
	function tokensReceived(address, address, address, uint256, bytes memory, bytes memory)
	public override
	{
		// TODO: emit event ?
	}

	// ERC 1271
	function isValidSignature(bytes calldata data, bytes calldata signature)
	external view override returns (bytes4 magicValue)
	{
		address signer = owner();
		if (signer.isContract())
		{
			return IERC1271(signer).isValidSignature(data, signature);
		}
		else
		{
			require(signer == recover(keccak256(data), signature));
			return IERC1271(0).isValidSignature.selector;
		}
	}

	// ERC 1654
	function isValidSignature(bytes32 data, bytes calldata signature)
	external view override returns (bytes4 magicValue)
	{
		address signer = owner();
		if (signer.isContract())
		{
			return IERC1654(signer).isValidSignature(data, signature);
		}
		else
		{
			require(signer == recover(data, signature));
			return IERC1654(0).isValidSignature.selector;
		}
	}
}
