import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024;

export const createPodcastSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi").max(50, "Maksimal 50 karakter"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    genre: z.string().min(1, "Genre wajib dipilih"),
    language: z.string().min(1, "Bahasa wajib dipilih"),
    ageRestriction: z.string().min(1, "Batasan usia wajib dipilih"),
    coverPodcast: z
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
});