import express from 'express';
import {
  getAllMovies,
  getFeaturedMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} from '../controllers/movieController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllMovies);
router.get('/featured', getFeaturedMovies);
router.get('/:id', getMovieById);

// Admin-only endpoints
router.post('/', verifyToken, requireAdmin, createMovie);
router.put('/:id', verifyToken, requireAdmin, updateMovie);
router.delete('/:id', verifyToken, requireAdmin, deleteMovie);

export default router;
