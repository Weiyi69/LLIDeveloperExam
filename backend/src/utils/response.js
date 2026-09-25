const success = (res, message, data, status = 200) =>
  res.status(status).json({
    success: true,
    message,
    data,
  })

const failure = (res, message, error, status = 500) =>
  res.status(status).json({
    success: false,
    message,
    error,
  })

module.exports = { success, failure }
