import { Router } from "express";
import { createSignupSchema } from "./signup.schema.js";
import { createSignup } from "./signup.service.js";
import { env } from "../../config/env.js";

export const signupRouter = Router();

signupRouter.post("/", async (req, res, next) => {
  try {
    const payload = createSignupSchema.parse(req.body);
    const result = await createSignup(payload, env.SIGNUP_REDIRECT_URL);
    res.status(201).json({
      message: "Registro guardado",
      ...result
    });
  } catch (error) {
    next(error);
  }
});
