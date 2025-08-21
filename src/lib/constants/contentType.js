import IconsMovie from "@@/IconsContent/icons-movie.svg";
import IconsSeries from "@@/IconsContent/icons-series.svg";
import IconsPodcast from "@@/IconsContent/icons-podcast.svg";
import IconsEbook from "@@/IconsContent/icons-ebook.svg";
import IconsComic from "@@/IconsContent/icons-comic.svg";

export const contentType = {
    movie: {
        singleName: 'movie',
        pluralName: 'movies',
        icon: IconsMovie,
        haveEpisodes: false
    },
    series: {
        singleName: 'series',
        pluralName: 'series',
        icon: IconsSeries,
        haveEpisodes: true
    },
    podcasts: {
        singleName: 'podcast',
        pluralName: 'podcasts',
        icon: IconsPodcast,
        haveEpisodes: true
    },
    ebooks: {
        singleName: 'ebook',
        pluralName: 'ebooks',
        icon: IconsEbook,
        haveEpisodes: true
    },
    comics: {
        singleName: 'comic',
        pluralName: 'comics',
        icon: IconsComic,
        haveEpisodes: true
    }
}
