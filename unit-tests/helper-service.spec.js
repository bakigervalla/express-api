const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const HelperService = require('../src/api/common/helper.service')

describe('HelperService', () => {
  describe('onError', () => {
    it('should return 400 errors', () => {
      const error = new Error('400 Error')
      error.code = 401

      let resMock = {
        status: function () {
          return this
        },
        send: sinon.spy(),
      }

      HelperService.onError(error, resMock)
      sinon.assert.calledWith(resMock.send, { message: '400 Error' })
    })

    it('should return Service Unavailable if 503', () => {
      const error = new Error('503 Error')
      error.code = 503

      let resMock = {
        status: function () {
          return this
        },
        send: sinon.spy(),
      }

      HelperService.onError(error, resMock)
      sinon.assert.calledWith(resMock.send, { message: 'Service Unavailable' })
    })
  })
})
