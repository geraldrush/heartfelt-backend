// src/routes/users.js
import express from "express";
import {
  getMe,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  logoutUser,
} from "../controllers/usersController.js";

const router = express.Router();

// Ensure authenticated middleware to protect routes
const ensureAuthenticated = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Route to get the current logged-in user's information
router.get("/me", ensureAuthenticated, getMe);

// Route to create or sign in a user
router.post("/", createUser);

// Route to get a user by ID
router.get("/:id", getUserById);

// Route to update a user's information
router.put("/:id", updateUser);

// Route to delete a user
router.delete("/:id", deleteUser);

// Route to get all users
router.get("/", getAllUsers);

// Route to log out the user and set status to offline
router.post("/logout", ensureAuthenticated, logoutUser);

export default router;
