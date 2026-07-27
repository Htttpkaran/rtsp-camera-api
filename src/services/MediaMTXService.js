import axios from 'axios';
import https from 'https';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';
import { NotFoundError, MediaMtxError, AppError } from '../utils/errors.js';

const client = axios.create({
  baseURL: config.mediaMtx.api,
  timeout: 5000,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Helper to handle axios errors and map them to custom app errors
const handleAxiosError = (error, cameraName = '') => {
  if (error.response) {
    const { status, data } = error.response;
    logger.error(`MediaMTX API error response: status=${status}, data=`, data);

    if (status === 404) {
      throw new NotFoundError(cameraName ? `Camera '${cameraName}' not found` : 'Camera not found');
    }
    
    throw new AppError(data?.description || 'MediaMTX API returned an error', status);
  } else if (error.request) {
    logger.error('No response received from MediaMTX API. Error:', error.message);
    throw new MediaMtxError('Unable to communicate with MediaMTX');
  } else {
    logger.error('Error configuring MediaMTX request:', error.message);
    throw new AppError(error.message, 500);
  }
};

class MediaMTXService {
  async healthCheck() {
    try {
      await client.get('/v3/info');
      return 'UP';
    } catch (error) {
      logger.error('MediaMTX health check failed:', error.message);
      return 'DOWN';
    }
  }

  async listPaths() {
    try {
      logger.info('Fetching configured paths from MediaMTX');
      const response = await client.get('/v3/config/paths/list');
      
      let paths = [];
      if (response.data) {
        if (Array.isArray(response.data.items)) {
          paths = response.data.items;
        } else if (response.data.items && typeof response.data.items === 'object') {
          paths = Object.entries(response.data.items).map(([name, conf]) => ({
            name,
            ...conf
          }));
        } else if (typeof response.data === 'object') {
          paths = Object.entries(response.data).map(([name, conf]) => ({
            name,
            ...conf
          }));
        }
      }

      // Filter out the fallback 'all_others' configuration
      return paths.filter(path => path.name !== 'all_others');
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async getPath(cameraName) {
    try {
      logger.info(`Fetching config for path '${cameraName}'`);
      const response = await client.get(`/v3/config/paths/get/${cameraName}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error, cameraName);
    }
  }

  async createPath(cameraName, rtspUrl) {
    try {
      logger.info(`Creating path config for '${cameraName}' with source '${rtspUrl}' forcing TCP transport`);
      const response = await client.post(`/v3/config/paths/add/${cameraName}`, {
        source: rtspUrl,
        rtspTransport: 'tcp'
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error, cameraName);
    }
  }

  async updatePath(cameraName, rtspUrl) {
    try {
      logger.info(`Updating path config for '${cameraName}' to source '${rtspUrl}' forcing TCP transport`);
      const response = await client.patch(`/v3/config/paths/patch/${cameraName}`, {
        source: rtspUrl,
        rtspTransport: 'tcp'
      });
      return response.data;
    } catch (error) {
      handleAxiosError(error, cameraName);
    }
  }

  async deletePath(cameraName) {
    try {
      logger.info(`Deleting path config for '${cameraName}'`);
      const response = await client.delete(`/v3/config/paths/delete/${cameraName}`);
      return response.data;
    } catch (error) {
      handleAxiosError(error, cameraName);
    }
  }

  // Returns runtime state of the stream (source connected, readers, ready, etc.)
  async getActivePath(cameraName) {
    try {
      logger.info(`Fetching active path status for '${cameraName}'`);
      const response = await client.get(`/v3/paths/get/${cameraName}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // If it's 404, it means the stream is not active (offline)
        return null;
      }
      handleAxiosError(error, cameraName);
    }
  }
}

export default new MediaMTXService();
