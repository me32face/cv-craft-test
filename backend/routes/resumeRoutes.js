import express from 'express';
import {saveResume, getResumes, getResumeById, deleteResume, getLatestResumeByTemplate, getResumeCount} from '../controllers/resumeController.js';

const router = express.Router();

router.post('/save', saveResume);
router.get('/count', getResumeCount);
router.get('/', getResumes);
router.get('/template/:templateId', getLatestResumeByTemplate);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

export default router;