import { z } from "zod";

export const createCommentSchema = z.object({
    message: z
        .string()
        .min(1, "Silakan isi terlebih dahulu")
        .max(150, "Maksimal 150 karakter"),
    donation: z.number().nullable().optional(),
    contentType: z.enum([
        'EBOOK',
        'COMIC',
        'PODCAST',
        'SERIES',
        'MOVIE'
    ])
});
