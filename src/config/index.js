import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(5000),
  MEDIAMTX_API: Joi.string().uri().required(),
  MEDIAMTX_WEBRTC: Joi.string().uri().required(),
  MEDIAMTX_HLS: Joi.string().uri().required(),
  MEDIAMTX_RTSP: Joi.string().custom((value, helpers) => {
    if (!value.startsWith('rtsp://') && !value.startsWith('rtsps://')) {
      return helpers.error('any.invalid');
    }
    return value;
  }, 'RTSP URL validation').required()
}).unknown().required();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const config = {
  port: envVars.PORT,
  mediaMtx: {
    api: envVars.MEDIAMTX_API.replace(/\/$/, ''),
    webrtc: envVars.MEDIAMTX_WEBRTC.replace(/\/$/, ''),
    hls: envVars.MEDIAMTX_HLS.replace(/\/$/, ''),
    rtsp: envVars.MEDIAMTX_RTSP.replace(/\/$/, ''),
  }
};
