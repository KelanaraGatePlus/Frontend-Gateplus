export function normalizeOptions(options = []) {
    return options.map((item) => ({
        ...item,
        title: item.title || item.tittle || "-",
    }));
}
