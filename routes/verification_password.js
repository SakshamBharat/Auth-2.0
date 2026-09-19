import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

export default async function verification_password(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isValidOTP = await bcrypt.compare(
      otp.toString(),
      user.otp_number
    );

    if (!isValidOTP) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }
    const accessToken = jwt.sign(
      {

        email: user.email,
      },
      "process.env.JWT_ACCESS_SECRET",
      {
        expiresIn: "10m",
      }
    );
    console.log(accessToken)
    return res.status(200).json({
      message: "OTP verified successfully",
      accessToken


    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}

