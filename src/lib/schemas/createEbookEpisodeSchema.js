import { z } from "zod";

const validTypesImage = ["image/jpeg", "image/png", "image/webp"];
const validTypesEbook = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const maxSize = 500 * 1024;

export const createEbookEpisodeSchema = z.object({
    ebookId: z.string().min(1, "Judul series wajib dipilih"),
    title: z.string().min(1, "Judul wajib diisi").max(50, "Maksimal 50 karakter"),
    description: z.string().min(1, "Deskripsi wajib diisi").max(300, "Maksimal 300 karakter"),
    price: z.string().min(1, "Harga wajib diisi"),
    notedEpisode: z
        .string()
        .min(1, "Catatan wajib diisi")
        .max(150, "Maksimal 150 karakter"),
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
    termAccepted: z.literal(true).refine(val => val === true, {
        message: "Syarat dan Ketentuan harus disetujui",
    }),
    agreementAccepted: z.literal(true).refine(val => val === true, {
        message: "Agreement harus disetujui",
    }),
});
