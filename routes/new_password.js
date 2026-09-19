// controllers/newPasswordController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";

export default async function new_password(req, res) {
  try {
    // 1. Extract email attached by middleware
    const email = req.resetUser?.email;

    if (!email) {
      return res.status(401).json({
        message: "Unauthorized: Missing email in token",
      });
    }

    const { new_password, confirm_new_password } = req.body;

    if (!new_password || !confirm_new_password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (new_password !== confirm_new_password) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // 2. Find user using email extracted from token
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. Hash new password and clear OTP
    const hashPassword = await bcrypt.hash(new_password, 10);
    await user.update({
      password: hashPassword,
      otp_number: null,
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}