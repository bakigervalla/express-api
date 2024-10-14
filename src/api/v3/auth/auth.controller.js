const AuthService = require('../common/auth.service')

const AuthController = {
  authenticate,
  authenticateBilxtraWeb,
}

module.exports = AuthController

/**
 * @param req
 * @param res
 * @return {Promise<*>}
 */
async function authenticate(req, res) {
  try {
    const token = await AuthService.authenticate(req.body.username, req.body.password)
    return res.status(200).json({ token })
  } catch (e) {
    if (e.code) {
      return res.status(e.code).json({ message: e.message })
    }

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}

/**
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function authenticateBilxtraWeb(req, res) {
  try {
    const token = await AuthService.authenticateBilxtraWeb(req.body.phone, req.body.regno)
    return res.status(200).json({ token })
  } catch (e) {
    if (e.code) {
      return res.status(e.code).json({ message: e.message })
    }

    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
