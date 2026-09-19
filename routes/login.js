import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email Password are req!",
            });
        }

        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const comPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!comPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user.uuid,
                email: user.email,
            },
            "process.env.JWT_ACCESS_SECRET",
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            {
                userId: user.uuid,
            },
            "process.env.JWT_REFRESH_SECRET" ,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            message: "Login successful!",
            accessToken,
            refreshToken,
            user: {
                id: user.uuid,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};
