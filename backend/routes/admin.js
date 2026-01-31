import express from 'express';
import {
  adminRegister, // Add this
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  getDashboardStats
} from '../controllers/adminController.js';
import { auth, role } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', adminRegister); // Add this route
router.post('/login', adminLogin);

// Protected routes
router.get('/profile', auth, getAdminProfile);
router.put('/profile', auth, updateAdminProfile);
router.put('/change-password', auth, changePassword);
router.get('/dashboard/stats', auth, role('admin', 'superadmin'), getDashboardStats);

export default router;