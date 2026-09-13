import express from "express";
import sequelize from "./config/database.js";
import User from "./models/User.js";
import Unverified_User from "./models/unverified_user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();

app.use(express.json());



app.post("/register", async (req, res) => {


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
        const otp = "1234";
        const hashedotp = await bcrypt.hash(otp, 10);
        const new_user = await Unverified_User.create({
            name,
            email,
            password: hashedPassword,
            otp:hashedotp
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

});

app.post("/verification", async(req,res)=>{
    const {email,otp} = req.body;

    const find_user = await Unverified_User.findOne({
        where:{email}
    })
     const comPassword = await bcrypt.compare(otp, find_user.otp);
        if (!comPassword) {
            return res.status(401).json({
                message: "Invalid otp",
            });
        }
        find_user.otp_verify = true;
        const user = await User.create({
            name:find_user.name,
            email:find_user.email,
            password:find_user.password,
            otp_verify: true
        })

        await find_user.destroy();

        res.status(200).json({
            message:"Email verified! ",
            user:{
                id:user.id,
                name:user.name,
                email:user.email
                
            }
        });
        
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email Password are req!"
            });
        }
        const user = await User.findOne({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid data;"
            })
        }

        const comPassword = await bcrypt.compare(password, user.password);
        if (!comPassword) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        // Access Token
        const accessToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: "15m",
            }
        );

        // Refresh Token
        const refreshToken = jwt.sign(
            {
                userId: user.id,
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login successful!",

            accessToken,

            refreshToken,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });




    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong",
        });
    }



})






async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected successfully");

        await sequelize.sync({alter:true});
        console.log("Users table created");

        app.listen(3000, () => {
            console.log("Server running on http://localhost:3000");
        });
    } catch (error) {
        console.error("Unable to connect:", error);
    }
}

startServer();
