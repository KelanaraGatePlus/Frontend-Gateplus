import { useEffect, useState } from "react";

export const useGetUserId = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("users_id");
            setUserId(storedUserId);
        }
    }, []);

    return userId;
};
