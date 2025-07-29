"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { storeUserData } from "@/lib/helper/authHelper";

export default function OAuthSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

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

        console.log("OAuth Success Data:", data);
        storeUserData(data);
        router.push("/"); // Ganti ke dashboard kalau perlu
    }, []);

    return <p>Logging in via Google...</p>;
}
