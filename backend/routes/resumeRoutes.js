import express from 'express';
import { saveResume, getResumes, getResumeById, deleteResume, getLatestResumeByTemplate, getResumeCount } from '../controllers/resumeController.js';
import { authMiddleware } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/save', authMiddleware, saveResume);
router.get('/count', authMiddleware, getResumeCount);
router.get('/', authMiddleware, getResumes);
router.get('/template/:templateId', authMiddleware, getLatestResumeByTemplate);
router.get('/:id', authMiddleware, getResumeById);
router.delete('/:id', authMiddleware, deleteResume);

export default router;