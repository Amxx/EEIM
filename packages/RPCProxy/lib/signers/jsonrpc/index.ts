'use strict'

import { JsonRpcSigner                   } from '@ethersproject/providers';
import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { _TypedDataEncoder               } from '@ethersproject/hash';

export const EIP712Domain: Array<TypedDataField> = [
	{ type: "string",  name: "name"              },
	{ type: "string",  name: "version"           },
	{ type: "uint256", name: "chainId"           },
	{ type: "address", name: "verifyingContract" },
	{ type: "bytes32", name: "salt"              },
];

export default class _JsonRpcSigner extends JsonRpcSigner
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async _signTypedData(domain: TypedDataDomain, types: Record<string, Array<TypedDataField>>, value: Record<string, any>): Promise<string> {
		const populated = await _TypedDataEncoder.resolveNames(domain, types, value, (name: string) => {
			return this.provider.resolveName(name);
		});

		const address = await this.getAddress();
		const payload = _TypedDataEncoder.getPayload(populated.domain, types, populated.value);
		payload.types.EIP712Domain = EIP712Domain.filter(({ name }) => name in populated.domain);

		return await this.provider.send('eth_signTypedData', [ address.toLowerCase(), payload ]);
	}
}
