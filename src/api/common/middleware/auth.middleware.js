const AuthService = require('../auth.service')

const AuthMiddleware = {
  isAuthenticated,
  isSuperuser,
}

module.exports = AuthMiddleware

function isAuthenticated(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader.replace('Bearer ', '')

  return AuthService.verifyToken(token)
    .then((_) => next())
    .catch((error) => res.status(403).json({ message: error }))
}

function isSuperuser(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.replace('Bearer ', '')

  AuthService.verifySuperUser(token)
    .then((_) => next())
    .catch((error) => res.status(401).json({ message: error.message }))
}
