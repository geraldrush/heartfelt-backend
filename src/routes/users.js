// src/routes/users.js
import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, email, profilePicture } = req.body;

  try {
    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // If user does not exist, create a new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          profilePicture,
          // Include other fields as necessary
        },
      });
    }

    // If user exists, you might want to return user information or a success message
    res
      .status(200)
      .json({ message: "User signed in or created successfully", user });
  } catch (error) {
    console.error("Error processing user sign in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
