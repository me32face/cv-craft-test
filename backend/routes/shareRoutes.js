import express from 'express';
import {createShareLink, getSharedResume} from '../controllers/ShareController.js';

const router = express.Router();

router.post('/create', createShareLink);
router.get('/:id', getSharedResume);

export default router;