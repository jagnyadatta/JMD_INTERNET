import express from 'express';
import {
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  addWorkHistory,
  updateWorkHistory,
  deleteWorkHistory,
  searchRecords
} from '../controllers/recordController.js';
import { auth, role } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected and require admin role
router.use(auth, role('admin', 'superadmin'));

// Search route (should come before /:id route)
router.get('/search/:query', searchRecords);

// Main CRUD routes
router.route('/')
  .get(getRecords)
  .post(createRecord);

router.route('/:id')
  .get(getRecordById)
  .put(updateRecord)
  .delete(deleteRecord);

// Work history routes
router.post('/:id/history', addWorkHistory);
router.put('/:recordId/history/:historyId', updateWorkHistory);
router.delete('/:recordId/history/:historyId', deleteWorkHistory);

export default router;