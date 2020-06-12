pragma solidity ^0.6.0;

import "@iexec/solidity/contracts/ENStools/ENSReverseRegistration.sol";
import "@opengsn/gsn/contracts/BaseRelayRecipient.sol";
import "./core/CounterfactualTokenRegistry.sol";
import "./AdministeredWallet.sol";


contract AdministeredWalletFactory is
	CounterfactualTokenRegistry,
	BaseRelayRecipient,
	ENSReverseRegistration
{
	constructor()
	public CounterfactualTokenRegistry(
		address(new AdministeredWallet()),
		'AdministeredWallet',
		'AW')
	{
	}

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
	public onlyOwner()
	{
		trustedForwarder = _trustedForwarder;
	}

	function configure(uint256 _tokenid, address _trustedForwarder)
	public onlyOwner()
	{
		AdministeredWallet(address(_tokenid)).configure(_trustedForwarder);
	}

	function adminTransfer(uint256 _tokenid, address _signer)
	public onlyOwner()
	{
		_transfer(ownerOf(_tokenid), _signer, _tokenid);
	}

	// Wallet support
	function encodeInitializer(bytes32 _salt)
	internal view returns (bytes memory)
	{
		return abi.encodeWithSignature('initialize(address)', address(this), _salt);
	}

	function createWallet(address _owner, bytes32 _salt)
	external payable onlyOwner() returns (address payable)
	{
		// instanciate
		address payable wallet = address(_mintCreate(_owner, encodeInitializer(_salt)));
		// configure gsn (trustedForwarder might change between networks)
		configure(uint256(wallet), trustedForwarder);
		// send value
		if (msg.value > 0)
		{
			(bool success, bytes memory returndata) = wallet.call{value: msg.value}('');
			require(success, string(returndata));
		}
		// return
		return wallet;
	}

	function predictWallet(address _owner, bytes32 _salt)
	external view returns (address)
	{
		return address(_mintPredict(_owner, encodeInitializer(_salt)));
	}

	// Tools
	function setName(address _ens, string calldata _name)
	external onlyOwner()
	{
		_setName(IENS(_ens), _name);
	}
}
