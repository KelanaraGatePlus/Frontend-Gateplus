import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 1000 * 1024;

export const createSeriesEpisodeSchema = z.object({
    seriesId: z.string().min(1, "Judul series wajib dipilih"),
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
    price: z.string().min(1, "Harga wajib diisi"),
    coverEpisode: z
        .any()
        .refine((file) => file && file.length > 0, "Cover episode series wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypes.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            "Ukuran maksimal 500KB"
        ),
    episodeFileUrl: z.string("Video wajib diunggah").min(1, "Video wajib diunggah"),
    termAccepted: z.literal(true).refine(val => val === true, {
        message: "Syarat dan Ketentuan harus disetujui",
    }),
    agreementAccepted: z.literal(true).refine(val => val === true, {
        message: "Agreement harus disetujui",
    }),
});
