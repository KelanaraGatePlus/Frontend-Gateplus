import { z } from "zod";

export const registerCreatorSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full Name is required"),

    username: z
        .string()
        .min(5, "Username must be at least 5 characters")
        .regex(/^\S*$/, "Username must not contain spaces"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email"),

    phone: z
        .string()
        .regex(/^08\d{8,11}$/, "Phone number must start with 08 and be 10-13 digits"),
});
