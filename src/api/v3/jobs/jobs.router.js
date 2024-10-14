const express = require('express')
const validator = require('express-joi-validation')({})
const JobController = require('./jobs.controller')
const JobSchema = require('./jobs.schema')
const AuthMiddleware = require('../common/auth.middleware')
const authSchema = require('../../common/schemas/auth.schema')

const JobRouter = new express.Router()
/**
 * @api {get} v3/jobs - List of vacancies
 * @apiGroup Jobs
 */
JobRouter.get('/', JobController.getJobs)

/**
 * @api {post} v3/jobs Add job
 * @apiGroup Jobs
 */
JobRouter.post(
  '/',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(JobSchema.onAddJob, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  JobController.addJob
)

/**
 * @api {patch} v3/jobs Update job
 * @apiGroup Jobs
 */
JobRouter.patch(
  '/',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  validator.body(JobSchema.onAddJob, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  JobController.updateJob
)

/**
 * @api {delete} v3/jobs/:id Delete a job
 * @apiGroup Jobs
 * @apiHeader (Headers) {String} authorization Authorization token
 */
JobRouter.delete(
  '/:id',
  validator.headers(authSchema.header, {
    joi: { convert: true, allowUnknown: true, abortEarly: true },
  }),
  AuthMiddleware.isSuperuser,
  JobController.removeJob
)

/**
 * @api {post} v3/jobs/sendemail Apply to a job
 * @apiGroup Jobs
 */
JobRouter.post(
  '/application',
  validator.body(JobSchema.onSendJobByEmail, {
    joi: { convert: true, allowUnknown: false, abortEarly: true },
  }),
  JobController.applyToJob
)

module.exports = JobRouter
