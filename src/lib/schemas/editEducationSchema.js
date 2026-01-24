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

export const editEducationSchema = z
    .object({
        title: z.string().trim().min(1, "title is required").max(100, "title must be at most 100 characters"),
        description: z
            .string()
            .trim()
            .min(1, "description is required")
            .min(10, "description must be at least 10 characters")
            .max(500, "description must be at most 500 characters"),
        trailerUrl: z
            .string()
            .trim()
            .min(1, "trailerUrl is required")
            .url("trailerUrl must be a valid URL"),
        bannerUrl: fileOrUrlRequired({
            field: "bannerUrl",
            types: ["image/jpeg", "image/jpg", "image/png"],
            typeMessage: "Banner hanya boleh berformat PNG atau JPG",
        }),
        thumbnailUrl: fileOrUrlRequired({
            field: "thumbnailUrl",
            types: ["image/jpeg", "image/jpg", "image/png"],
            typeMessage: "Thumbnail hanya boleh berformat PNG atau JPG",
        }),
        finalProjectInstructionUrl: optionalFileOrUrl({
            types: [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/pdf",
            ],
            typeMessage: "Final project instruction hanya boleh berformat DOC, DOCX, atau PDF",
        }),
        instructorPhoto: optionalFileOrUrl({
            types: ["image/jpeg", "image/jpg", "image/png"],
            typeMessage: "Foto instruktur hanya boleh berformat PNG atau JPG",
        }),
        moduleUrl: optionalFileOrUrl({
            types: [
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/pdf",
            ],
            typeMessage: "Module hanya boleh berformat DOC, DOCX, atau PDF",
        }),
        categoriesId: z.string().trim().min(1, "categoriesId is required"),
        benefit: z
            .array(z.string().trim().min(1, "each benefit must not be empty"))
            .min(1, "at least one benefit is required")
            .default([]),
        requirement: z
            .array(z.string().trim().min(1, "each requirement must not be empty"))
            .min(1, "at least one requirement is required")
            .default([]),
        thirdPartyUrl: z.string().trim().optional().nullable(),
        finalProjectType: z.enum(["QUIZ", "UPLOAD", "MIXED", "NONE"], {
            errorMap: () => ({
                message: "finalProjectType must be either QUIZ or UPLOAD",
            }),
        }),
        price: z.number().int("price must be an integer").min(0, "price must be at least 0").default(0),
        passingGrade: z
            .number()
            .min(0, "passingGrade must be at least 0")
            .max(100, "passingGrade must be at most 100")
            .default(0),
        haveFinalProject: z.boolean().default(false),
        EducationLevel: z.enum(["FOUNDATION", "DEVELOPMENT", "PROFESSIONAL"]).default("FOUNDATION"),
        instructorName: z
            .string()
            .trim()
            .min(1, "instructorName is required")
            .max(50, "instructorName must be at most 50 characters"),
        instructorBio: z
            .string()
            .trim()
            .min(1, "instructorBio is required")
            .max(300, "instructorBio must be at most 300 characters"),
        haveCertificate: z.boolean().default(false),
    })
    .strict();
