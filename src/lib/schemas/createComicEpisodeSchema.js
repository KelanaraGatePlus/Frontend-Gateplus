import { z } from "zod";

const validTypesImage = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 1000 * 1024;

export const createComicEpisodeSchema = z.object({
    comicId: z.string().min(1, "Judul series wajib dipilih"),
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
    notedEpisode: z
        .string()
        .max(200, "Maksimal 200 karakter")
        .optional()
        .nullable(),
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
    inputFile: z
        .any()
        .refine((files) => Array.isArray(files) && files.length > 0, {
            message: "File wajib diunggah",
        })
        .refine((files) => {
            const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
            return files.every((file) => allowedTypes.includes(file.type));
        }, {
            message: "Format file harus jpg, png, atau webp",
        })
        .refine((files) => {
            const names = files.map((f) => f.name.toLowerCase());
            const uniqueNames = new Set(names);
            return uniqueNames.size === names.length;
        }, {
            message: "Terdapat file dengan nama yang sama",
        }),
    termAccepted: z.literal(true).refine(val => val === true, {
        message: "Syarat dan Ketentuan harus disetujui",
    }),
    agreementAccepted: z.literal(true).refine(val => val === true, {
        message: "Agreement harus disetujui",
    }),
});
