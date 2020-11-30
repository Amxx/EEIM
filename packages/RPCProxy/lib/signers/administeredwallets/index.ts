'use strict'

import { Interface                                                } from '@ethersproject/abi';
import { Provider, TransactionRequest                             } from '@ethersproject/abstract-provider';
import { Signer, TypedDataSigner, TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { Bytes                                                    } from '@ethersproject/bytes';
import { Deferrable, resolveProperties, defineReadOnly            } from '@ethersproject/properties';
import { SignerExtended                                           } from '../../utils/interfaces';
import ADMINISTEREDWALLET                                           from '@eeim/administered-wallets/build/contracts/AdministeredWallet.json';

export default class AdministeredWalletSigner extends Signer implements TypedDataSigner
{
	readonly address: string;
	readonly signer:  SignerExtended;
	readonly abi:     Interface;

	constructor(address: string, signer: SignerExtended, provider: Provider = null)
	{
		super()
		defineReadOnly(this, 'address',  address);
		defineReadOnly(this, 'provider', provider || signer.provider);
		defineReadOnly(this, 'signer', signer);
		defineReadOnly(this, 'abi', new Interface(ADMINISTEREDWALLET.abi));
	}

	connect(provider: Provider): AdministeredWalletSigner {
		return new AdministeredWalletSigner(this.address, this.signer, provider);
	}

	getAddress() : Promise<string>
	{
		return Promise.resolve(this.address);
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
				this.signer.signTransaction({
					to: this.address,
					data: this.abi.encodeFunctionData(
						'forward(address,uint256,bytes)',
						[
							tx.to,
							tx.value || 0,
							tx.data  || '0x',
						],
					),
					gasPrice: tx.gasPrice,
				}).then(resolve).catch(reject);
			}).catch(reject);
		});
	}
}
