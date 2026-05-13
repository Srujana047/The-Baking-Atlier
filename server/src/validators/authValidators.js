import { body } from "express-validator";

export const signupValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 60 })
    .withMessage("Name must be 2-60 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be at least 6 characters")

  // TODO: strengthen password rules + add password confirmation field (frontend + backend)
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password").isString().notEmpty().withMessage("Password is required")
];

export const contactValidator = [
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must be 2-60 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("message").trim().isLength({ min: 10, max: 1000 }).withMessage("Message must be 10-1000 characters")
];
