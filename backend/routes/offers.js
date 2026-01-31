import express from 'express';
import {
  getActiveOffers,
  createOffer,
  updateOffer,
  trackOfferClick,
  getOfferAnalytics
} from '../controllers/offerController.js';
import { auth, role } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getActiveOffers);
router.post('/:id/track-click', trackOfferClick);

// Protected routes (Admin only)
router.post('/', auth, role('admin', 'superadmin'), uploadSingle, createOffer);
router.put('/:id', auth, role('admin', 'superadmin'), uploadSingle, updateOffer);
router.get('/analytics', auth, role('admin', 'superadmin'), getOfferAnalytics);

export default router;
