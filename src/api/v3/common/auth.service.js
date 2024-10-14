const config = require('../../../config')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const UserRoles = require('../../../user-roles')
const Db = require('../../../db/postgres-db')
const bcrypt = require('bcryptjs')

const AuthService = {
  authenticate,
  authenticateBilxtraWeb,
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
    const result = await Db.query('SELECT * FROM users WHERE username=$1 LIMIT 1', [username])
    const user = result.rows.length > 0 ? result.rows[0] : null

    const isCorrectPassword = user ? await bcrypt.compare(password, user.password) : false

    if (!user || !isCorrectPassword) {
      const error = new Error('Feil brukernavn og/eller passord')
      error.code = 401
      throw error
    }

    return createToken(user)
  } catch (e) {
    throw e
  }
}

/**
 * @param {string} phone
 * @param {string} regno
 * @returns {Promise<*>}
 */
async function authenticateBilxtraWeb(phone, regno) {
  try {
    return this.createToken({
      _id: null,
      username: phone,
      role: UserRoles.BILXTRA_WEB,
    })
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

    const options = {
      id: user.user_id,
      iss: 'CarsWeb',
      username: user.username,
      exp,
      type: user.role,
    }

    return jwt.sign(options, config['SECRET'])
  } catch (e) {
    throw e
  }
}

async function verifySuperUser(token) {
  try {
    const decoded = await verifyToken(token)

    const result = await Db.query('SELECT * FROM users WHERE user_id=$1 LIMIT 1', [decoded.id])
    const user = result.rows.length > 0 ? result.rows[0] : null

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
