// src/routes/users.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Route to get the current logged-in user's information
router.get("/me", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch user from database using ID or email from `req.user`
    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Controller to create or sign in a user
router.post("/", async (req, res) => {
  const { name, email, googleId } = req.body;

  try {
    // Check if the user already exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create a new user if one doesn't exist
      user = await prisma.user.create({
        data: {
          name: String(name),
          email: String(email),
          googleId: googleId ? String(googleId) : null,
        },
      });
    }

    // Send success response with user data
    res
      .status(200)
      .json({ message: "User signed in or created successfully", user });
  } catch (error) {
    console.error("Error processing user sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Controller to get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Controller to update a user's information
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, googleId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        googleId,
      },
    });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Controller to delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
