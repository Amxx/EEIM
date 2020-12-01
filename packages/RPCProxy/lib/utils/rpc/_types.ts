import { TypedDataDomain, TypedDataField } from '@ethersproject/abstract-signer';
import { BigNumberish                    } from '@ethersproject/bignumber';
import { BytesLike                       } from '@ethersproject/bytes';

export type TxRequest = {
	to?:       string,
	from?:     string,
	nonce?:    BigNumberish,
	gas?:      BigNumberish,
	gasPrice?: BigNumberish,
	data?:     BytesLike,
	value?:    BigNumberish,
	chainId?:  number,
}

export { TypedDataDomain };
export type TypedDataTypes   = Record<string, Array<TypedDataField>>;
export type typedDataPayload = Record<string, any>;
export type TypedData = {
	types:       TypedDataTypes,
	primaryType: string,
	domain:      TypedDataDomain,
	message:     typedDataPayload,
};
