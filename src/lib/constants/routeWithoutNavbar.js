const routeWithoutNavbar = [
    /^\/comics\/read\/[^/]+$/,
    /^\/ebooks\/read\/[^/]+$/,
    /^\/login$/,
    /^\/register$/,
    /^\/auth\/.*/,
    /^\/reset-password$/,
    /^\/verify-email$/,
    /^\/register-creators$/,
    /^\/education(?:\/.*)?$/
];

export default routeWithoutNavbar;