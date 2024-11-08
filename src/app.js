import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.js";
import storyRoutes from "./routes/stories.js";
import chatRoutes from "./routes/chat.js";
import connectionRoutes from "./routes/connections.js";
import tokenRoutes from "./routes/tokens.js";
import usersRoutes from "./routes/users.js";
import { PrismaClient } from "@prisma/client";
import { isAuthenticated } from "./middleware/auth.js";
import http from "http"; // Import HTTP module
import { Server } from "socket.io"; // Import Socket.IO

dotenv.config(); // Load environment variables
const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server); // Attach Socket.IO to the server

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/users", isAuthenticated, usersRoutes);
app.use("/stories", isAuthenticated, storyRoutes);
app.use("/chat", isAuthenticated, chatRoutes);
app.use("/connections", isAuthenticated, connectionRoutes);
app.use("/tokens", isAuthenticated, tokenRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Heartfelt Backend API is running");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Listen for an event to set user status to "online"
  socket.on("userOnline", async (userId) => {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { status: "online" },
      });
      console.log(`User ${userId} is now online.`);
    } catch (error) {
      console.error("Error updating user status to online:", error);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", async () => {
    const userId = socket.userId; // Assuming userId is set in the client or passed in an event

    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { status: "offline" },
        });
        console.log(`User ${userId} is now offline.`);
      } catch (error) {
        console.error("Error updating user status to offline:", error);
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
