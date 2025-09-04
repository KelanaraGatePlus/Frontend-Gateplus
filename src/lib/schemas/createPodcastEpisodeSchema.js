// lib/schemas/createPodcastEpisodeSchema.js
import { z } from "zod";

const validTypesImage = ["image/jpeg", "image/png", "image/webp"];
const validTypesAudio = [
    "audio/mpeg"
];
const maxSize = 500 * 1024;

export const createPodcastEpisodeSchema = z.object({
    podcastId: z.string().min(1, "Judul series wajib dipilih"),
    title: z.string().min(1, "Judul wajib diisi").max(50, "Maksimal 50 karakter"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    price: z.string().min(1, "Harga wajib diisi"),
    notedPodcast: z
        .string()
        .min(1, "Catatan wajib diisi")
        .max(150, "Maksimal 150 karakter"),
    coverPodcastEpisodeURL: z
        .any()
        .refine((file) => file && file.length > 0, "Cover episode podcast wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypesImage.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            `Ukuran maksimal 500KB`
        ),
    podcastFileURL: z
        .any()
        .refine((file) => file && file.length > 0, "File audio wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypesAudio.includes(file[0].type),
            "Format file tidak valid, harus berformat .mp3"
        ),
    creatorsCollaborationId: z.array(z.string()).optional(),
    termAccepted: z.literal(true).refine(val => val === true, {
        message: "Syarat dan Ketentuan harus disetujui",
    }),
    agreementAccepted: z.literal(true).refine(val => val === true, {
        message: "Agreement harus disetujui",
    }),
});