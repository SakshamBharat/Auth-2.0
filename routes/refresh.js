import jwt from "jsonwebtoken";

export const refresh =async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required",
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // Create new access token
        const accessToken = jwt.sign(
            {
                userId: decoded.userId,
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: "15m",
            }
        );

        res.status(200).json({
            message: "Access token refreshed",
            accessToken,
        });

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Invalid or expired refresh token",
        });
    }
};
