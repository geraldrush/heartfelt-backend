import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Ensure this line is present
import session from "express-session";
import passport from "./config/passport.js"; // Passport configuration
import authRoutes from "./routes/auth.js";
import storyRoutes from "./routes/stories.js";
import chatRoutes from "./routes/chat.js";
import connectionRoutes from "./routes/connections.js";
import tokenRoutes from "./routes/tokens.js";
import usersRoutes from "./routes/users.js";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "./middleware/auth.js"; // Import your authentication middleware

dotenv.config(); // Load environment variables from .env file
const app = express();
const prisma = new PrismaClient(); // Initialize Prisma Client

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Set session secret from environment variable
    resave: false,
    saveUninitialized: true,
  })
); // Session middleware
app.use(passport.initialize()); // Initialize Passport for authentication
app.use(passport.session()); // Use Passport session for user sessions

// Routes
app.use("/auth", authRoutes); // Authentication routes (Google OAuth, login)

// Protect the following routes with isAuthenticated middleware
app.use("/users", isAuthenticated, usersRoutes); // User routes
app.use("/stories", isAuthenticated, storyRoutes); // Routes for StoryFeed
app.use("/chat", isAuthenticated, chatRoutes); // Chat functionality
app.use("/connections", isAuthenticated, connectionRoutes); // Sent and Received Requests, Connections
app.use("/tokens", isAuthenticated, tokenRoutes); // Token-related routes

// Health check route
app.get("/", (req, res) => {
  res.send("Heartfelt Backend API is running");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging
  res.status(500).json({ message: err.message }); // Return a generic error message
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
