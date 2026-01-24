import { z } from "zod";

const parseToInt = (value) => {
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    }

    return value;
};

export const createEducationEpisodeSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "title is required")
            .max(100, "title must be at most 100 characters"),
        educationId: z
            .string()
            .trim()
            .min(1, "educationId is required"),
        description: z
            .string()
            .trim()
            .min(1, "description is required")
            .min(10, "description must be at least 10 characters")
            .max(500, "description must be at most 500 characters"),
        episodeFileUrl: z
            .string()
            .trim()
            .min(1, "episodeFileUrl is required")
            .url("episodeFileUrl must be a valid URL"),
        duration: z
            .preprocess(parseToInt, z.number().int().min(1, "duration must be at least 1 minute")),
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
        homeWorkUrl: z
            .any()
            .optional()
            .refine(
                (file) => {
                    // kalau tidak diisi, lolos validasi
                    if (!file) return true;

                    return file instanceof File;
                },
                {
                    message: "Homework harus berupa file",
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
                    message: "Homework hanya boleh berformat DOC, DOCX, atau PDF",
                }
            ),
        hasQuiz: z.boolean().optional().default(false),
        quizData: z
            .object({
                title: z.string().trim().min(1, "quizData.title is required"),
                description: z.string().trim().optional().nullable(),
                duration: z
                    .preprocess(
                        parseToInt,
                        z.number().int().min(1, "quizData.duration must be at least 1 minute")
                    )
                    .optional(),
                passingScore: z.preprocess(parseToInt, z.number().int().optional()),
                isPublished: z.boolean().optional(),
                questions: z
                    .array(
                        z.object({
                            question: z.string().trim().min(1, "question is required"),
                            options: z
                                .array(
                                    z.object({
                                        text: z.string().trim().min(1, "option text is required"),
                                        isCorrect: z.boolean(),
                                    })
                                )
                                .min(2, "at least two options are required"),
                        })
                    )
                    .min(1, "at least one question is required"),
            })
            .optional()
            .nullable(),
    })
    .strict()
    .refine(
        (data) => {
            // Jika hasQuiz adalah true, quizData wajib ada dan valid
            if (data.hasQuiz) {
                return !!(
                    data.quizData &&
                    Array.isArray(data.quizData.questions) &&
                    data.quizData.questions.length > 0
                );
            }
            // Jika hasQuiz adalah false, quizData bisa kosong/null
            return true;
        },
        {
            message: "quizData is required when hasQuiz is checked",
            path: ["quizData"],
        }
    );