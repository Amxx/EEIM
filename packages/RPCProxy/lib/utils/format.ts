'use strict'

export const success =
	(req: any, res: any): any =>
	(result: any): void =>
	res.json({ id: req.body.id, jsonrpc: '2.0', result })

export const failure =
	(req: any, res: any): any =>
	(error:  any): void =>
	res.json({ id: req.body.id, jsonrpc: '2.0', error: (error instanceof Error) ? error.message : error })
