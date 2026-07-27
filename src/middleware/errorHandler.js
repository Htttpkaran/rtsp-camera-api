import logger from '../utils/logger.js';
import Joi from 'joi';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  // 1. Handle Joi Validation Errors
  if (err.isJoi || err instanceof Joi.ValidationError) {
    logger.warn(`Validation Error: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: 'Validation failed'
    });
  }

  // 2. Handle Custom App Errors
  if (err.isOperational) {
    logger.warn(`Operational Error: ${err.message} (Status: ${err.statusCode})`);
    
    let message = err.message;
    if (err.statusCode === 404) {
      message = 'Camera not found';
    } else if (err.statusCode === 409) {
      message = 'Camera already exists';
    } else if (err.statusCode === 503) {
      message = 'Unable to communicate with MediaMTX';
    }

    return res.status(err.statusCode).json({
      success: false,
      message
    });
  }

  // 3. Handle Other/Internal Server Errors
  logger.error('Unhandled System Error:', err);
  
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};

export default errorHandler;
