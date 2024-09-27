import express from 'express';
const router = express.Router();
import { registerUser } from '../controllers/authController.js';

// POST /api/register
router.post('/register', registerUser);

export default router;
