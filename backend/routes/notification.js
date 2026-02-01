// routes/notification.js
import express from 'express';
import {
  getActiveNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  getAllNotifications
} from '../controllers/notificationController.js';
import { auth, role } from '../middleware/auth.js';

const router = express.Router();

// Public route
router.get('/active', getActiveNotifications);

// Admin routes
router.get('/', auth, role('admin', 'superadmin'), getAllNotifications);
router.post('/', auth, role('admin', 'superadmin'), createNotification);
router.put('/:id', auth, role('admin', 'superadmin'), updateNotification);
router.delete('/:id', auth, role('admin', 'superadmin'), deleteNotification);

export default router;
