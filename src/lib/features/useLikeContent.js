import axios from "axios";

export function useLikeContent() {
    const toggleLike = async ({
        isLiked,
        id,
        fieldKey,
        idLiked,
        setIsLiked,
        setTotalLike,
        setIdLiked,
    }) => {
        const userId = localStorage.getItem("users_id");
        if (!userId) return;
        try {
            if (isLiked) {
                // UNLIKE
                setIsLiked(false);
                setTotalLike((prev) => Math.max(prev - 1, 0));
                console.log("idlike", idLiked);
                const response = await axios.delete(`http://localhost:3000/like/${idLiked}`);
                console.log("UNLIKED", response.data);
                setIdLiked(null);
            } else {
                // LIKE
                setIsLiked(true);
                setTotalLike((prev) => prev + 1);
                const response = await axios.post("http://localhost:3000/like", {
                    userId,
                    [fieldKey]: id,
                });
                console.log("LIKED", response.data.data.data);
                setIdLiked(response.data.data.data.id);
            }
        } catch (err) {
            console.error("Error in like/unlike:", err);
            setIsLiked((prev) => !prev);
            setTotalLike((prev) => (isLiked ? prev + 1 : Math.max(prev - 1, 0)));
        }
    };

    return { toggleLike };
}
