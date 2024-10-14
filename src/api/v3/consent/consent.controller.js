const ConsentService = require('./consent.service')
const ResponseHandlers = require('../common/response-handlers')

const ConsentController = {
  /**
   * @api {get} v2/consent/{:id} Retrieve a single consent object
   * @apiHeader (Headers) {String} authorization Authorization token
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       "Authorization": "Bearer <token>"
   *     }
   *
   * @apiName get
   * @apiGroup Consent
   *
   * @apiSuccessExample {json} Success response:
   * HTTP/1.1 200 OK
   * {
   *   "cuname": "Dag Jakobsen",
   *   "sename": "Grøftekanten Auto AS",
   *   "accepted": true
   * }
   */
  get: async (req, res) => {
    try {
      const data = await ConsentService.findOne(req.params.id)
      return ResponseHandlers.returnData(res, data)
    } catch (e) {
      return res.status(500).json({ message: error })
    }
  },

  /**
   * @api {post} v2/consent Create a new consent object
   * @apiHeader (Headers) {String} authorization Authorization token
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       "Authorization": "Bearer <token>"
   *     }
   *
   * @apiName post
   * @apiGroup Info
   * @apiParam {String} cuname Customer name
   * @apiParam {String} sename Company name
   *
   * @apiSuccess {Number} id The order ID
   * @apiParamExample {json} Request example:
   * HTTP/1.1 200 OK
   * {
   *    "cuname": "Dag Jakobsen",
   *    "sename": "Grøftekanten Auto AS"
   * }
   *
   * @apiSuccessExample {json} Success response:
   * HTTP/1.1 200 OK
   * {
   *    "id": "-KEG9a2TMRyd3GPnntu_"
   * }
   */
  add: (req, res) => {
    ConsentService.create(req.body)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(500).json({ message: error }))
  },

  update: (req, res) => {
    ConsentService.update(req.params.id, req.body)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(500).json({ message: error }))
  },

  /**
   * @api {post} v2/consent List all consents
   * @apiHeader (Headers) {String} authorization Authorization token
   * @apiHeaderExample {json} Header-Example:
   *     {
   *       "Authorization": "Bearer <token>"
   *     }
   *
   * @apiName get
   * @apiGroup Info
   */
  list: (req, res) => {
    ConsentService.list(req.query.dist, req.query.fetched)
      .then((data) => res.status(200).json(data))
      .catch((error) => res.status(500).json({ message: error }))
  },
}

module.exports = ConsentController
