import User from "../models/User.js";
import Unverified_User from "../models/unverified_user.js";

import bcrypt from "bcrypt";

export const verification =  async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required",
        });
    }
    const find_user = await Unverified_User.findOne({
        where: { email }
    })
    if (!find_user) {
        return res.status(404).json({
            message: "User not found or OTP expired",
        });
    }
    const comPassword = await bcrypt.compare(otp, find_user.otp);

    if (!comPassword) {
        return res.status(401).json({
            message: "Invalid otp",
        });
    }
    find_user.otp_verify = true;
    const user = await User.create({
        name: find_user.name,
        email: find_user.email,
        password: find_user.password,
        otp_verify: true
    })

    await find_user.destroy();

    res.status(200).json({
        message: "Email verified! ",
        user: {
            id: user.id,
            name: user.name,
            email: user.email

        }
    });

}
