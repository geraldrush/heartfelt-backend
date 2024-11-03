// src/routes/stories.js
import { Router } from 'express';
import { getStories } from '../controllers/storyController.js';

const router = Router();

// Define the GET route for fetching stories
router.get('/', getStories);

export default router;
