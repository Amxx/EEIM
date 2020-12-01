'use strict'

type restriction<P> =
{
	check:   (param: P) => (boolean | Promise<boolean>),
	message: string,
};

export default
	<P,R>
	(method: string, handle: (params: Array<P>) => Promise<R>, restrictions: Array<restriction<P>> = []) =>
	(params: Array<P> = []) =>
	new Promise(async (resolve, reject) => {
		params.reduce(
			(acc, param, i) => new Promise((resolve, reject) => {
				acc.then(() => {
					if (!restrictions[i])
					{
						resolve();
					}
					else
					{
						const { message, check } = restrictions[i];
						Promise.resolve(check(param)).then(valid => valid ? resolve() : reject({ method, message })).catch(() => reject({ method, message }));
					}
				}).catch(reject);
			}),
			Promise.resolve()
		).then(() => {
			handle(params).then(resolve).catch(reject);
		}).catch(reject);
	});
