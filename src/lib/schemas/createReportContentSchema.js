import { z } from "zod";

const validTypes = ["image/jpeg", "image/png", "image/webp"];
const maxSize = 1000 * 1024;

export const createReportContentSchema = z.object({
    isAnonymous: z.boolean(),
    category: z.string().min(1, "Kategori wajib dipilih"),
    reportDetail: z.string().min(1, "Detail laporan wajib diisi").max(1000, "Maksimal 1000 karakter"),
    evidence: z
        .any()
        .refine((files) => files && files.length > 0, "Bukti wajib diunggah.")
        .refine(
            (files) => Array.from(files).every((file) => validTypes.includes(file.type)),
            "Semua file harus berformat .jpg, .png, atau .webp."
        )
        .refine(
            (files) => Array.from(files).every((file) => file.size <= maxSize),
            "Ukuran setiap file maksimal 500KB."
        ),
    evidenceDetail: z.string().min(1, "Detail bukti wajib diisi").max(500, "Maksimal 500 karakter"),
});