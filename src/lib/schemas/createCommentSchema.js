import { z } from "zod";

export const createCommentSchema = z.object({
    message: z
        .string()
        .min(1, "Silakan isi terlebih dahulu")
        .max(150, "Maksimal 150 karakter"),
    donation: z.number().nullable().optional(),
    contentType: z.enum([
        'EBOOK',
        'COMIC',
        'PODCAST',
        'SERIES',
        'MOVIE'
    ]),
    episodeEbookId: z.string().min(1).optional(),
    episodeComicsId: z.string().min(1).optional(),
    episode_podcastId: z.string().min(1).optional(),
    episodeSeriesId: z.string().min(1).optional(),
    movieId: z.string().min(1).optional(),
});
