import axios from "axios";

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
                const response = await axios.delete(`https://backend-gateplus-api.my.id/dislike/${idDisliked}`);
                console.log("UNDISLIKED", response.data);
                setIdDisliked(null);
            } else {
                // DISLIKE
                setIsDisliked(true);
                const response = await axios.post("https://backend-gateplus-api.my.id/dislike", {
                    userId,
                    [fieldKey]: id,
                });
                console.log("LIKED", response.data.data.data);
                setIdDisliked(response.data.data.data.id);
            }
        } catch (err) {
            console.error("Error in like/unlike:", err);
            setIsDisliked((prev) => !prev);
        }
    };

    return { toggleDislike };
}
