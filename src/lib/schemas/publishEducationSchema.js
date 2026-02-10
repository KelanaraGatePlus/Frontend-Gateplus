import { z } from "zod";

export const publishEducationSchema = z.object({
    educationId: z.string().min(1, "Education ID is required"),
    termAccepted: z.literal(true).refine(val => val === true, {
        message: "Syarat dan Ketentuan harus disetujui",
    }),
    agreementAccepted: z.literal(true).refine(val => val === true, {
        message: "Agreement harus disetujui",
    }),
});