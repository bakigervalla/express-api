const JobService = require('./jobs.service')
const ApiHelper = require('../../api-helper')

const JobController = {
  getJobs,
  addJob,
  updateJob,
  removeJob,
  applyToJob,
}

module.exports = JobController

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function getJobs(req, res) {
  try {
    const results = await JobService.getJobs()
    return res.status(200).send(results)
  } catch (e) {
    console.log(e)
    return res.status(400).send('Error')
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function addJob(req, res) {
  try {
    const data = await JobService.addJob(req.body)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function updateJob(req, res) {
  try {
    const data = await JobService.updateJob(req.body)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function removeJob(req, res) {
  try {
    const data = await JobService.removeJob(req.params.id)
    return res.status(200).send(data)
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}

async function applyToJob(req, res) {
  try {
    const response = await JobService.applyToJob(req.body)
    return res.status(200).send({ message: response })
  } catch (e) {
    return ApiHelper.returnError(res, e)
  }
}
