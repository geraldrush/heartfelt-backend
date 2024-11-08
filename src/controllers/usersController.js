// src/controllers/usersController.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller to get the current logged-in user's information
export const getMe = async (req, res) => {
  try {
    // Fetch user from database using email from `req.user`
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
};

// Controller to create or sign in a user
export const createUser = async (req, res) => {
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
          status: "online", // Set status to online on creation
        },
      });
    } else {
      // Update existing user's status to online
      user = await prisma.user.update({
        where: { email },
        data: { status: "online" },
      });
    }

    res
      .status(200)
      .json({ message: "User signed in or created successfully", user });
  } catch (error) {
    console.error("Error processing user sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get a user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
};

// Controller to update a user's information
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, googleId } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, googleId },
    });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete a user
export const deleteUser = async (req, res) => {
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
};

// Controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to log out the user and set status to offline
export const logoutUser = async (req, res) => {
  try {
    // Update the user's status to offline
    const user = await prisma.user.update({
      where: { email: req.user.email },
      data: { status: "offline" },
    });

    // Clear the session or perform logout steps
    req.logout(); // If using passport.js, this logs the user out
    res.status(200).json({ message: "User logged out successfully", user });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
