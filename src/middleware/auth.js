// src/middleware/auth.js
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware or route handler
  }
  res.status(401).json({ message: "Unauthorized access. Please log in." }); // User is not authenticated
};
