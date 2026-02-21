import { useMemo, useState } from "react";

export default function useExplicitContentHandler({ getValues, fieldInputRefs = {} }) {
    const [isExplicitModalOpen, setIsExplicitModalOpen] = useState(false);
    const [explicitImageName, setExplicitImageName] = useState("");
    const [explicitField, setExplicitField] = useState("");

    const fieldNames = useMemo(() => Object.keys(fieldInputRefs), [fieldInputRefs]);

    const findExplicitField = (fileName) => {
        if (!fileName || typeof getValues !== "function") return "";

        const formValues = getValues();
        const matchedField = fieldNames.find((fieldName) => {
            const files = formValues?.[fieldName];
            if (!Array.isArray(files)) return false;

            return files.some(
                (file) => file && typeof file !== "string" && file.name === fileName
            );
        });

        return matchedField || "";
    };

    const handleExplicitError = (error) => {
        if (error?.status !== 403) return false;

        const fileName = error?.data?.fileName || "Gambar";
        setExplicitField(findExplicitField(fileName));
        setExplicitImageName(fileName);
        setIsExplicitModalOpen(true);
        return true;
    };

    const handleRetryExplicitUpload = () => {
        setIsExplicitModalOpen(false);

        const selectedInputRef = fieldInputRefs?.[explicitField];
        selectedInputRef?.current?.click();
    };

    const closeExplicitModal = () => {
        setIsExplicitModalOpen(false);
    };

    return {
        isExplicitModalOpen,
        explicitImageName,
        handleExplicitError,
        handleRetryExplicitUpload,
        closeExplicitModal,
    };
}
