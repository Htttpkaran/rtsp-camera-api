import { Router } from 'express';
import {
  createCamera,
  getAllCameras,
  getCamera,
  updateCamera,
  deleteCamera,
  getCameraStatus
} from '../controllers/cameraController.js';
import {
  cameraBodySchema,
  cameraUpdateBodySchema,
  cameraNameParamSchema,
  validateBody,
  validateParams
} from '../validators/cameraValidator.js';

const router = Router();

// Create Camera
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

// Update Camera
router.put(
  '/:cameraName',
  validateParams(cameraNameParamSchema),
  validateBody(cameraUpdateBodySchema),
  updateCamera
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
