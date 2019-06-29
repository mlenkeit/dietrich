'use strict'

const express = require('express')

module.exports = ({ tunnelHandler }) => {
  const router = express.Router()

  router.use((req, res) => {
    if (!tunnelHandler.connected('pi-dab')) {
      return res.status(504).send('No client to forward request to')
    }
    tunnelHandler.forwardRequest('pi-dab', req, res)
  })

  return router
}
