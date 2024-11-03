// src/controllers/storyController.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStories = async (req, res) => {
  try {
    const stories = await prisma.story.findMany({
      include: {
        author: true, // Optionally include author details
      },
    });
    res.json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: 'Error fetching stories' });
  }
};
