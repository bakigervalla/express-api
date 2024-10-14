const sinon = require('sinon')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const expect = chai.expect
const mongoose = require('mongoose')
const History = require('../src/dal/history.model')
const Vehicle = require('../src/dal/vehicle.model')
const HistoryService = require('../src/api/v2/history/history.service')
const ObjectCreator = require('../src/api/common/object-creator.service')
const Xtra = require('../src/dal/xtra.model')

const requestObjectWithHistory = {
  customer_phone: '',
  has_history: true,
  has_xtra: false,
  history: {
    dist: '',
    has_history: true,
    invoice_date: '1999-09-18',
    invoice_no: '20006',
    mechanic: 'M',
    mileage: '32000',
    order_type: 'Faktura',
    signature: 'NBA',
    status: true,
    text: ['02,00 REP', '01,0 9 KONTANT VARE'],
  },
  mob_expiry_date: '',
  next_pkk_service: '',
  next_service_date: '2008-02-05',
  next_work_date: '',
  regno: 'BS12000',
  workshop_name: 'Cars-Verksted',
}

const requestObjNoHistory = {
  customer_phone: '41679234',
  has_history: false,
  has_xtra: false,
  history: {
    dist: '',
    has_history: false,
    invoice_date: '',
    invoice_no: '',
    mechanic: '',
    mileage: '',
    order_type: '',
    signature: '',
    status: true,
    text: [],
  },
  mob_expiry_date: '',
  next_pkk_service: '',
  next_service_date: '',
  next_work_date: '',
  regno: 'CV30993',
  workshop_name: 'Cars-Verksted',
}

const historyObj = {
  id: '5dfcddf80c3fbbc5f522f48d',
  text: ['02,00 REP', '01,0 9 KONTANT VARE'],
  dist: '',
  invoice_date: '1999-09-18T00:00:00.000Z',
  invoice_no: '20006',
  mechanic: 'M',
  mileage: '32000',
  order_type: 'Faktura',
  signature: 'NBA',
  regno: 'BS12000',
  workshop_name: 'Cars-Verksted',
}

const vehicleObj = {
  id: '5da8926f22da6e001038a78d',
  regno: 'BS12000',
  mob_expiry_date: null,
  next_pkk_date: null,
  next_work_date: null,
  next_service_date: null,
}

const mockFindById = {
  limit: function () {
    return this
  },
  exec: () => vehicleObj,
}

const mockFindHistoryById = {
  limit: function () {
    return this
  },
  exec: () => {},
}

const mockVehicleFindOne = {
  limit: function () {
    return this
  },
  exec: () => vehicleObj,
}

const mockHistoryFind = {
  sort: function () {
    return this
  },
  exec: () => [historyObj, historyObj],
}

