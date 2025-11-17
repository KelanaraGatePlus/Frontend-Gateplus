import axios from "axios";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export function useDislikeContent() {
    const toggleDislike = async ({
        isDisliked,
        id,
        fieldKey,
        idDisliked,
        setIsDisliked,
        setIdDisliked,
    }) => {
        const userId = localStorage.getItem("users_id");
        if (!userId) return;
        try {
            if (isDisliked) {
                // UNDISLIKE
                setIsDisliked(false);
                const response = await axios.delete(`${BACKEND_URL}/like/${idDisliked}`);
                console.log("UNDISLIKED", response.data);
                setIdDisliked(null);
                window.location.reload();
            } else {
                // DISLIKE
                setIsDisliked(true);
                const response = await axios.post(`${BACKEND_URL}/like`, {
                    userId,
                    [fieldKey]: id,
                    type: "DISLIKE"
                });
                console.log("LIKED", response.data.data.data);
                setIdDisliked(response.data.data.data.id);
                window.location.reload();
            }
        } catch (err) {
            console.error("Error in like/unlike:", err);
            setIsDisliked((prev) => !prev);
        }
    };

    return { toggleDislike };
}
