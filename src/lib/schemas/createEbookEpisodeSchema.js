import { z } from "zod";

const validTypesImage = ["image/jpeg", "image/png", "image/webp"];
const validTypesEbook = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const validTypesAudio = ["audio/mpeg", "audio/mp3"];
const maxSize = 1000 * 1024;

export const createEbookEpisodeSchema = z.object({
    ebookId: z.string().min(1, "Judul series wajib dipilih"),
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
    price: z
        .string()
        .trim()
        .min(1, "price is required")
        .refine((val) => {
            const normalized = val.toLowerCase();
            if (normalized === "free") return true;
            const numeric = Number(val);
            return !Number.isNaN(numeric) && numeric >= 2000;
        }, {
            message: "Harga harus berupa 'free' atau minimal 2000",
        }),
    notedEpisode: z
        .string()
        .max(150, "Maksimal 150 karakter")
        .nullable()
        .optional(),
    episodeCover: z
        .any()
        .refine((file) => file && file.length > 0, "Cover episode ebook wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypesImage.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            `Ukuran maksimal 500KB`
        ),
    bannerStart: z
        .any()
        .refine((file) => file && file.length > 0, "Banner awal ebook wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypesImage.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            `Ukuran maksimal 500KB`
        ),
    bannerEnd: z
        .any()
        .refine((file) => file && file.length > 0, "Banner akhir ebook wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypesImage.includes(file[0].type),
            "Format file tidak valid, harus berformat .jpg, .png, atau .webp"
        )
        .refine(
            (file) => file && file[0] && file[0].size <= maxSize,
            `Ukuran maksimal 500KB`
        ),
    inputFile: z
        .any()
        .refine((file) => file && file.length > 0, "File ebook wajib diunggah")
        .refine(
            (file) => file && file[0] && validTypesEbook.includes(file[0].type),
            "Format file tidak valid, harus berformat .doc atau .docx"
        )
        .refine(
            (file) => file && file[0] && !file[0].name.includes(" "),
            "Nama file tidak boleh mengandung spasi"
        ),
    audioUrl: z
        .any()
        .nullable()
        .optional()
        .refine(
            (file) => !file || file.length === 0 || (file[0] && validTypesAudio.includes(file[0].type)),
            "Format file tidak valid, harus berformat .mp3"
        ),
    termAccepted: z.literal(true).refine(val => val === true, {
        message: "Syarat dan Ketentuan harus disetujui",
    }),
    agreementAccepted: z.literal(true).refine(val => val === true, {
        message: "Agreement harus disetujui",
    }),
});
