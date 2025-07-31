import axios from "axios";

export function useSaveContent() {
    const toggleSave = async ({
        isSaved,
        title,
        id,
        fieldKey,
        idSaved,
        setShowToast,
        setToastMessage,
        setToastType,
        setIsSaved,
        setIdSaved,
    }) => {
        const userId = localStorage.getItem("users_id");
        if (!userId) return;
        try {
            if (isSaved) {
                // UNSAVE
                setIsSaved(false);
                console.log("idlike", idSaved);
                const response = await axios.delete(`https://backend-gateplus-api.my.id/save/${idSaved}`);
                console.log("UNSAVED", response.data);
                setIdSaved(null);
                setShowToast(true);
                setToastMessage(`Konten "${title}" berhasil dihapus dari daftar simpan`);
                setToastType("success");
            } else {
                // SAVE
                setIsSaved(true);
                const requestBody = {
                    userId: userId,
                    [fieldKey]: id,
                };
                const response = await axios.post(
                    `https://backend-gateplus-api.my.id/save`,
                    requestBody,
                );
                console.log("SAVED", response.data.data.data);
                setIdSaved(response.data.data.data.id);
                setShowToast(true);
                setToastMessage(`"${title}" berhasil disimpan ke daftar simpan`);
                setToastType("success");
            }
        } catch (err) {
            console.error("Error in save/unsave:", err);
            setShowToast(true);
            setToastMessage(`Terjadi Galat "${title}", error: ${err.message}`);
            setToastType("failed");
            setIsSaved((prev) => !prev);
        }
    };

    return { toggleSave };
}
