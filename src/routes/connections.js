// src/routes/connections.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Route to add a connection
router.post("/add", async (req, res) => {
  const { userId, connectionId } = req.body;

  try {
    const newConnection = await prisma.connection.create({
      data: {
        userId,
        connectionId,
        // Add other relevant fields
      },
    });
    res.status(201).json({ message: "Connection added", newConnection });
  } catch (error) {
    console.error("Error adding connection:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to get all connections for a given user
router.get("/all/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all connections for the user
    const connections = await prisma.connection.findMany({
      where: { userId: parseInt(userId, 10) }, // Ensure userId is an integer
      include: {
        // Optionally, include related user info for the connections
        user: true, // Assumes there's a relation named `user` in your Prisma schema
      },
    });

    res.status(200).json(connections);
  } catch (error) {
    console.error("Error fetching connections:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
