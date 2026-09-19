// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyResetToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if header is empty or not formatted as "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Access denied. Token is missing or empty.",
      });
    }

    // 2. Extract token string (splits "Bearer <token>" at space and takes second element)
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Token string is empty.",
      });
    }

    // 3. Verify token and decode payload
    const decoded = jwt.verify(token, "process.env.JWT_ACCESS_SECRET");

    // 4. Attach decoded payload (contains email) to req.resetUser
    req.resetUser = decoded;

    // 5. Move on to Route 3 controller
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired reset token",
    });
  }
};