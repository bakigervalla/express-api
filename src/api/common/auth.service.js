const config = require('../../config')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const UserRoles = require('../../user-roles')
const UserService = require('../v3/user/user.service')

const AuthService = {
  authenticate,
  verifyToken,
  createToken,
  verifySuperUser,
}

module.exports = AuthService

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<*>}
 */
async function authenticate(username, password) {
  try {
    const user = await UserService.findOne({ username }).exec()

    if (!user || !user.authenticate(password)) {
      const error = new Error('Feil brukernavn og/eller passord')
      error.code = 401
      throw error
    }

    return this.createToken(user)
  } catch (e) {
    throw e
  }
}

/**
 * @param {string} token
 * @returns {Promise<*>}
 */
function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.SECRET, (error, decoded) => {
      if (error) {
        return reject(error)
      }

      return resolve(decoded)
    })
  })
}

/**
 * @param {object} user
 * @returns {Promise<string>}
 */
function createToken(user) {
  try {
    const exp =
      user.role === UserRoles.API
        ? moment(moment().add(10, 'years').valueOf()).unix()
        : moment(moment().add(1, 'week').valueOf()).unix()

    let options = {
      id: user._id,
      iss: 'CarsWeb',
      username: user.username,
      exp,
      type: user.role,
    }

    if (user.customer_number) {
      options = {
        ...options,
        wholesaler_id: user.wholesaler_id,
        customer_number: user.customer_number,
      }
    }

    return jwt.sign(options, config['SECRET'])
  } catch (e) {
    throw e
  }
}

async function verifySuperUser(token) {
  try {
    const decoded = await verifyToken(token)
    const user = await UserService.findById(decoded.id)

    if (user && user.role === UserRoles.SUPERUSER) {
      return true
    }

    const error = new Error('No Access')
    error.status = 403
    throw error
  } catch (e) {
    throw e
  }
}
