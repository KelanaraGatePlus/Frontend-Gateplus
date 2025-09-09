import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useGetToken = () => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = Cookies.get("token");
        setToken(storedToken || null);
    }, []);

    return token;
};