describe('HistoryService', () => {
  describe('create', () => {
    let historySaveStub
    let vehicleSaveStub
    let vehicleFindOneStub
    let xtraFindOneStub
    let vehicleFindOneAndUpdateStub
    const historySaveSpy = sinon.spy()
    let objectCreatorStub

    beforeEach(() => {
      historySaveStub = sinon.stub(History.prototype, 'save').resolves(historyObj)
      xtraFindOneStub = sinon.stub(Xtra, 'findOne').returns(mockFindHistoryById)
      vehicleSaveStub = sinon.stub(Vehicle.prototype, 'save').resolves(vehicleObj)
      vehicleFindOneStub = sinon.stub(Vehicle, 'findOne').returns(mockFindById)
      vehicleFindOneAndUpdateStub = sinon.stub(Vehicle, 'findOneAndUpdate').returns(mockFindById)
      objectCreatorStub = sinon.stub(ObjectCreator, 'createVehicleObject').returns(vehicleObj)
    })

    afterEach(() => {
      historySaveStub.restore()
      vehicleSaveStub.restore()
      vehicleFindOneStub.restore()
      xtraFindOneStub.restore()
      vehicleFindOneAndUpdateStub.restore()
      objectCreatorStub.restore()
    })

    it('should create history if has_history is set', async () => {
      await HistoryService.create(requestObjectWithHistory)
      sinon.assert.calledOnce(historySaveStub)
    })

    it('should not create history if has_history is false', async () => {
      await HistoryService.create(requestObjNoHistory)
      expect(historySaveSpy.notCalled).to.equal(true)
    })

    it('should create vehicle if not found', async () => {
      vehicleFindOneStub.restore()
      vehicleFindOneStub = sinon.stub(Vehicle, 'findOne').returns({ exec: () => null })

      await HistoryService.create(requestObjectWithHistory)
      expect(vehicleSaveStub.callCount).to.equal(1)
      expect(objectCreatorStub.getCall(0).args[0].regno).to.equal(requestObjectWithHistory.regno)
    })

    it('should throw on error', async () => {})
  })

  describe('historyByRegno', () => {
    let upperCaseStub
    let vehicleFindOneStub
    let historyFindStub
    let createVehicleStub
    let createHistoryObjectStub

    beforeEach(() => {
      upperCaseStub = sinon.stub(String.prototype, 'toUpperCase').returns(vehicleObj.regno)
      vehicleFindOneStub = sinon.stub(Vehicle, 'findOne').returns(mockVehicleFindOne)
      historyFindStub = sinon.stub(History, 'find').returns(mockHistoryFind)
      createVehicleStub = sinon.stub(ObjectCreator, 'createVehicleObject').returns(vehicleObj)
      createHistoryObjectStub = sinon.stub(ObjectCreator, 'createHistoryObject').returns(historyObj)
    })

    afterEach(() => {
      upperCaseStub.restore()
      vehicleFindOneStub.restore()
      historyFindStub.restore()
      createVehicleStub.restore()
      createHistoryObjectStub.restore()
    })

    it('should convert regno to uppercase', async () => {
      await HistoryService.historyByRegno(vehicleObj.regno)
      sinon.assert.calledOnce(upperCaseStub)
    })

    it('should convert find vehicle by regno', async () => {
      await HistoryService.historyByRegno(vehicleObj.regno)
      sinon.assert.calledOnce(vehicleFindOneStub)
    })

    it('should convert find history by regno', async () => {
      await HistoryService.historyByRegno(vehicleObj.regno)
      sinon.assert.calledOnce(historyFindStub)
    })

    it('should create vehicle object', async () => {
      await HistoryService.historyByRegno(vehicleObj.regno)
      sinon.assert.calledOnce(createVehicleStub)
    })

    it('should create history object', async () => {
      await HistoryService.historyByRegno(vehicleObj.regno)
      sinon.assert.calledTwice(createHistoryObjectStub)
    })

    it('should return vehicle with history', async () => {
      const result = await HistoryService.historyByRegno(vehicleObj.regno)
      expect(result.vehicle).to.equal(vehicleObj)
      expect(result.history.length).to.equal(2)
    })
  })

  // describe.skip('findOne', () => {
  //   let mongoFindStub;
  //   let mongoFindByIdStub;
  //
  //   beforeEach(() => {
  //     mongoFindStub = sinon.stub(mongoose.Model, 'find').returns(mockFind);
  //     mongoFindByIdStub = sinon.stub(mongoose.Model, 'findById').returns(mockFindById);
  //   });
  //
  //   afterEach(() => {
  //     mongoFindStub.restore();
  //     mongoFindByIdStub.restore();
  //   });
  //
  //   it('should call model find if has firebase key', async () => {
  //     await ConsentService.findOne('-sdf2435whsfjksdhfkd');
  //     sinon.assert.calledOnce(mongoFindStub);
  //   });
  //
  //   it('should call model findById if not firebase key', async () => {
  //     await ConsentService.findOne('ID');
  //     sinon.assert.calledOnce(mongoFindByIdStub);
  //   });
  // });
  //
  // describe.skip('update', () => {
  //   let mongoUpdateStub;
  //
  //   beforeEach(() => {
  //     mongoUpdateStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate').returns(mockUpdate);
  //   });
  //
  //   afterEach(() => {
  //     mongoUpdateStub.restore();
  //   });
  //
  //   it('should call model findByIdAndUpdate', async () => {
  //     await ConsentService.update(returnObject._id, updateObject);
  //     sinon.assert.calledOnce(mongoUpdateStub);
  //   });
  // });
  //
  // describe.skip('list', () => {
  //   let mongoFindStub;
  //   let mongoFindByIdAndUpdateStub;
  //
  //   beforeEach(() => {
  //     mongoFindStub = sinon.stub(mongoose.Model, 'find').returns(mockFindMany);
  //     mongoFindByIdAndUpdateStub = sinon.stub(mongoose.Model, 'findByIdAndUpdate').returns(mockFindByIdAndUpdate);
  //   });
  //
  //   afterEach(() => {
  //     mongoFindStub.restore();
  //     mongoFindByIdAndUpdateStub.restore();
  //   });
  //
  //   it('should call model find', async () => {
  //     await ConsentService.list('CAS', true);
  //     sinon.assert.calledOnce(mongoFindStub);
  //   });
  //
  //   it('should update on each result if fetched is false', async () => {
  //     await ConsentService.list('CAS', true);
  //     sinon.assert.calledTwice(mongoFindByIdAndUpdateStub);
  //   });
  // });
})
