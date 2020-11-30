'use strict'

export success = (req, res) => (result) => res.json({ id: req.body.id, jsonrpc: '2.0', result })
export failure = (req, res) => (error)  => res.json({ id: req.body.id, jsonrpc: '2.0', error: (error instanceof Error) ? error.message : error })
