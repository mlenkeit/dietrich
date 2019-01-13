'use strict'

module.exports = () => {
  return (req, res, next) => {
    if (res.headersSent) {
      return next()
    }

    // env vars from https://stackoverflow.com/questions/14583282/heroku-display-hash-of-current-commit
    res.set({
      'x-commit': process.env.HEROKU_SLUG_COMMIT,
      'x-release-version': process.env.HEROKU_RELEASE_VERSION,
      'x-release-created-at': process.env.HEROKU_RELEASE_CREATED_AT
    })
    next()
  }
}
