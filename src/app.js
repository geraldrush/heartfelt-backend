import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import storyRoutes from "./routes/stories.js";
import chatRoutes from "./routes/chat.js";
import connectionRoutes from "./routes/connections.js";
import tokenRoutes from "./routes/tokens.js";
import usersRoutes from "./routes/users.js";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/users", usersRoutes); // User routes
app.use("/auth", authRoutes); // Authentication routes (Google OAuth, login)
app.use("/stories", storyRoutes); // Routes for StoryFeed
app.use("/chat", chatRoutes); // Chat functionality
app.use("/connections", connectionRoutes); // Sent and Received Requests, Connections
app.use("/tokens", tokenRoutes); // Token-related routes

// Health check route
app.get("/", (req, res) => {
  res.send("Heartfelt Backend API is running");
});

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
