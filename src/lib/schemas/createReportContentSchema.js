import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 500 * 1024; // 500KB

export const createReportContentSchema = z.object({
    isAnonymous: z.boolean(),
    category: z.string().min(1, "Kategori wajib dipilih"),
    reportDetail: z
        .string()
        .min(1, "Detail laporan wajib diisi")
        .max(1000, "Maksimal 1000 karakter"),
    evidence: z
        .any()
        .optional() // ✅ Menjadi opsional (boleh undefined)
        .nullable() // ✅ Boleh null
        .refine(
            (files) => {
                // Jika tidak ada file (null, undefined, atau bukan FileList), anggap valid
                if (!files || !(files instanceof FileList) || files.length === 0) {
                    return true;
                }
                // Jika ada file, validasi tipenya
                return Array.from(files).every((file) => validTypes.includes(file.type));
            },
            "Semua file harus berformat .jpg, .png, atau .webp."
        )
        .refine(
            (files) => {
                // Jika tidak ada file (null, undefined, atau bukan FileList), anggap valid
                if (!files || !(files instanceof FileList) || files.length === 0) {
                    return true;
                }
                // Jika ada file, validasi ukurannya
                return Array.from(files).every((file) => file.size <= maxSize);
            },
            "Ukuran setiap file maksimal 500KB."
        ),
    evidenceDetail: z
        .string()
        .max(500, "Maksimal 500 karakter")
        .optional() // ✅ Menjadi opsional (boleh undefined)
        .nullable(), // ✅ Boleh null (atau string kosong "")
});