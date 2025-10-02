"use client";

import React, { Suspense } from "react";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/Context/AuthContext";

function OAuthSuccessPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();

    console.log("OAuth Success Page Loaded");
    useEffect(() => {
        const token = searchParams.get("token");
        const id = searchParams.get("id");
        const image = searchParams.get("image");
        const role = searchParams.get("role");
        const creatorId = searchParams.get("creatorId");
        const creatorImage = searchParams.get("creatorImage");

        const data = {
            token,
            id,
            image,
            role,
            creator: creatorId
                ? {
                    id: creatorId,
                    imageUrl: creatorImage,
                }
                : null,
        };
        login(data);
        router.push("/"); // Ganti ke dashboard kalau perlu
    }, []);

    return <p>Logging in via Google...</p>;
}

export default function OAuthSuccessPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <OAuthSuccessPageInner />
        </Suspense>
    );
}
