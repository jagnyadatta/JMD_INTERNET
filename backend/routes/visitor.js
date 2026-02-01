// routes/visitor.js
import express from 'express';
import { 
  incrementVisitorCount, 
  getVisitorCount, 
  resetVisitorCount 
} from '../controllers/visitorController.js';

const router = express.Router();

router.post('/increment', incrementVisitorCount);
router.get('/count', getVisitorCount);
router.post('/reset', resetVisitorCount); // Optional: for admin

export default router;