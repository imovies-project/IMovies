import express from 'express';
import {
  getShowsByMovie,
  getShowById,
  createShow,
  deleteShow,
} from '../controllers/showController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/movie/:movieId', getShowsByMovie);
router.get('/:id', getShowById);

// Admin-only endpoints
router.post('/', verifyToken, requireAdmin, createShow);
router.delete('/:id', verifyToken, requireAdmin, deleteShow);

export default router;
