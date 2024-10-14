require('dotenv').config()
const app = require('../src/server')
const expect = require('chai').expect
const request = require('supertest')(app)
const TestHelpers = require('./test-helpers')
const data = require('./data')

const entity = 'info'
const entityObj = data[entity]
const BASE_URL = `/api/v2/${entity}`

const token = TestHelpers.getToken()

let mongoConnection

describe(entity, () => {
  // Make sure we are connected to mongodb
  before((done) => {
    TestHelpers.connectToMongoDb().then((connection) => {
      mongoConnection = connection
      done()
    })
  })

  it('should return error on unauthorized requests', (done) => {
    request
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .send(entityObj)
      .end((error, response) => {
        expect(response.status).to.equal(400)
        expect(response.error.text).to.equal(
          'Error validating request headers. "authorization" is required.'
        )
        done()
      })
  })

  let id

  it(`should create new ${entity}`, (done) => {
    request
      .post(BASE_URL)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .send(entityObj)
      .end((error, response) => {
        id = response.body.id

        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('id')

        done()
      })
  })

  it(`should fetch created ${entity}`, (done) => {
    request
      .get(`${BASE_URL}/${id}`)
      .set('Accept', 'application/json')
      .set('Authorization', token)
      .end((error, response) => {
        expect(response.status).to.equal(200)
        expect(response.body.orderid).to.equal(entityObj['orderid'])

        done()
      })
  })

  // Close db connection
  after(() => {
    mongoConnection.close()
  })
})
