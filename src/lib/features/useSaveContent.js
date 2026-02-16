import {
  useCreateSavedContentMutation,
  useDeleteSavedContentMutation,
} from "@/hooks/api/savedContentAPI";

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
        if (!idSaved) {
          setToastMessage("Gagal: Data belum sinkron. Silakan refresh.");
          setToastType("failed");
          setShowToast(true);
          return;
        }

        setIsSaved(false);
        await deleteSavedContent(idSaved).unwrap();
        setIdSaved(null);
        setToastMessage(`"${title}" berhasil dihapus`);
        setToastType("success");
        setShowToast(true);
        window.location.reload();
      } else {
        setIsSaved(true);
        const response = await createSavedContent({ [fieldKey]: id }).unwrap();
        const newId =
          response?.data?.id || response?.data?.data?.id || response?.id;
        if (newId) setIdSaved(newId);
        setToastMessage(`"${title}" berhasil disimpan`);
        setToastType("success");
        setShowToast(true);
        window.location.reload();
      }
    } catch (err) {
      console.error("Save/Unsave Error:", err);
      setToastMessage(`Galat: ${err.data?.message || "Server Error"}`);
      setToastType("failed");
      setShowToast(true);
      setIsSaved(isSaved);
    }
  };

  return { toggleSave };
}
