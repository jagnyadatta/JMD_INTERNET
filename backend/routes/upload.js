import express from 'express';
import {
  uploadDocuments,
  getUploadsByService,
  updateUploadStatus,
  getUploadStats
} from '../controllers/uploadController.js';
import { auth, role } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Public route
router.post('/', uploadMultiple, uploadDocuments);

// Protected routes (Admin only)
router.get('/service/:serviceId', auth, role('admin', 'superadmin'), getUploadsByService);
router.get('/stats', auth, role('admin', 'superadmin'), getUploadStats);
router.put('/:id/status', auth, role('admin', 'superadmin'), updateUploadStatus);

export default router;
