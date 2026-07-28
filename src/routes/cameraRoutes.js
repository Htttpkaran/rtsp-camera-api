import { Router } from 'express';
import {
  createCamera,
  getAllCameras,
  getCamera,
  deleteCamera,
  getCameraStatus
} from '../controllers/cameraController.js';
import {
  cameraBodySchema,
  cameraNameParamSchema,
  validateBody,
  validateParams
} from '../validators/cameraValidator.js';

const router = Router();

// Create / Update Camera (upsert)
router.post(
  '/',
  validateBody(cameraBodySchema),
  createCamera
);

// Get All Cameras
router.get(
  '/',
  getAllCameras
);

// Get Single Camera
router.get(
  '/:cameraName',
  validateParams(cameraNameParamSchema),
  getCamera
);

// Delete Camera
router.delete(
  '/:cameraName',
  validateParams(cameraNameParamSchema),
  deleteCamera
);

// Get Camera Status
router.get(
  '/:cameraName/status',
  validateParams(cameraNameParamSchema),
  getCameraStatus
);

export default router;
