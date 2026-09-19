// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";

export const profileMiddleware = (req, res, next) => {
    try {
        const accessHeader = req.headers.authorization;

        // 1. Check Authorization header
        if (!accessHeader || !accessHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Token is missing.",
            });
        }

        // 2. Extract token
        const token = accessHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access denied. Token is empty.",
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(
            token,
            "process.env.JWT_ACCESS_SECRET"
        );

        // 4. Attach decoded user information to request
        req.user = decoded;

        // 5. Continue to controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired access token",
        });
    }
};