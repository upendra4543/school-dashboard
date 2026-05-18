import express from "express"
import { registerUser, loginUser ,refreshToken,logoutUser} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router()
router.post("/register",registerUser)
router.post("/login",loginLimiter,loginUser)
router.post("/refresh-token",refreshToken)
router.post("/logout", isAuthenticated, logoutUser)
export default router;