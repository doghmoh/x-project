const errorHandler = (err, req, res, next) => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose: Invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ID: ${err.value}`;
  }

  // Mongoose: Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const fields = Object.keys(err.keyValue).join(', ');
    message = `Duplicate field value: ${fields}`;
  }

  if (NODE_ENV === 'development') {
    console.error('❌ Dev Error:', err);
    return res.status(statusCode).json({
      success: false,
      error: message,
      stack: err.stack,
      statusCode
    });
  }

  // Production: hide stack trace and internal error info
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

module.exports = errorHandler;
