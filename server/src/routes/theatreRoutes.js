import express from 'express';
import {
  getAllTheatres,
  getTheatreById,
  createTheatre,
  updateTheatre,
  deleteTheatre,
} from '../controllers/theatreController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTheatres);
router.get('/:id', getTheatreById);

// Admin-only endpoints
router.post('/', verifyToken, requireAdmin, createTheatre);
router.put('/:id', verifyToken, requireAdmin, updateTheatre);
router.delete('/:id', verifyToken, requireAdmin, deleteTheatre);

export default router;
