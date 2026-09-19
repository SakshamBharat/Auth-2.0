
import bcrypt from "bcrypt";
import otp_Gen from "../method/otp.js";
import User from "../models/User.js";

export const forget_password = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    

    // Find user
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
// Generate OTP
    const otp = otp_Gen();
    console.log("OTP:", otp);

    // Hash OTP before storing it
    const hashedotp = await bcrypt.hash(otp.toString(), 10);
    // Save hashed OTP
    await user.update({
      otp_number: hashedotp,
    });

    return res.status(200).json({
      message: "OTP generated successfully",
      // Don't send OTP in production
      // otp: otp
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

