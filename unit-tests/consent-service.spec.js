const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const mongoose = require('mongoose')
const Consent = require('../src/dal/consent.model')
const ConsentService = require('../src/api/v2/consent/consent.service')

const requestObject = {
  dist: 'CAS',
  cuno: '1234567',
  cuname: 'Elin Sunde Wilberg',
  cumobile: '94171848',
  sename: 'Grøfta Bil AS',
  sephone: '32242070',
}

const returnObject = {
  _id: '5b1931a0fd06df92bb836bb9',
  created: '2018-05-31T13:18:47.347Z',
  cumobile: '41679234',
  cuname: 'Dag Jakobsen',
  cuno: '22222222',
  dist: 'CAB',
  fetched: false,
  sename: 'Grøfta Bil AS',
  sephone: '32242070',
  fb_key: '-LDqLRTzJ1lVoVQzYAnx',
  answered: 1576838766132,
}

const updateObject = {
  market_info_sms: true,
  market_info_mail: false,
  reminder_sms: true,
  reminder_mail: false,
  service_sms: true,
  service_mail: false,
}

const mockFind = {
  limit: function () {
    return this
  },
  exec: () => returnObject,
}

const mockFindMany = {
  limit: function () {
    return this
  },
  exec: () => [returnObject, returnObject],
}

const mockFindById = {
  limit: function () {
    return this
  },
  exec: () => returnObject,
}

const mockUpdate = { exec: () => returnObject }

const mockFindByIdAndUpdate = {
  exec: () => returnObject,
}

describe('ConsentService', () => {
  describe('findOne', () => {
    let mongoFindStub
    let mongoFindByIdStub

    beforeEach(() => {
      mongoFindStub = sinon.stub(mongoose.Model, 'find').returns(mockFind)
      mongoFindByIdStub = sinon.stub(mongoose.Model, 'findById').returns(mockFindById)
    })

    afterEach(() => {
      mongoFindStub.restore()
      mongoFindByIdStub.restore()
    })

    it('should call model find if has firebase key', async () => {
      await ConsentService.findOne('-sdf2435whsfjksdhfkd')
      sinon.assert.calledOnce(mongoFindStub)
    })

    it('should call model findById if not firebase key', async () => {
      await ConsentService.findOne('ID')
      sinon.assert.calledOnce(mongoFindByIdStub)
    })
  })

  describe('update', () => {
    let mongoUpdateStub

    beforeEach(() => {
      mongoUpdateStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate').returns(mockUpdate)
    })

    afterEach(() => {
      mongoUpdateStub.restore()
    })

    it('should call model findByIdAndUpdate', async () => {
      await ConsentService.update(returnObject._id, updateObject)
      sinon.assert.calledOnce(mongoUpdateStub)
    })
  })

  describe('create', () => {
    let mongoSaveStub

    beforeEach(() => {
      mongoSaveStub = sinon.stub(Consent.prototype, 'save').resolves(returnObject)
    })

    afterEach(() => {
      mongoSaveStub.restore()
    })

    it('should call model save', async () => {
      await ConsentService.create(requestObject)
      sinon.assert.calledOnce(mongoSaveStub)
    })
  })

  describe('list', () => {
    let mongoFindStub
    let mongoFindByIdAndUpdateStub

    beforeEach(() => {
      mongoFindStub = sinon.stub(mongoose.Model, 'find').returns(mockFindMany)
      mongoFindByIdAndUpdateStub = sinon
        .stub(mongoose.Model, 'findByIdAndUpdate')
        .returns(mockFindByIdAndUpdate)
    })

    afterEach(() => {
      mongoFindStub.restore()
      mongoFindByIdAndUpdateStub.restore()
    })

    it('should call model find', async () => {
      await ConsentService.list('CAS', true)
      sinon.assert.calledOnce(mongoFindStub)
    })

    it('should update on each result if fetched is false', async () => {
      await ConsentService.list('CAS', true)
      sinon.assert.calledTwice(mongoFindByIdAndUpdateStub)
    })
  })
})
