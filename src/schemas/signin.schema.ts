import { z } from "zod";

const emailValidation = z
    .string()
    .min(5, "Email must be at least 5 characters long")
    .max(254, "Email must not be longer than 254 characters")

const passwordValidation = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not be longer than 64 characters")

export const signInSchema = z.object({
    email: emailValidation,
    password: passwordValidation
})
