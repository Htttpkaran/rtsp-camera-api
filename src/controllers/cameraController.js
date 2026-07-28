import MediaMTXService from '../services/MediaMTXService.js';
import { NotFoundError } from '../utils/errors.js';
import { config } from '../config/index.js';
import logger from '../utils/logger.js';

// Helper to format camera data consistently
const mapCamera = (name, source) => ({
  cameraName: name,
  rtspUrl: source,
  webrtc: `${config.mediaMtx.webrtc}/${name}`,
  hls: `${config.mediaMtx.hls}/${name}/index.m3u8`,
  rtsp: `${config.mediaMtx.rtsp}/${name}`
});

export const createCamera = async (req, res, next) => {
  try {
    const { cameraName, rtspUrl } = req.body;

    // Upsert: update if exists, create if not
    let exists = false;
    try {
      await MediaMTXService.getPath(cameraName);
      exists = true;
    } catch (err) {
      if (!(err instanceof NotFoundError)) {
        throw err;
      }
    }

    if (exists) {
      await MediaMTXService.updatePath(cameraName, rtspUrl);
    } else {
      await MediaMTXService.createPath(cameraName, rtspUrl);
    }

    return res.status(exists ? 200 : 201).json({
      success: true,
      camera: mapCamera(cameraName, rtspUrl)
    });
  } catch (err) {
    next(err);
  }
};

export const getAllCameras = async (req, res, next) => {
  try {
    const paths = await MediaMTXService.listPaths();
    const cameras = paths.map(path => mapCamera(path.name, path.source));
    
    return res.status(200).json({
      success: true,
      cameras
    });
  } catch (err) {
    next(err);
  }
};

export const getCamera = async (req, res, next) => {
  try {
    const { cameraName } = req.params;
    const pathConfig = await MediaMTXService.getPath(cameraName);
    
    return res.status(200).json({
      success: true,
      camera: mapCamera(cameraName, pathConfig.source)
    });
  } catch (err) {
    next(err);
  }
};


export const deleteCamera = async (req, res, next) => {
  try {
    const { cameraName } = req.params;

    // Verify the camera exists first
    await MediaMTXService.getPath(cameraName);

    await MediaMTXService.deletePath(cameraName);

    return res.status(200).json({
      success: true
    });
  } catch (err) {
    next(err);
  }
};

export const getCameraStatus = async (req, res, next) => {
  try {
    const { cameraName } = req.params;

    // 1. Verify the camera is configured
    await MediaMTXService.getPath(cameraName);

    // 2. Fetch the active runtime stream status
    const activePath = await MediaMTXService.getActivePath(cameraName);

    const sourceConnected = !!(activePath && activePath.source);
    const streamReady = !!(activePath && activePath.ready);
    const connectedReaders = activePath && Array.isArray(activePath.readers) ? activePath.readers.length : 0;

    return res.status(200).json({
      success: true,
      cameraExists: true,
      sourceConnected,
      streamReady,
      connectedReaders,
      protocolsAvailable: ['rtsp', 'hls', 'webrtc']
    });
  } catch (err) {
    next(err);
  }
};
