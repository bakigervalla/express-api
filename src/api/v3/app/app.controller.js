const AppService = require('./app.service')
const HelperService = require('../../common/helper.service')

const AppController = {
  all: all,
  create: create,
  findOne: findOne,
  update: update,
  consumers,
  deleteApp,
  appSettings,
  createAppSetting,
}

module.exports = AppController

async function create(req, res) {
  try {
    const user = await AppService.create(req.body)
    return res.status(200).send(user)
  } catch (e) {
    if (e.code === 11000) {
      return res.status(400).send({ message: 'App already exists' })
    }

    return HelperService.onError(e, res)
  }
}

async function all(req, res) {
  try {
    const data = await AppService.all()
    return res.status(200).send({ results: data })
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function findOne(req, res) {
  try {
    const data = await AppService.findOne(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function update(req, res) {
  try {
    const data = await AppService.update(req.params.id, req.body)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function consumers(req, res) {
  try {
    const data = await AppService.consumers(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function deleteApp(req, res) {
  try {
    const data = await AppService.deleteApp(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function appSettings(req, res) {
  try {
    const data = await AppService.appSettings(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}

async function createAppSetting(req, res) {
  try {
    const data = await AppService.createAppSetting(req.params.id, req.body.key)
    return res.status(200).send(data)
  } catch (e) {
    return HelperService.onError(e, res)
  }
}
