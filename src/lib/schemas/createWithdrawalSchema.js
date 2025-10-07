import { z } from "zod";

export const createWithdrawalSchema = z.object({
    bankAccountId: z.string().min(1, "Akun bank wajib dipilih"),
    withdrawalAmount: z
        .number()
        .int()
        .min(50000, "Jumlah penarikan minimal Rp 50.000")
        .max(25000000, "Jumlah penarikan maksimal Rp 25.000.000"),
});
