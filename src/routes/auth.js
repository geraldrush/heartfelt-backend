import express from 'express';
import { googleOAuthHandler, loginHandler } from '../controllers/authController.js';

const router = express.Router();

router.post('/google', googleOAuthHandler); // Handle Google OAuth login
router.post('/login', loginHandler);         // Handle user login

export default router;
