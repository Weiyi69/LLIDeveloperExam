const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../config/env')
const { failure } = require('../utils/response');

function authenticate(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return failure(res, 'Authentication required', 'Please sign in to continue', 401)

  try {
    req.user = jwt.verify(token, jwtSecret)
    return next()
  } catch {
    return failure(res, 'Authentication required', 'Your session has expired. Please sign in again.', 401)
  }
}

function authorize(...roles) {
  return (req, res, next) => roles.includes(req.user.role)
    ? next()
    : failure(res, 'Forbidden', 'You do not have permission for this action', 403);
}

module.exports = { authenticate, authorize };
