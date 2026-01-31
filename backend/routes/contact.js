import express from 'express';
import {
  submitContact,
  getContacts,
  updateContactStatus,
  getContactStats
} from '../controllers/contactController.js';
import { auth, role } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.post('/', submitContact);

// Protected routes (Admin only)
router.get('/', auth, role('admin', 'superadmin'), getContacts);
router.get('/stats', auth, role('admin', 'superadmin'), getContactStats);
router.put('/:id/status', auth, role('admin', 'superadmin'), updateContactStatus);

export default router;
