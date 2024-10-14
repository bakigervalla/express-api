const config = require('../config')

const ApiHelper = {
  returnError,
}

module.exports = ApiHelper

function returnError(res, error) {
  if (error.name === 'TokenExpiredError') {
    return res.status(401).send({ message: error.message })
  } else if (error.code === 403) {
    return res.status(403).send({ message: error.message })
  } else if (error.code === '23505') {
    return res.status(400).send({ message: 'Allerede i bruk' })
  }

  if (config['NODE_ENV'] !== 'production') {
    console.log(error)
  }

  return res.status(500).send({ message: 'Internal Server Error' })
}
