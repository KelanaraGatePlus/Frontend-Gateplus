import { z } from "zod";

export const replyCommentSchema = z.object({
    message: z
        .string()
        .min(1, "Silakan isi terlebih dahulu")
        .max(150, "Maksimal 150 karakter"),
});
