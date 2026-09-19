

import User from "../models/User.js";
import Unverified_User from "../models/unverified_user.js";
import otpGen from "../method/otp.js";
import bcrypt from "bcrypt";

export const register =  async (req, res) => {


    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name Email Password are req!"
            });


        }

        const exstingUser = await User.findOne({
            where: { email },
        });
        if (exstingUser) {
            return res.status(409).json({
                message: "Email Already exist!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = otpGen();
        console.log(otp);
        


        const hashedotp = await bcrypt.hash(otp, 10);
        const new_user = await Unverified_User.create({
            name,
            email,
            password: hashedPassword,
            otp: hashedotp
        });


        res.status(201).json({
            message: "Registered!",
            user: {
                email: new_user.email,
            }
        })

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Something went wrong",
        });
    }

};
