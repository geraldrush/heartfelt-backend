import express from "express";
import passport from "../config/passport.js"; // Ensure passport is properly set up

const router = express.Router();

// Route for initiating Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for Google to redirect to after successful login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }), // Redirect on failure
  (req, res) => {
    res.redirect("/"); // Redirect to home or a protected page after successful login
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle error during logout
    }
    res.redirect("/"); // Redirect after logout
  });
});

export default router;
