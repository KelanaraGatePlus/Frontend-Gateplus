import logoInstagram from "@@/logo/logoSosmed/icons-instagram.svg";
import logoTikTok from "@@/logo/logoSosmed/icons-tiktok.svg";
import logoTwitter from "@@/logo/logoSosmed/icons-twitter.svg";
import logoFacebook from "@@/logo/logoSosmed/icons-facebook.svg";
import logoGooglePlay from "@@/logo/logoSosmed/icons-playstore.svg";
import logoAppleStore from "@@/logo/logoSosmed/icons-appstore.svg";

export const siteMetadata = {
    copyright: "© 2025 GATE+",
    contact: "+62 21 5095 5747",
    email: "gateplusid@gmail.com",
    address: "XL Axiata Tower, 10th Floor Jl. H. R. Rasuna Said X5 Kav. 11-12 Kuningan Tim. Kecamatan Setiabudi DKI Jakarta 12950",
    social: [
        {
            name: "Instagram",
            link: "https://www.instagram.com/kelanarastudio/",
            icon: logoInstagram,
        },
        {
            name: "Tiktok",
            link: "https://www.tiktok.com/@kelanara.studio",
            icon: logoTikTok,
        },
        {
            name: "Twitter",
            link: "https://x.com/kelanarastudio",
            icon: logoTwitter,
        },
        {
            name: "Facebook",
            link: "https://m.facebook.com/people/Kelanara-Studio/61565976179011/",
            icon: logoFacebook,
        },
    ],
    legalLinks: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/term-of-service" },
        { name: "Help Center", href: "/faq" },
    ],
    appDownload: [
        { name: "Play Store", link: "/blank", icon: logoGooglePlay },
        { name: "App Store", link: "/blank", icon: logoAppleStore },
    ],
};