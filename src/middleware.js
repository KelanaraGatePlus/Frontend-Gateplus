import { NextResponse } from "next/server";
import * as jose from "jose";

const MAINTENANCE_MODE = false;

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    if (MAINTENANCE_MODE && pathname !== "/OnMaintenance") {
        return NextResponse.redirect(new URL("/OnMaintenance", req.url));
    }

    if (!MAINTENANCE_MODE && pathname === "/OnMaintenance") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const PUBLIC_PATHS = ["/", "/Login", "/Register", "/OnMaintenance"];
    if (PUBLIC_PATHS.includes(pathname)) {
        return NextResponse.next();
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.redirect(
            new URL(`/Login?callbackUrl=${encodeURIComponent(pathname)}`, req.url),
        );
    }

    try {
        // eslint-disable-next-line no-undef
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jose.jwtVerify(token, secret);

        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
            return NextResponse.redirect(new URL("/SessionExpired", req.url));
        }

        if (pathname === "/Login" || pathname === "/Register") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("Token invalid:", err);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};