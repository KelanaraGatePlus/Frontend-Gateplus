import { NextResponse } from "next/server";
import * as jose from "jose";

const MAINTENANCE_MODE = false;

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // 🧩 Maintenance Mode
    if (MAINTENANCE_MODE && pathname !== "/maintenance") {
        return NextResponse.redirect(new URL("/maintenance", req.url));
    }
    if (!MAINTENANCE_MODE && pathname === "/maintenance") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    // 🧩 Path publik & verifikasi
    const VERIFICATION_PATHS = ["/otp", "/verify-email"];
    const PUBLIC_PATHS = [
        "/",
        "/maintenance",
        "/privacy-policy",
        "/term-of-service",
        "/faq",
        "/blank",
        "/forgot-password",
        "/oauth-success",
        "/login",
        "/register",
    ];

    // 🧩 Ambil token
    const token = req.cookies.get("token")?.value;

    if (PUBLIC_PATHS.includes(pathname) && !token) {
        return NextResponse.next();
    }

    // 🧩 Jika tidak ada token → redirect login
    if (!token || token.trim() === "") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        // eslint-disable-next-line no-undef
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);
        console.log("Token payload:", payload);

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return NextResponse.redirect(new URL("/session-expired", req.url));
        }

        if (payload.isVerified && VERIFICATION_PATHS.includes(pathname)) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (payload.isVerified === false && !VERIFICATION_PATHS.includes(pathname)) {
            return NextResponse.redirect(new URL("/otp", req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("Token invalid:", err);
        // Hapus cookie rusak biar gak stuck loop
        const res = NextResponse.redirect(new URL("/login", req.url));
        res.cookies.delete("token");
        return res;
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
