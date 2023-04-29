import express from 'express';
import rateLimit from 'express-rate-limit';

import { signup, login } from '../controllers/auth.controller';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', loginLimiter, login);

export default router;
