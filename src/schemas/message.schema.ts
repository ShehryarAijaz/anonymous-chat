import mongoose from "mongoose";
import { z } from "zod";

export const messageSchema = z.object({
    messageId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid MongoDB ObjectId",
    }),
    content: z
        .string()
        .min(10, {message: "Content must be atleast of 10 characters"})
        .max(300, {message: "Content must be no longer than 300 characters"})
})