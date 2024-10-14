const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const mongoose = require('mongoose')
const expect = chai.expect
const Info = require('../src/dal/info.model')
const InfoService = require('../src/api/v2/info/info.service')
const moment = require('moment')

const infoRequestObject = {
  order_id: '002213',
  expires: 1459843384240,
  reg_id: 'BP76422',
  result: ['12', '15', '17', '20'],
  se_name: 'Cars Software AS',
  se_phone: '32242070',
  cu_name: 'Elin Sunde Wilberg',
  cu_mobile: '94171848',
}

const infoReturnObject = {
  id: '5c5be9580b82de54300ad809',
  orderid: '002213',
  created: moment().valueOf(),
  expires: 1549531284892,
  regid: 'BP76422',
  sename: 'Cars Software AS',
  sephone: '32242070',
  cuname: 'Elin Sunde Wilberg',
  cumobile: '94171848',
  result: ['12', '15', '17', '20'],
  order: [],
  booked: 1576838766132,
}

const mockFindById = {
  limit: function () {
    return this
  },
  exec: () => infoReturnObject,
}

const mockFindByIdAndUpdate = {
  exec: () => infoReturnObject,
}

describe('InfoService', () => {
  describe('findOne', () => {
    let mongoFindStub

    beforeEach(() => {
      mongoFindStub = sinon.stub(mongoose.Model, 'findById').returns(mockFindById)
    })

    afterEach(() => {
      mongoFindStub.restore()
    })

    it('should call model findById', async () => {
      await InfoService.findOne('ID')
      sinon.assert.calledOnce(mongoFindStub)
    })
  })

  describe('create', () => {
    let mongoSaveStub

    beforeEach(() => {
      mongoSaveStub = sinon.stub(Info.prototype, 'save').resolves(infoReturnObject)
    })

    afterEach(() => {
      mongoSaveStub.restore()
    })

    it('should call model save', async () => {
      await InfoService.create(infoRequestObject)
      sinon.assert.calledOnce(mongoSaveStub)
    })

    it('should return info object', async () => {
      const result = await InfoService.create(infoRequestObject)

      expect(result).to.have.property('id')
      expect(result.orderid).to.equal(infoRequestObject.orderid)
      expect(result.created).to.equal(infoReturnObject.created)
      expect(result.expires).to.be.a('number')
      expect(result.regid).to.equal(infoRequestObject.regid)
      expect(result.sename).to.equal(infoRequestObject.sename)
      expect(result.cuname).to.equal(infoRequestObject.cuname)
      expect(result.cumobile).to.equal(infoRequestObject.cumobile)
      expect(result.result).to.be.an('array')
      expect(result.order).to.be.an('array')
      expect(result.booked).to.equal(infoReturnObject.booked)
    })
  })

  describe('update', () => {
    let mongoFindAndUpdateStub

    beforeEach(() => {
      mongoFindAndUpdateStub = sinon
        .stub(mongoose.Model, 'findByIdAndUpdate')
        .returns(mockFindByIdAndUpdate)
    })

    afterEach(() => {
      mongoFindAndUpdateStub.restore()
    })

    it('should call model findById', async () => {
      await InfoService.update('ID', {})
      sinon.assert.calledOnce(mongoFindAndUpdateStub)
    })
  })
})
