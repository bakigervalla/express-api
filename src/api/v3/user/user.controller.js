const UserService = require('./user.service')
const ApiHelper = require('../../api-helper')

/**
 * @type {{all: all, create: create, findById: findById}}
 */
const UserController = {
  all,
  findById,
  create,
  resetPassword,
  setPassword,
}

module.exports = UserController

async function all(req, res) {
  try {
    const user = await UserService.all()
    return res.status(200).json({ results: user })
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function findById(req, res) {
  try {
    return res.status(200).json({ message: 'Not implemented' })
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function create(req, res) {
  try {
    const user = await UserService.create(req.body)
    return res.status(200).json(user)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function resetPassword(req, res) {
  try {
    const user = await UserService.resetPassword(req.params.id)
    return res.status(200).json(user)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function setPassword(req, res) {
  try {
    const user = await UserService.setPassword(req.params.id, req.body.password)
    return res.status(200).json(user)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}
