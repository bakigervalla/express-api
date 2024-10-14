const Db = require('../../../db/postgres-db')
const generatePassword = require('password-generator')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const qs = require('querystring')

/**
 * @type {{all: all, create: create, resetPassword: resetPassword}}
 */
const UserService = {
  all,
  create,
  resetPassword,
  setPassword,
  findOne,
  findById,
}

module.exports = UserService

async function all() {
  try {
    const query = 'SELECT user_id, username, phone_number, role FROM users'
    const result = await Db.query(query)
    return result.rows
  } catch (e) {
    throw e
  }
}

async function create(data) {
  try {
    const password = generatePassword(8, false)
    const hash = await bcrypt.hash(password, 12)

    const query = `INSERT INTO users (username, phone_number, password, role) VALUES ($1, $2, $3, $4)`
    const values = [data.username, '', hash, data.role]

    await Db.query(query, values)

    // try {
    //   await sendPasswordSMS(data.phone_number, password);
    // } catch (e) {
    //   console.error(e)
    // }

    return data
  } catch (e) {
    throw e
  }
}

async function resetPassword(userId) {
  try {
    const password = generatePassword(8, false)
    const hash = await bcrypt.hash(password, 12)

    const query = `UPDATE users SET password=$2 WHERE user_id=$1 RETURNING phone_number`
    const values = [userId, hash]

    const result = await Db.query(query, values)

    await sendPasswordSMS(result.rows[0].phone_number, password)

    return { message: 'Ok' }
  } catch (e) {
    throw e
  }
}

async function setPassword(userId, password) {
  try {
    const hash = await bcrypt.hash(password, 12)

    const query = `UPDATE users SET password=$2 WHERE user_id=$1 RETURNING phone_number`
    const values = [userId, hash]

    await Db.query(query, values)

    return { message: 'Ok' }
  } catch (e) {
    throw e
  }
}

async function findById(userId) {
  try {
    const query = `SELECT * FROM users WHERE user_id=$1`
    const values = [userId]

    const { rows } = await Db.query(query, values)

    return rows.length > 0 ? rows[0] : null
  } catch (e) {
    throw e
  }
}

async function findOne(username) {
  try {
    const query = `SELECT * FROM users WHERE username=$1`
    const values = [username]

    const { rows } = await Db.query(query, values)

    return rows.length > 0 ? rows[0] : null
  } catch (e) {
    throw e
  }
}

async function sendPasswordSMS(phoneNumber, password) {
  try {
    return await axios.post(
      `${process.env.BLOWERIO_URL}messages`,
      qs.stringify({ to: phoneNumber, message: `Ditt passord til Cars Web Admin ${password}` }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )
  } catch (e) {
    throw e
  }
}
