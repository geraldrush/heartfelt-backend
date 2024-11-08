import express from "express";
import passport from "../config/passport.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Route for initiating Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google to redirect to after successful login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      // Update the user status to "online"
      await prisma.user.update({
        where: { googleId: req.user.googleId },
        data: { status: "online" },
      });
      res.redirect("/"); // Redirect to home or protected page after login
    } catch (error) {
      console.error("Error updating user status to online:", error);
      res.redirect("/login"); // Redirect to login page on error
    }
  }
);

// Logout route
router.get("/logout", async (req, res, next) => {
  try {
    // Update the user status to "offline"
    await prisma.user.update({
      where: { googleId: req.user.googleId },
      data: { status: "offline" },
    });
    // Log out the user
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/"); // Redirect after logout
    });
  } catch (error) {
    console.error("Error updating user status to offline:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
