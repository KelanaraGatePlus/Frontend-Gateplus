const routeWithoutPodcastMiniPlayer = [
    // Example: hide on education pages
    /^\/education(?:\/.*)?$/,
    /^\/ebooks\/read\/[^^/]+$/,
    /^\/comics\/read\/[^^/]+$/,
    /^\/series\/detail\/[^^/]+$/,
    /^\/series\/watch\/[^^/]+$/,
    /^\/movies\/detail\/[^^/]+$/,
];

export default routeWithoutPodcastMiniPlayer;
