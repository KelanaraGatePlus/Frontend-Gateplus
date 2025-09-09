import { z } from "zod";

const validTypesImage = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024;

export const createComicEpisodeSchema = z.object({
    comicId: z.string().min(1, "Judul series wajib dipilih"),
    title: z.string().min(1, "Judul wajib diisi").max(50, "Maksimal 50 karakter"),
    description: z.string().min(1, "Deskripsi wajib diisi"),
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
            const namePattern = /^\d{2}/;
            return files.every((file) => namePattern.test(file.name));
        }, {
            message: "Nama file harus diawali 2 digit angka (contoh: 01_nama.jpg)",
        })
        .refine((files) => {
            return files.every((file) => !file.name.includes(" "));
        }, {
            message: "Nama file tidak boleh mengandung spasi",
        })
        .refine((files) => files.length <= 10, {
            message: "Maksimal 10 file yang bisa diunggah",
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
