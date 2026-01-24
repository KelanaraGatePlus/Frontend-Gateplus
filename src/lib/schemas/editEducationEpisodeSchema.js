import { z } from "zod";

const fileOrUrlRequired = ({ field, types, typeMessage }) =>
    z
        .any()
        .refine((value) => {
            if (value instanceof File) return true;
            if (typeof value === "string") return value.trim().length > 0;
            return false;
        }, { message: `${field} is required` })
        .refine((value) => {
            if (value instanceof File && Array.isArray(types)) {
                return types.includes(value.type);
            }
            return true;
        }, { message: typeMessage });

const optionalFileOrUrl = ({ types, typeMessage }) =>
    z
        .any()
        .optional()
        .nullable()
        .refine((value) => {
            // Allow null, undefined, or empty string (for deletion)
            if (value === null || value === undefined || value === "") return true;
            if (value instanceof File) return true;
            if (typeof value === "string") return value.trim().length > 0;
            return false;
        }, { message: "Invalid value" })
        .refine((value) => {
            if (value instanceof File && Array.isArray(types)) {
                return types.includes(value.type);
            }
            return true;
        }, { message: typeMessage });

const parseToInt = (value) => {
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : value;
    }
    return value;
};

export const editEducationEpisodeSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "title is required")
            .max(100, "title must be at most 100 characters"),
        description: z
            .string()
            .trim()
            .min(1, "description is required")
            .min(10, "description must be at least 10 characters")
            .max(500, "description must be at most 500 characters"),
        episodeFileUrl: fileOrUrlRequired({
            field: "episodeFileUrl",
            types: ["video/mp4", "video/quicktime"],
            typeMessage: "Episode hanya boleh berformat MP4 atau MOV",
        }),
        duration: z
            .preprocess(parseToInt, z.number().int().min(1, "duration must be at least 1 minute")),
        editModuleUrl: optionalFileOrUrl({
            types: [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/pdf",
            ],
            typeMessage: "Module hanya boleh berformat DOC, DOCX, atau PDF",
        }),
        editHomeWorkUrl: optionalFileOrUrl({
            types: [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/pdf",
            ],
            typeMessage: "Homework hanya boleh berformat DOC, DOCX, atau PDF",
        }),
    })
    .passthrough();
