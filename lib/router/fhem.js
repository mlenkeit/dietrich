'use strict'

const express = require('express')

module.exports = ({ tunnelHandler }) => {
  const router = express.Router()

  router.use((req, res) => {
    if (!tunnelHandler.connected('fhem')) {
      return res.status(504).send('No client to forward request to')
    }
    tunnelHandler.forwardRequest('fhem', req, res)
  })

  return router
}
