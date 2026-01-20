import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 1000 * 1024;

export const createEbookSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi").max(100, "Maksimal 100 karakter"),
    description: z
        .string()
        .refine((val) => {
            const words = val ? val.trim().split(/\s+/).filter(Boolean) : [];
            return words.length >= 15;
        }, "Deskripsi minimal 15 kata")
        .refine((val) => {
            const words = val ? val.trim().split(/\s+/).filter(Boolean) : [];
            return words.length <= 500;
        }, "Maksimal 500 kata"),
    genre: z
        .array(z.string().min(1, "Genre wajib dipilih"))
        .min(1, "Genre wajib dipilih"),
    language: z.string().min(1, "Bahasa wajib dipilih"),
    ageRestriction: z.string().min(1, "Batasan usia wajib dipilih"),
    canSubscribe: z.boolean().optional(),
    subscriptionPrice: z.any().optional(),
    posterBanner: z
        .any()
        .refine((file) => file && file.length > 0, "Poster banner wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypes.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            `Ukuran maksimal 500KB`
        ),
    coverBook: z
        .any()
        .refine((file) => file && file.length > 0, "Cover book wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypes.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            "Ukuran maksimal 500KB"
        ),
}).superRefine((data, ctx) => {
    if (data.canSubscribe === true) {
        if (!data.subscriptionPrice) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["subscriptionPrice"],
                message: "Harga langganan wajib diisi jika dapat dilanggani",
            });
        } else if (data.subscriptionPrice < 5000) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["subscriptionPrice"],
                message: "Harga langganan minimal 5000",
            });
        }
    }
});