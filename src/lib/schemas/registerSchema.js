import { z } from "zod";

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(5, "Username must be at least 5 characters")
            .regex(/^\S*$/, "Username must not contain spaces"),

        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[0-9]/, "Password must contain at least one number"),

        confirmPassword: z.string().min(1, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
