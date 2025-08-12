// src/hooks/useUploadSessionData.ts
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios"; // Tetap diperlukan untuk PUT ke signed URL
import {
    // Menggunakan hook dari alur "Get Signed URL"
    useInitiateUploadMutation,
    useGetUploadStatusMutation,
    useGetSignedUrlForChunkMutation,
    useCompleteUploadMutation,
    useCancelUploadMutation,
} from "@/hooks/api/uploadSessionAPI"; // Pastikan path ini benar

const DEFAULT_CHUNK_SIZE = 10 * 1024 * 1024; // 10MB
const UPLOAD_STATUS_KEY = "uploadSessionData"; // Ganti nama key agar lebih jelas

// Tipe data gabungan yang menyimpan semua informasi yang dibutuhkan
type FullUploadSession = {
    key: string;
    uploadId: string;
    uploadUID: string;
    fileName: string;
    fileHash: string;
    uploadedParts: { PartNumber: number; ETag: string }[];
};

// Tipe data yang diekspos ke komponen (lebih sederhana)
type ResumeMeta = {
    uploadUID: string;
    fileName: string;
    fileHash: string;
};

export function useUploadSessionData({ chunkSize = DEFAULT_CHUNK_SIZE, prefix }) {
    // Semua state dari template Anda dipertahankan
    const [progress, setProgress] = useState(0);
    const [uploadedBytes, setUploadedBytes] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const [eta, setEta] = useState("00:00");
    const [uploading, setUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [resumeMeta, setResumeMeta] = useState<ResumeMeta | null>(null);
    const [isFinish, setIsFinish] = useState(false);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    // State internal untuk menyimpan data sesi lengkap
    const [fullSession, setFullSession] = useState<FullUploadSession | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const isUploadingRef = useRef(false);

    // --- Menggunakan Hooks API yang Benar ---
    const [initiateUpload] = useInitiateUploadMutation();
    const [getUploadStatus] = useGetUploadStatusMutation();
    const [getSignedUrlForChunk] = useGetSignedUrlForChunkMutation();
    const [completeUpload] = useCompleteUploadMutation();
    const [cancelUpload] = useCancelUploadMutation();

    useEffect(() => {
        const savedSession = localStorage.getItem(UPLOAD_STATUS_KEY);
        if (savedSession) {
            const parsed = JSON.parse(savedSession) as FullUploadSession;
            setFullSession(parsed);
            setResumeMeta({
                uploadUID: parsed.uploadUID,
                fileName: parsed.fileName,
                fileHash: parsed.fileHash,
            });
        }
    }, []);

    const hashFile = async (file: File): Promise<string> => {
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };

    // --- FUNGSI INTI (GABUNGAN) ---

    const handleFile = async (file: File, resume = false) => {
        if (isUploadingRef.current) return;
        isUploadingRef.current = true;
        setIsLoading(true);

        try {
            const fileHash = await hashFile(file);

            // Validasi resume dari template Anda
            if (resume) {
                if (!fullSession || fullSession.fileName !== file.name || fullSession.fileHash !== fileHash) {
                    alert("File tidak cocok dengan sesi sebelumnya. Memulai upload baru.");
                    localStorage.removeItem(UPLOAD_STATUS_KEY);
                    setFullSession(null);
                    setResumeMeta(null);
                    // Lanjut ke proses upload baru di bawah
                }
            } else {
                localStorage.removeItem(UPLOAD_STATUS_KEY);
                setFullSession(null);
                setResumeMeta(null);
            }

            setUploading(true);
            setIsLoading(false);
            setTotalBytes(file.size);

            // Proses upload menggunakan mekanisme "Get Signed URL"
            let sessionToProcess = fullSession;

            // 1. Initiate atau Resume
            if (!sessionToProcess || !resume) { // Jika sesi baru atau resume gagal validasi
                const initData = await initiateUpload({
                    fileSize: file.size, chunkSize, prefix, fileName: file.name, contentType: file.type,
                }).unwrap();
                sessionToProcess = { ...initData, fileName: file.name, fileHash, uploadedParts: [] };
            } else { // Jika resume valid
                const statusData = await getUploadStatus({ key: sessionToProcess.key, uploadId: sessionToProcess.uploadId }).unwrap();
                sessionToProcess.uploadedParts = statusData.uploadedParts;
            }

            setFullSession(sessionToProcess);
            localStorage.setItem(UPLOAD_STATUS_KEY, JSON.stringify(sessionToProcess));

            // 2. Proses Chunks
            const totalChunks = Math.ceil(file.size / chunkSize);
            let uploadedParts = [...sessionToProcess.uploadedParts];
            const uploadedPartNumbers = new Set(uploadedParts.map(p => p.PartNumber));
            let currentBytesSoFar = uploadedParts.reduce((acc, part) => acc + (part.PartNumber <= totalChunks ? chunkSize : file.size % chunkSize || chunkSize), 0);
            setUploadedBytes(currentBytesSoFar);

            const t0 = Date.now();
            let bytesUploadedThisSession = 0;

            for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
                if (uploadedPartNumbers.has(partNumber)) continue;
                if (!isUploadingRef.current) throw new Error("Upload dibatalkan");

                const start = (partNumber - 1) * chunkSize;
                const chunk = file.slice(start, start + chunkSize);

                // Dapatkan signed URL
                const { signedUrl } = await getSignedUrlForChunk({ ...sessionToProcess, partNumber }).unwrap();
                // Upload ke signed URL
                const uploadResponse = await axios.put(signedUrl, chunk, { headers: { 'Content-Type': file.type } });

                const newPart = { PartNumber: partNumber, ETag: uploadResponse.headers.etag.replaceAll('"', '') };
                uploadedParts.push(newPart);

                // Update state & localStorage secara immutable
                const updatedSession = { ...sessionToProcess, uploadedParts };
                setFullSession(updatedSession);
                localStorage.setItem(UPLOAD_STATUS_KEY, JSON.stringify(updatedSession));
                sessionToProcess = updatedSession; // Update variabel lokal

                // Update progress & ETA
                bytesUploadedThisSession += chunk.size;
                currentBytesSoFar += chunk.size;
                setUploadedBytes(currentBytesSoFar);
                setProgress(Math.round((currentBytesSoFar / file.size) * 100));

                const elapsedSeconds = (Date.now() - t0) / 1000;
                if (elapsedSeconds > 0) {
                    const speed = bytesUploadedThisSession / elapsedSeconds;
                    const remainingBytes = file.size - currentBytesSoFar;
                    const etaSeconds = Math.ceil(remainingBytes / speed);
                    if (isFinite(etaSeconds)) {
                        const minutes = String(Math.floor(etaSeconds / 60)).padStart(2, "0");
                        const seconds = String(etaSeconds % 60).padStart(2, "0");
                        setEta(`${minutes}:${seconds}`);
                    }
                }
            }

            // 3. Complete
            const url = await completeUpload({ ...sessionToProcess, parts: uploadedParts }).unwrap();
            setFileUrl(url);
            setIsFinish(true);
            alert("Upload Selesai!");
            setProgress(100);

        } catch (error) {
            if (error instanceof Error && error.message !== "Upload dibatalkan") {
                console.error("Terjadi kesalahan saat upload:", error);
                alert("Terjadi kesalahan saat upload.");
            }
        } finally {
            localStorage.removeItem(UPLOAD_STATUS_KEY);
            setResumeMeta(null);
            setFullSession(null);
            isUploadingRef.current = false;
            setUploading(false);
            setIsLoading(false);
            setEta("00:00");
        }
    };

    const onNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file, false);
    };

    const onResumeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file, true);
    };

    const triggerResume = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.onchange = (e: Event) => {
                const target = e.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                    handleFile(target.files[0], true);
                }
            };
            fileInputRef.current.click();
        }
    };

    const handleCancel = async () => {
        if (!fullSession) return;
        isUploadingRef.current = false;

        try {
            await cancelUpload(fullSession).unwrap();
            alert("Upload dibatalkan.");
        } catch (error) {
            console.error("Gagal membatalkan sesi di server:", error);
            // Tetap hentikan di frontend
        } finally {
            localStorage.removeItem(UPLOAD_STATUS_KEY);
            setResumeMeta(null);
            setFullSession(null);
            setProgress(0);
            setUploadedBytes(0);
            setUploading(false);
            setEta("00:00");
        }
    };

    // Mengembalikan interface yang sama seperti template Anda
    return {
        progress, uploadedBytes, totalBytes, eta, uploading, isLoading, resumeMeta, fileInputRef,
        isFinish, fileUrl,
        onNewFile, onResumeFile, triggerResume, handleCancel
    };
}