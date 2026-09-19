import { Router } from "express";
import { login } from "./login.js";
import { register } from "./register.js";
import { verification } from "./verification.js";
import { refresh } from "./refresh.js";
import { forget_password } from "./forgetPassword.js";
import verification_password from "./verification_password.js";
import new_password from "./new_password.js";
import { verifyResetToken } from "../middleware/auth_middleware.js";
import { profileMiddleware } from "../middleware/profile_middleware.js";
import profile from "./profile.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verification", verification);
router.post("/refresh", refresh);
router.post("/forget_password", forget_password);
router.post("/verification_password", verification_password);
router.post("/new_password", verifyResetToken, new_password);
router.get("/profile", profileMiddleware, profile);

export default router;
