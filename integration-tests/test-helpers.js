require('dotenv').config()

const TestHelpers = {
  connectToMongoDb: connectToMongoDb,
  getToken: getToken,
}

module.exports = TestHelpers

function connectToMongoDb() {
  return new Promise((resolve, reject) => {
    require('../src/db')((error, db) => {
      if (error) {
        return reject(error)
      }

      console.log('Connected to MongoDb')
      return resolve(db)
    })
  })
}

function getToken() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Mjg5MjQ1MTIsImV4cCI6MTg0NDQ5Mzc3Mn0.XUgXfHM7_43x4iqEv2H2Yjvah2N2C-Bzos9Mv6407Pk'
}
