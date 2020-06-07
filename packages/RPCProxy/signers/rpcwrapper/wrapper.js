'use strict'

exports.wrapper = (name, method, args = []) => (params) => new Promise((resolve, reject) => {
	try
	{
		if (params.length != args.length)
		{
			reject({ message: `Incorrect number of arguments. Method '${name}' requires exactly ${args.length} arguments. Request specified ${params.length} arguments: ${JSON.stringify(params)}.` })
			return
		}
		args.forEach((restrictions, position) => {
			if (restrictions && !restrictions.check(params[position]))
			{
				reject({ message: restrictions.message })
				return
			}
		})
		method(params).then(resolve).catch(reject)
	}
	catch (message)
	{
		reject({ message })
	}
})
