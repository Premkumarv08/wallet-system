const responseUtils = {
  success(res, data, message = 'Success') {
    return res.status(200).json({
      status: 'success',
      message,
      data
    });
  },

  error(res, message = 'Error', statusCode = 500) {
    return res.status(statusCode).json({
      status: 'error',
      message
    });
  }
};

module.exports = { responseUtils }; 