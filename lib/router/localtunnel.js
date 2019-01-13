'use strict'

const express = require('express')

module.exports = ({ tunnelHandler }) => {
  const router = express.Router()

  router.ws('/receive/:realm', (ws, req) => {
    const realm = req.params.realm
    tunnelHandler.connect(realm, ws)
  })

  return router
}
