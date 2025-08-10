import { z } from "zod";

const usernameValidation = z
    .string()
    .min(5, "Username must be atleast 5 characters long")
    .max(20, "Username must not be longer than 20 characters")
    .regex(/^[A-Za-z0-9_]+$/, "Username can only contain letters and numbers (no spaces or special characters).")

const emailValidation = z
    .string()
    .min(5, "Email must be at least 5 characters long")
    .max(254, "Email must not be longer than 254 characters")
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, "Please enter a valid email address.");

const passwordValidation = z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password must not be longer than 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})