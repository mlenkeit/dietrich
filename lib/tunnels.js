'use strict'

const uuidv4 = require('uuid/v4')

module.exports = () => {
  const connections = {}
  const requests = {}

  const tunnels = {
    connected: realm => connections.hasOwnProperty(realm),
    connect: (realm, connection) => {
      if (tunnels.connected(realm)) {
        console.log(`Closing previous connection for realm ${realm}`)
        tunnels.close(realm)
      }
      connections[realm] = connection
      connection.on('message', msg => tunnels._handleMessage(realm, msg))
      connection.on('close', () => tunnels.close(realm))
    },
    connection: realm => connections[realm],
    forwardRequest: (realm, req, res) => {
      if (!tunnels.connected(realm)) {
        console.log(`No client to forward request ${req.url} to ${realm}`)
        return
      }

      console.log(`Forwarding request ${req.url} to realm ${realm}...`)
      const requestId = uuidv4()
      const reqMetadata = {
        uuid: requestId,
        url: req.url,
        headers: req.headers,
        method: req.method,
        body: req.body
      }
      requests[requestId] = {
        reqMetadata: reqMetadata,
        req: req,
        res: res
      }
      tunnels.connection(realm).send(JSON.stringify(reqMetadata))
    },
    _handleMessage: (realm, msg) => {
      try {
        const resMetadata = JSON.parse(msg)
        const requestId = resMetadata.uuid
        const request = requests[requestId]
        if (request) {
          const body = resMetadata.body
          request.res.status(resMetadata.statusCode).set(resMetadata.headers).send(body)
          delete requests[requestId]
        } else {
          console.log(`Ignoring message ${msg}`)
        }
      } catch (e) {
        console.error('Error during handling of message', e)
      }
    },
    close: realm => {
      const connection = tunnels.connection(realm)
      if (connection) {
        console.log(`Closing tunnel to realm ${realm}`)
        connection.close()
      }
      delete connections[realm]
    }
  }

  return tunnels
}
