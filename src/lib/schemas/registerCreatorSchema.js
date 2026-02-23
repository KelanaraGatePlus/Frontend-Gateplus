import { z } from "zod";

export const registerCreatorSchema = z.object({
    fullName: z
        .string()
        .min(1, "Full Name is required")
        .max(100, "Full Name must be less than 100 characters")
        .regex(/^[a-zA-Z\s]+$/, "Full Name must contain only letters and spaces"),

    username: z
        .string()
        .min(5, "Username must be at least 5 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9]+$/, "Username must contain only letters and numbers"),

    phone: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(13, "Phone number must be 13 digits maximum")
        .regex(/^\d+$/, "Phone number must contain only digits")
        .regex(/^08\d{8,11}$/, "Phone number must start with 08 and be 10-13 digits"),

    iconUrl: z.string().optional(),
});
