import express from 'express';
import { createShareLink, getSharedResume } from '../controllers/ShareController.js';
import { authMiddleware } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/create', authMiddleware, createShareLink);
router.get('/:id', getSharedResume);

export default router;