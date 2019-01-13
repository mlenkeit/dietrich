'use strict'

const express = require('express')

const auth = require('./lib/mw/auth')

module.exports = function (opts) {
  const app = express()

  app.use(auth({
    apiToken: opts.api_token,
    basicCredentials: opts.basic_auth
  }))

  // status
  app.get('/', (req, res) => {
    res.status(200).send('ok')
  })

  return app
}
