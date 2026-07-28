import Joi from 'joi';

export const cameraBodySchema = Joi.object({
  cameraName: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'cameraName can only contain alphanumeric characters, underscores, and dashes (no spaces or other special characters).',
      'string.max': 'cameraName cannot exceed 50 characters.',
      'any.required': 'cameraName is required.'
    }),
  rtspUrl: Joi.string()
    .required()
    .messages({
      'any.required': 'rtspUrl is required.'
    })
});
export const cameraNameParamSchema = Joi.object({
  cameraName: Joi.string()
    .max(50)
    .pattern(/^[a-zA-Z0-9_-]+$/)
    .required()
    .messages({
      'string.pattern.base': 'cameraName in path parameters can only contain alphanumeric characters, underscores, and dashes.',
      'string.max': 'cameraName cannot exceed 50 characters.',
      'any.required': 'cameraName is required.'
    })
});

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(error);
    }
    req.body = value;
    next();
  };
};

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      return next(error);
    }
    req.params = value;
    next();
  };
};
