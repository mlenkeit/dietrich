'use strict'

const express = require('express')

const auth = require('./lib/mw/auth')
const localtunnel = require('./lib/router/localtunnel')
const metadataHeaders = require('./lib/mw/metadata-headers')
const tunnels = require('./lib/tunnels')

module.exports = function (opts) {
  const tunnelHandler = tunnels()

  const app = express()
  require('express-ws')(app)

  app.use(auth({
    apiToken: opts.api_token,
    basicCredentials: opts.basic_auth
  }))
  app.use(metadataHeaders())

  // status
  app.get('/', (req, res) => {
    res.status(200).send('ok')
  })

  // routers
  app.get('/', localtunnel({
    tunnelHandler: tunnelHandler
  }))

  return app
}
