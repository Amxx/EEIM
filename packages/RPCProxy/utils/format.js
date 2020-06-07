'use strict'

exports.success = (req, res) => (result) => res.json({ id: req.body.id, jsonrpc: '2.0', result })
exports.failure = (req, res) => (error)  => res.json({ id: req.body.id, jsonrpc: '2.0', error  })
