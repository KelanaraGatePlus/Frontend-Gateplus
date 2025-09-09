import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024;

export const createSeriesSchema = z.object({
    title: z.string().min(1, "Judul wajib diisi").max(50, "Maksimal 50 karakter"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    genre: z.string().min(1, "Genre wajib dipilih"),
    language: z.string().min(1, "Bahasa wajib dipilih"),
    ageRestriction: z.string().min(1, "Batasan usia wajib dipilih"),
    subscriptionPrice: z.string()
        .min(1, "Harga wajib diisi")
        .max(10, "Maksimal 10 karakter")
        .refine(
            (val) => val === "Free" || /^\d+$/.test(val),
            { message: "Harga hanya boleh berisi angka atau tulisan 'Free'" }
        ),
    director: z.string().min(1, "Sutradara wajib diisi").max(100, "Maksimal 100 karakter"),
    producer: z.string().min(1, "Produser wajib diisi").max(100, "Maksimal 100 karakter"),
    writer: z.string().min(1, "Penulis wajib diisi").max(100, "Maksimal 100 karakter"),
    talent: z.string().min(1, "Pemeran wajib diisi").max(100, "Maksimal 100 karakter"),
    releaseYear: z.string().min(4, "Tahun rilis wajib diisi"),
    productionHouse: z.string().min(1, "Rumah produksi wajib diisi").max(50, "Maksimal 50 karakter"),
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
    thumbnail: z
        .any()
        .refine((file) => file && file.length > 0, "Thumbnail wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypes.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            `Ukuran maksimal 500KB`
        ),
    trailerFileUrl: z.string("Trailer video wajib diunggah").min(1, "Trailer video wajib diunggah"),
    canSubscribe: z.boolean().default(false)
});