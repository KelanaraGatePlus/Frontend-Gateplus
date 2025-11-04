import { contentAPI } from "../api/contentSliceAPI";

export default function useGetLazyEpisodeByType(
    type: string,
) {
    switch (type) {
        case "ebook":
            return contentAPI.useLazyGetAllEpisodeByEbookIdQuery();
        case "comic":
            return contentAPI.useLazyGetAllEpisodeByComicIdQuery();
        case "series":
            return contentAPI.useLazyGetAllEpisodeBySeriesIdQuery();
        case "podcast":
            return contentAPI.useLazyGetAllEpisodeByPodcastIdQuery();
        default:
            // penting! agar tidak undefined
            return [() => Promise.resolve(), { data: null, isLoading: false }] as const;
    }
}
