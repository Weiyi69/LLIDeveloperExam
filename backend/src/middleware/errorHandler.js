const { failure } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error(err);
  return failure(res, 'Request failed', process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message, err.status || 500);
}
module.exports = errorHandler;
