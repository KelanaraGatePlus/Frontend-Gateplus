import React, { useEffect, useState } from 'react';
import CarouselTemplate from "@/components/Carousel/carouselTemplate";

export default function CarouselLastSeen() {
    const [lastSeenData, setLastSeenData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            const local = localStorage.getItem("last_seen_content");
            const parsed = local ? JSON.parse(local) : [];
            setLastSeenData(parsed);
            setIsLoading(false);
        }, 500);
    }, []);

    if (!isLoading && lastSeenData.length === 0) {
        return null;
    }

    return (
        <CarouselTemplate
            label={"Terakhir Anda Lihat"}
            contents={lastSeenData}
            isLoading={isLoading}
            isHomepage={true}
        />
    )
}
