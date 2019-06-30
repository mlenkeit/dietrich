'use strict'

const express = require('express')

const auth = require('./lib/mw/auth')
const bodyParser = require('body-parser')
const fhem = require('./lib/router/fhem')
const localtunnel = require('./lib/router/localtunnel')
const metadataHeaders = require('./lib/mw/metadata-headers')
const piDab = require('./lib/router/pi-dab')
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
  app.use(bodyParser.json())

  // status
  app.get('/', (req, res) => {
    res.status(200).send('ok')
  })

  // routers
  app.use(localtunnel({
    tunnelHandler: tunnelHandler
  }))
  app.use('/fhem', fhem({
    tunnelHandler: tunnelHandler
  }))
  app.use('/pi-dab', piDab({
    tunnelHandler: tunnelHandler
  }))

  return app
}
