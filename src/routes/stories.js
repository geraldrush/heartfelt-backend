// src/routes/stories.js
import { Router } from "express";
import {
  getStories,
  createStory,
  updateStory,
  deleteStory,
} from "../controllers/storyController.js";

const router = Router();

// Define the GET route for fetching stories
router.get("/", getStories);

// Define the POST route for creating a new story
router.post("/", createStory);

// Define the PATCH route for updating an existing story by ID
router.patch("/:id", updateStory);

// Define the DELETE route for deleting an existing story by ID
router.delete("/:id", deleteStory);

export default router;
