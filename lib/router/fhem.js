'use strict'

const express = require('express')

module.exports = ({ tunnelHandler }) => {
  const router = express.Router()

  router.use((req, res) => {
    tunnelHandler.forwardRequest('fhem', req, res)
  })

  return router
}
