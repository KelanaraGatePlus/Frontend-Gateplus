// src/hooks/useUploadSessionData.ts
import { useState, useEffect, useRef } from "react";
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

export function useUploadSessionData({ chunkSize = DEFAULT_CHUNK_SIZE, prefix }: { chunkSize?: number; prefix?: string }) {
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
    // State baru untuk menyimpan durasi video
    const [videoDuration, setVideoDuration] = useState<number | null>(null);

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
            try {
                const parsed = JSON.parse(savedSession) as FullUploadSession;
                setFullSession(parsed);
                setResumeMeta({
                    uploadUID: parsed.uploadUID,
                    fileName: parsed.fileName,
                    fileHash: parsed.fileHash,
                });
            } catch (e) {
                console.warn("Gagal parse saved upload session:", e);
                localStorage.removeItem(UPLOAD_STATUS_KEY);
            }
        }
    }, []);

    // Skip hashing for files >2GB to avoid NotReadableError
    const hashFile = async (file: File): Promise<string> => {
        const TWO_GB = 2 * 1024 * 1024 * 1024;
        if (file.size > TWO_GB) {
            // jangan alert berulang kali saat otomatis: tetap informatif
            alert("File sangat besar (>2GB), proses hash dilewati demi stabilitas upload. Pastikan file tidak berubah selama upload.");
            // Return a pseudo hash (e.g., file size + name) for session uniqueness
            return `${file.name}-${file.size}`;
        }
        const buffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        return Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    };

    // --- FUNGSI HELPER BARU UNTUK MENDETEKSI DURASI VIDEO ---
    const getVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            // Membuat elemen video sementara di memori
            const videoElement = document.createElement('video');
            videoElement.preload = 'metadata'; // Hanya minta metadata, bukan seluruh video

            // Handler ketika metadata berhasil dimuat
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src); // Hapus object URL untuk menghindari memory leak
                resolve(videoElement.duration); // Resolve promise dengan durasi video dalam detik
            };

            // Handler jika terjadi error (misal, file bukan video atau rusak)
            videoElement.onerror = () => {
                window.URL.revokeObjectURL(videoElement.src);
                reject("Gagal membaca metadata. Pastikan file adalah format video yang didukung.");
            };

            // Membuat URL sementara untuk file lokal agar bisa dibaca oleh elemen video
            videoElement.src = URL.createObjectURL(file);
        });
    };


    // --- FUNGSI INTI (GABUNGAN) ---
    const handleFile = async (file: File, resume = false) => {
        // Guard: kalau sedang upload, jangan proses lagi
        if (isUploadingRef.current) {
            console.warn("Upload sudah berjalan, aksi diabaikan.");
            return;
        }

        // Reset state dari unggahan sebelumnya
        setVideoDuration(null);
        setIsFinish(false);
        setFileUrl(null);
        setProgress(0);

        // --- LOGIKA DETEKSI DURASI VIDEO ---
        try {
            if (file.type.startsWith("video/")) {
                setIsLoading(true); // Tampilkan loading saat metadata dibaca
                const duration = await getVideoDuration(file);
                setVideoDuration(duration); // Simpan durasi dalam detik, dibulatkan
                console.log(`✅ Durasi video terdeteksi: ${Math.round(duration)} detik.`);
            } else {
                console.log("File bukan video, deteksi durasi dilewati.");
            }
        } catch (error) {
            alert(error);
            setIsLoading(false);
            return; // Hentikan proses jika gagal membaca metadata
        }

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
                }
            } else {
                localStorage.removeItem(UPLOAD_STATUS_KEY);
                setFullSession(null);
                setResumeMeta(null);
            }

            setUploading(true);
            setIsLoading(false);
            setTotalBytes(file.size);

            let sessionToProcess = fullSession;

            // 1. Initiate atau Resume
            if (!sessionToProcess || !resume) {
                const initData = await initiateUpload({
                    fileSize: file.size, chunkSize, prefix, fileName: file.name, contentType: file.type,
                }).unwrap();
                // Server harus mengembalikan minimal: key, uploadId, uploadUID (sesuaikan API)
                sessionToProcess = { ...initData, fileName: file.name, fileHash, uploadedParts: [] };
            } else {
                const statusData = await getUploadStatus({ key: sessionToProcess.key, uploadId: sessionToProcess.uploadId }).unwrap();
                sessionToProcess.uploadedParts = statusData.uploadedParts || [];
            }

            setFullSession(sessionToProcess);
            localStorage.setItem(UPLOAD_STATUS_KEY, JSON.stringify(sessionToProcess));

            // 2. Proses Chunks (sekuensial, pastikan await di tiap langkah)
            const totalChunks = Math.ceil(file.size / chunkSize);
            let uploadedParts = [...(sessionToProcess.uploadedParts || [])];
            const uploadedPartNumbers = new Set(uploadedParts.map(p => p.PartNumber));

            const partSize = (partNumber: number) => {
                if (partNumber < totalChunks) return chunkSize;
                // last part size
                return file.size - chunkSize * (totalChunks - 1);
            };

            let currentBytesSoFar = uploadedParts.reduce((acc, part) => acc + partSize(part.PartNumber), 0);
            setUploadedBytes(currentBytesSoFar);

            const t0 = Date.now();
            let bytesUploadedThisSession = 0;

            for (let partNumber = 1; partNumber <= totalChunks; partNumber++) {
                if (uploadedPartNumbers.has(partNumber)) {
                    // sudah di-upload, lewati
                    console.log(`Skip part ${partNumber} (sudah ada)`);
                    continue;
                }

                if (!isUploadingRef.current) throw new Error("Upload dibatalkan");

                const start = (partNumber - 1) * chunkSize;
                const end = Math.min(start + chunkSize, file.size);
                const chunk = file.slice(start, end);

                // Ambil signed URL sekali per part (backend hanya mengembalikan URL)
                console.log(`Request signed URL for part ${partNumber}`);
                const signedUrlResp = await getSignedUrlForChunk({ ...sessionToProcess, partNumber }).unwrap();
                // signedUrlResp bisa berisi { signedUrl } atau struktur lain -> asumsi { signedUrl }
                const signedUrl = (signedUrlResp as any).signedUrl ?? (signedUrlResp as any).url;
                if (!signedUrl) throw new Error("Signed URL tidak diterima dari server");

                console.log(`PUT chunk part ${partNumber} -> ${signedUrl}`);

                // PUT ke MinIO (hanya 1x)
                const uploadResponse = await axios.put(signedUrl, chunk, {
                    headers: { 'Content-Type': file.type },
                    // jangan men-trigger request lain — pastikan tidak ada fetch/xhr paralel
                    validateStatus: () => true
                });

                // Cek status yang valid (MinIO/S3 biasanya 200 atau 204)
                if (![200, 201, 204].includes(uploadResponse.status)) {
                    console.error("Upload chunk gagal:", uploadResponse.status, uploadResponse.data);
                    throw new Error(`Gagal upload chunk part ${partNumber} (status ${uploadResponse.status})`);
                }

                // Ambil ETag (beberapa server return 'etag' atau 'ETag')
                const etagHeader = uploadResponse.headers?.etag ?? uploadResponse.headers?.ETag;
                const etag = typeof etagHeader === "string" ? etagHeader.replace(/"/g, "") : "";

                const newPart = { PartNumber: partNumber, ETag: etag };
                uploadedParts.push(newPart);

                const updatedSession = { ...sessionToProcess, uploadedParts };
                setFullSession(updatedSession);
                localStorage.setItem(UPLOAD_STATUS_KEY, JSON.stringify(updatedSession));
                sessionToProcess = updatedSession;

                // update progress/bytes
                const thisPartSize = partSize(partNumber);
                bytesUploadedThisSession += thisPartSize;
                currentBytesSoFar += thisPartSize;
                setUploadedBytes(currentBytesSoFar);
                setProgress(Math.round((currentBytesSoFar / file.size) * 100));

                // ETA
                const elapsedSeconds = (Date.now() - t0) / 1000;
                if (elapsedSeconds > 0) {
                    const speed = bytesUploadedThisSession / elapsedSeconds;
                    const remainingBytes = file.size - currentBytesSoFar;
                    const etaSeconds = speed > 0 ? Math.ceil(remainingBytes / speed) : 0;
                    if (isFinite(etaSeconds)) {
                        const minutes = String(Math.floor(etaSeconds / 60)).padStart(2, "0");
                        const seconds = String(etaSeconds % 60).padStart(2, "0");
                        setEta(`${minutes}:${seconds}`);
                    }
                }
            }

            // 3. Complete - beri parts ke server agar server bisa melakukan CompleteMultipartUpload
            console.log("Memanggil completeUpload ke server...");
            const url = await completeUpload({ ...sessionToProcess, parts: uploadedParts }).unwrap();
            setFileUrl(url);
            setIsFinish(true);
            alert("Upload Selesai!");
            setProgress(100);

        } catch (error: any) {
            if (error instanceof Error && error.message !== "Upload dibatalkan") {
                console.error("Terjadi kesalahan saat upload:", error);
                alert("Terjadi kesalahan saat upload: " + (error?.message ?? "unknown"));
            }
        } finally {
            // Hapus session di localStorage bila upload selesai / gagal (opsional)
            localStorage.removeItem(UPLOAD_STATUS_KEY);
            setResumeMeta(null);
            setFullSession(null);
            isUploadingRef.current = false;
            setUploading(false);
            setIsLoading(false);
            setEta("00:00");
        }
    };

    // Handler file input (baru)
    const onNewFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file, false);
    };

    // Handler resume (tetap ada, tapi tidak mengubah fileInputRef.onchange)
    const onResumeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file, true);
    };

    // Trigger resume tanpa overwrite onchange (fix double-binding)
    const triggerResume = () => {
        if (fileInputRef.current) {
            // reset value supaya memilih file yang sama tetap memicu onChange
            fileInputRef.current.value = '';
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

    // Mengembalikan interface yang sama seperti template Anda, ditambah videoDuration
    return {
        progress,
        uploadedBytes,
        totalBytes,
        eta,
        uploading,
        isLoading,
        resumeMeta,
        fileInputRef,
        isFinish,
        fileUrl,
        videoDuration,
        onNewFile,
        onResumeFile,
        triggerResume,
        handleCancel
    };
}
