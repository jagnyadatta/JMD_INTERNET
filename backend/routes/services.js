import express from 'express';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { auth, role } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Protected routes (Admin only)
router.post('/', auth, role('admin', 'superadmin'), uploadSingle, createService);
router.put('/:id', auth, role('admin', 'superadmin'), uploadSingle, updateService);
router.delete('/:id', auth, role('admin', 'superadmin'), deleteService);

export default router;
