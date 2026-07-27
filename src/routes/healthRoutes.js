import { Router } from 'express';
import MediaMTXService from '../services/MediaMTXService.js';

const router = Router();

router.get('/', async (req, res) => {
  const mediaMtxStatus = await MediaMTXService.healthCheck();
  
  return res.status(200).json({
    api: 'UP',
    mediamtx: mediaMtxStatus
  });
});

export default router;
