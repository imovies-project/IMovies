import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', verifyToken, requireAdmin, getDashboardStats);

export default router;
