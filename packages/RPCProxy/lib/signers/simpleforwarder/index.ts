'use strict'

import { Interface                                                } from '@ethersproject/abi';
import { Provider, TransactionRequest                             } from '@ethersproject/abstract-provider';
import { Signer, TypedDataSigner, TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { BigNumberish                                             } from '@ethersproject/bignumber';
import { Bytes, BytesLike, arrayify                               } from '@ethersproject/bytes';
import { Contract                                                 } from '@ethersproject/contracts';
import { keccak256                                                } from '@ethersproject/solidity';
import { Deferrable, resolveProperties, defineReadOnly            } from '@ethersproject/properties';
import { SignerExtended                                           } from '../../utils/interfaces';
import FORWARDER                                                    from '@eeim/administered-wallets/build/contracts/SimpleForwarder.json';

export interface MetaTx {
	forwarder: string,
	chainId:   number,
	to:        string,
	data:      BytesLike,
	nonce:     BigNumberish,
}

export default class SimpleForwarderSigner extends Signer implements TypedDataSigner
{
	readonly signer:    SignerExtended;
	readonly relayer:   Signer;
	readonly forwarder: string;
	readonly abi:       Interface;

	constructor(signer: SignerExtended, relayer: Signer, forwarder: string, provider = null)
	{
		super()
		defineReadOnly(this, 'provider',  provider || signer.provider);
		defineReadOnly(this, 'signer',    signer);
		defineReadOnly(this, 'relayer',   relayer);
		defineReadOnly(this, 'forwarder', forwarder);
		defineReadOnly(this, 'abi',       new Interface(FORWARDER.abi));
	}

	connect(provider: Provider): SimpleForwarderSigner {
		return new SimpleForwarderSigner(this.signer, this.relayer, this.forwarder, provider);
	}

	getAddress() : Promise<string>
	{
		return this.signer.getAddress();
	}

	signMessage(message: Bytes | string): Promise<string>
	{
		return this.signer.signMessage(message);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string>
	{
		return this.signer._signTypedData(domain, types, value);
	}

	signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>
	{
		return new Promise((resolve, reject) => {
			resolveProperties(transaction).then(tx => {
				this._prepare(tx).then(metatx => {
					this.signMessage(arrayify(this._hash(metatx)))
					.then(signature => {
						this.relayer.signTransaction({
							to: this.forwarder,
							data: this.abi.encodeFunctionData(
								'verify(address,bytes,uint256,bytes)',
								[
										metatx.to,
										metatx.data,
										metatx.nonce,
										signature,
								],
							),
							gasPrice: tx.gasPrice,
						}).then(resolve).catch(reject);
					}).catch(reject);
				}).catch(reject);
			}).catch(reject);
		});
	}

	_prepare(tx: TransactionRequest): Promise<MetaTx>
	{
		return new Promise((resolve, reject) => {
			this.signer.getAddress().then(address => {
				const contract = new Contract(this.forwarder, this.abi, this.provider);
				Promise.all([
					tx.to,
					tx.data,
					contract.nonces(address),
					contract.chainId(),
					contract.resolvedAddress,
				]).then(([ to, data, nonce, chainId, forwarder ]) => resolve({
					to:        to,
					data:      data || "0x",
					nonce:     nonce,
					chainId:   chainId,
					forwarder: forwarder,
				})).catch(reject);
			}).catch(reject);
		});
	}

	_hash(metatx: MetaTx): string
	{
		return keccak256([
			'address',
			'uint256',
			'address',
			'bytes',
			'uint256',
		],[
			metatx.forwarder,
			metatx.chainId,
			metatx.to,
			metatx.data,
			metatx.nonce,
		])
	}
}
