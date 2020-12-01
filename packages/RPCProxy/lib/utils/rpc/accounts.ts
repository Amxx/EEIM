'use strict'

import { Signer } from '../interfaces';
import wrapper    from '../wrapper';

export default (signer: Signer ) => wrapper(
	'eth_accounts',
	() => new Promise((resolve, reject) => signer.getAddress().then(address => resolve([ address ])).catch(reject)),
	[]
)
