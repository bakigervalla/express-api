const { NODE_ENV, DATABASE_URL } = require('../config')
const Pool = require('pg').Pool
const initTables = require('./migrations')
const logger = require('../logger')

const sslOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ...sslOptions,
})

;(async () => {
  try {
    console.info('Initializing database...')

    pool.query(initTables, null, (error, results) => {
      if (error) {
        logger.error(error)
        return
      }

      logger.info('Database initialized!')
      return results
    })
  } catch (error) {
    logger.error(`Error creating table: ${error}`)
  }
})()

const DatabaseClient = {
  query: (text, params) => {
    return new Promise((resolve, reject) => {
      pool.query(text, params, (error, results) => {
        if (error) {
          return reject(error)
        }

        return resolve(results)
      })
    })
  },
  pool,
}

module.exports = DatabaseClient
