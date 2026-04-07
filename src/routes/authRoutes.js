import express from "express";
import { validateBody } from "../middleware/validate.js";
import { changePassword, login, signup } from "../controllers/authController.js";
import { authChangePasswordSchema, authLoginSchema, authSignupSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.post("/signup", validateBody(authSignupSchema), signup);
router.post("/login", validateBody(authLoginSchema), login);
router.post("/change-password", validateBody(authChangePasswordSchema), changePassword);

export default router;
