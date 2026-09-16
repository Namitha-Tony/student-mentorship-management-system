const errorHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((item) => item.message).join(', ');
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource identifier';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'A record with that value already exists';
  }

  if (process.env.NODE_ENV !== 'production') console.error(error);
  res.status(statusCode).json({ success: false, message });
};

module.exports = errorHandler;
