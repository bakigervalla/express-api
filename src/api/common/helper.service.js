const logger = require('../../logger')

const HelperService = {
  onError: onError,
}

module.exports = HelperService

function onError(e, res) {
  logger.error(e)

  if (e.code && e.code <= 500) {
    return res.status(e.code).send({ message: e.message })
  }

  if (e.code === 503) {
    return res.status(503).send({ message: 'Service Unavailable' })
  }

  return res.status(500).send({ message: 'Internal Server Error' })
}
