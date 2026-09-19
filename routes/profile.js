import User from "../models/User.js";
export default async function profile(req, res) {
    try {
        const user = req.user?.userId;
        
       const profile_user = await User.findOne({
    where: {
        uuid: user
    }
});

        console.log(user);
        console.log(profile_user.name);
        console.log(profile_user.email);
        

        return res.status(200).json({
            userId: user,
           name: profile_user.name,
           email: profile_user.email
        });

    } catch (error) {
        

            console.error(error);
        return res.status(500).json({
            message: "Something went wrong",
        });
    }
}