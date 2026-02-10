import { z } from "zod";

export const createEducationSchema = z
    .object({
        title: z.string().trim().min(1, "title is required").max(100, "title must be at most 100 characters"),
        description: z
            .string()
            .trim()
            .min(1, "description is required")
            .min(10, "description must be at least 10 characters")
            .max(5000, "description must be at most 5000 characters"),
        trailerUrl: z
            .string()
            .trim()
            .min(1, "trailerUrl is required")
            .url("trailerUrl must be a valid URL"),
        bannerUrl: z
            .any()
            .refine((file) => file instanceof File, {
                message: "bannerFile is required",
            })
            .refine(
                (file) => {
                    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                    return file instanceof File && validTypes.includes(file.type);
                },
                {
                    message: "Banner hanya boleh berformat PNG atau JPG",
                }
            ),
        thumbnailUrl: z
            .any()
            .refine((file) => file instanceof File, {
                message: "thumbnailFile is required",
            })
            .refine(
                (file) => {
                    // kalau tidak diisi, lolos validasi
                    if (!file) return true;
                    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                    return file instanceof File && validTypes.includes(file.type);
                },
                {
                    message: "Thumbnail hanya boleh berformat PNG atau JPG",
                }
            ),
        finalProjectInstructionUrl: z
            .any()
            .optional()
            .refine(
                (file) => {
                    // kalau tidak diisi, lolos validasi
                    if (!file) return true;
                    return file instanceof File;
                },
                {
                    message: "finalProjectInstructionUrl harus berupa file",
                }
            ),
        instructorPhoto: z
            .any()
            .optional()
            .refine(
                (file) => {
                    // kalau tidak diisi, lolos validasi
                    if (!file) return true;
                    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
                    return file instanceof File && validTypes.includes(file.type);
                },
                {
                    message: "Foto instruktur hanya boleh berformat PNG atau JPG",
                }
            ),
        moduleUrl: z
            .any()
            .optional()
            .refine(
                (file) => {
                    // kalau tidak diisi, lolos validasi
                    if (!file) return true;

                    return file instanceof File;
                },
                {
                    message: "moduleUrl harus berupa file",
                }
            )
            .refine(
                (file) => {
                    // kalau tidak diisi, lolos validasi
                    if (!file) return true;

                    const validTypes = [
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/pdf",
                    ];

                    return validTypes.includes(file.type);
                },
                {
                    message: "Module hanya boleh berformat DOC, DOCX, atau PDF",
                }
            ),
        categoriesId: z
            .string()
            .trim()
            .min(1, "categoriesId is required"),
        benefit: z
            .array(z.string().trim().min(1, "each benefit must not be empty"))
            .min(1, "at least one benefit is required")
            .default([]),
        requirement: z
            .array(z.string().trim().min(1, "each requirement must not be empty"))
            .min(1, "at least one requirement is required")
            .default([]),
        thirdPartyUrl: z
            .string()
            .trim()
            .optional()
            .nullable(),
        finalProjectType: z
            .enum(["QUIZ", "UPLOAD", "MIXED", "NONE"], {
                errorMap: () => ({
                    message: "finalProjectType must be either QUIZ or UPLOAD",
                }),
            }),
        price: z
            .number()
            .int("price must be an integer")
            .min(0, "price must be at least 0")
            .default(0),
        quizData: z
            .object({
                title: z.string().trim().min(1, "Title wajib diisi"),
                description: z.string().trim().nullable().optional(),
                duration: z.number().int().min(1).optional(),
                passingScore: z.number().int().optional(),
                isPublished: z.boolean().default(false),
                questions: z.array(
                    z.object({
                        question: z.string().trim().min(1),
                        options: z.array(
                            z.object({
                                text: z.string().trim().min(1),
                                isCorrect: z.boolean(),
                            })
                        ).min(2),
                    })
                ).min(1),
            })
            .optional()
            .nullable(),
        passingGrade: z
            .number()
            .min(0, "passingGrade must be at least 0")
            .max(100, "passingGrade must be at most 100")
            .default(0),
        haveFinalProject: z.boolean().default(false),
        EducationLevel: z.enum(['FOUNDATION', 'DEVELOPMENT', 'PROFESSIONAL']).default('FOUNDATION'),
        instructorName: z.string().trim().min(1, "instructorName is required").max(50, "instructorName must be at most 50 characters"),
        instructorBio: z.string().trim().min(1, "instructorBio is required").max(300, "instructorBio must be at most 300 characters"),
        haveCertificate: z.boolean().default(false),
    })
    .strict()
    .superRefine((data, ctx) => {
        if (["QUIZ", "MIXED"].includes(data.finalProjectType)) {
            if (!data.quizData || data.quizData.questions.length === 0) {
                ctx.addIssue({
                    path: ["quizData"],
                    message: "Quiz wajib diisi",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (["UPLOAD", "MIXED"].includes(data.finalProjectType)) {
            if (!(data.finalProjectInstructionUrl instanceof File)) {
                ctx.addIssue({
                    path: ["finalProjectInstructionUrl"],
                    message: "File instruksi wajib diunggah",
                    code: z.ZodIssueCode.custom,
                });
            }
        }
    });


