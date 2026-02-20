import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 1000 * 1024;

export const editComicSchema = z.object({
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
    genre: z.array(z.string()).min(1, "Genre wajib dipilih"),
    language: z.string().min(1, "Bahasa wajib dipilih"),
    posterBanner: z
        .any()
        .refine((file) => {
            if (!file || file.length === 0) return true; // tidak mengubah file
            const candidate = file[0];
            if (typeof candidate === "string") return true; // existing URL
            if (!(candidate instanceof File)) return false;
            return validTypes.includes(candidate.type);
        }, "Format file tidak valid, harus berformat .jpg, .png, atau .webp")
        .refine((file) => {
            if (!file || file.length === 0) return true;
            const candidate = file[0];
            if (typeof candidate === "string") return true; // existing URL
            if (!(candidate instanceof File)) return false;
            return candidate.size <= maxSize;
        }, "Ukuran maksimal 500KB"),
    coverBook: z
        .any()
        .refine((file) => {
            if (!file || file.length === 0) return true; // tidak mengubah file
            const candidate = file[0];
            if (typeof candidate === "string") return true; // existing URL
            if (!(candidate instanceof File)) return false;
            return validTypes.includes(candidate.type);
        }, "Format file tidak valid, harus berformat .jpg, .png, atau .webp")
        .refine((file) => {
            if (!file || file.length === 0) return true;
            const candidate = file[0];
            if (typeof candidate === "string") return true; // existing URL
            if (!(candidate instanceof File)) return false;
            return candidate.size <= maxSize;
        }, "Ukuran maksimal 500KB"),
});
