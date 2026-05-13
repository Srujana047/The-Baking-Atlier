import express from "express";
import { signup, login, me, contact } from "../controllers/authController.js";
import { signupValidator, loginValidator, contactValidator } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);
router.post("/login", loginValidator, validateRequest, login);
router.post("/contact", contactValidator, validateRequest, contact);
router.get("/me", requireAuth, me);

export default router;

