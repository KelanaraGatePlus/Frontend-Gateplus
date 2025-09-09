import { useEffect, useState } from "react";

export const useGetCreatorId = () => {
    const [creatorId, setCreatorId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("creators_id");
            setCreatorId(storedUserId);
        }
    }, []);

    return creatorId;
};
