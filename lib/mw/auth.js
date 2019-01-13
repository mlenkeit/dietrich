'use strict'

const assert = require('assert')
const basicAuth = require('express-basic-auth')
const tokenAuth = require('express-api-token-auth')

module.exports = ({ apiToken, basicCredentials }) => {
  assert(apiToken, 'API token option is required')
  assert(basicCredentials, 'Basic auth option is required')

  console.log(`Current API token is ${apiToken}`)
  console.log(`Current basic auth credential is ${basicCredentials}`)

  const [username, password] = basicCredentials.split(':')
  const checkBasicAuth = basicAuth({
    users: {
      [username]: password
    },
    challenge: true,
    realm: 'dietrich'
  })

  const checkAuth = tokenAuth({
    token: apiToken,
    onError: (req, res, next, params) => checkBasicAuth(req, res, next)
  })

  return checkAuth
}
