// src/controllers/storyController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller to get all stories
export const getStories = async (req, res) => {
  try {
    const stories = await prisma.story.findMany();
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to create a new story
// Controller to create a new story
export const createStory = async (req, res) => {
  const { title, content } = req.body;

  // Ensure the authorId comes from the authenticated user
  const authorId = req.user.id; // Assuming req.user is set by Passport

  try {
    const story = await prisma.story.create({
      data: {
        title,
        content,
        authorId, // Use the authenticated user's authorId
      },
    });
    res.status(201).json({ message: "Story created successfully", story });
  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to update an existing story by ID
export const updateStory = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const story = await prisma.story.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.status(200).json({ message: "Story updated successfully", story });
  } catch (error) {
    console.error("Error updating story:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete an existing story by ID
export const deleteStory = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.story.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    console.error("Error deleting story:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
