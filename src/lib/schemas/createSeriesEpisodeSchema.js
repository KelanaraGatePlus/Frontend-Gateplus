import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024;

export const createSeriesEpisodeSchema = z.object({
    seriesId: z.string().min(1, "Judul series wajib dipilih"),
    title: z.string().min(1, "Judul wajib diisi").max(50, "Maksimal 50 karakter"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
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
