import { useCreateSavedContentMutation, useDeleteSavedContentMutation } from "@/hooks/api/savedContentAPI";

export function useSaveContent() {
    const [deleteSavedContent] = useDeleteSavedContentMutation();
    const [createSavedContent] = useCreateSavedContentMutation();

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
        try {
            if (isSaved) {
                // UNSAVE
                setIsSaved(false);
                console.log("idlike", idSaved);
                const response = await deleteSavedContent(idSaved).unwrap();
                console.log("UNSAVED", response.data);
                setIdSaved(null);
                setShowToast(true);
                setToastMessage(`Konten "${title}" berhasil dihapus dari daftar simpan`);
                setToastType("success");
                window.location.reload();
            } else {
                // SAVE
                setIsSaved(true);
                const requestBody = {
                    [fieldKey]: id,
                };
                const response = await createSavedContent(requestBody).unwrap();
                setIdSaved(response.data.data.id);
                setShowToast(true);
                setToastMessage(`"${title}" berhasil disimpan ke daftar simpan`);
                setToastType("success");
                window.location.reload();
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
