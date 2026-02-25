// hooks/useMidtransPayment.js
import { useEffect, useState } from "react";
import { BACKEND_URL, NEXT_MIDTRANS_URL } from "@/lib/constants/backendUrl";
import { useAuth } from "@/components/Context/AuthContext";

const MIDTRANS_URL = NEXT_MIDTRANS_URL || "https://app.sandbox.midtrans.com/snap/snap.js";

// =======================================================================
//    GLOBAL POPUP HANDLER UNTUK XENDIT (CENTERED & ANTI GESER)
// =======================================================================
const openXenditPopup = (url, onClose = () => { }) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.6)";
    overlay.style.zIndex = 9999;
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // WRAPPER supaya tombol close tidak menggeser iframe
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.style.width = "420px";
    iframe.style.height = "620px";
    iframe.style.border = "none";
    iframe.style.borderRadius = "10px";
    iframe.style.background = "#fff";
    iframe.style.boxShadow = "0 0 20px rgba(0,0,0,0.3)";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "-50px";
    closeBtn.style.right = "0";
    closeBtn.style.background = "#fff";
    closeBtn.style.padding = "8px 12px";
    closeBtn.style.borderRadius = "6px";
    closeBtn.style.border = "1px solid #ccc";
    closeBtn.style.cursor = "pointer";

    closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        onClose();
    };

    wrapper.appendChild(iframe);
    wrapper.appendChild(closeBtn);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
};

const getQrisImageUrl = (data = {}) => {
    if (!data || typeof data !== "object") return null;

    return (
        data.qrisImageUrl ||
        data.qrisUrl ||
        data.qrCodeUrl ||
        data.qrUrl ||
        data.snapUrl ||
        null
    );
};

const openQrisImagePopup = (url, onClose = () => { }) => {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.zIndex = 9999;
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "16px";

    const card = document.createElement("div");
    card.style.position = "relative";
    card.style.width = "100%";
    card.style.maxWidth = "345px";
    card.style.background = "#222222";
    card.style.border = "1px solid #F5F5F540";
    card.style.borderRadius = "8px";
    card.style.padding = "14px";
    card.style.boxShadow = "0 16px 40px rgba(0,0,0,0.45)";
    card.style.color = "#F5F5F5";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "10px";

    const title = document.createElement("h3");
    title.innerText = "Scan QRIS untuk bayar";
    title.style.margin = "0";
    title.style.fontSize = "15px";
    title.style.fontWeight = "700";

    const subtitle = document.createElement("p");
    subtitle.innerText = "Gunakan aplikasi e-wallet atau mobile banking, lalu selesaikan pembayaran sebelum waktu habis.";
    subtitle.style.margin = "0";
    subtitle.style.fontSize = "10px";
    subtitle.style.lineHeight = "1.5";
    subtitle.style.color = "#C6C6C6";

    const qrFrame = document.createElement("div");
    qrFrame.style.background = "#ffffff";
    qrFrame.style.borderRadius = "8px";
    qrFrame.style.padding = "11px";
    qrFrame.style.display = "flex";
    qrFrame.style.alignItems = "center";
    qrFrame.style.justifyContent = "center";

    const image = document.createElement("img");
    image.src = url;
    image.alt = "QRIS Payment";
    image.style.width = "100%";
    image.style.maxWidth = "270px";
    image.style.maxHeight = "55vh";
    image.style.objectFit = "contain";
    image.style.display = "block";

    qrFrame.appendChild(image);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.flexWrap = "wrap";

    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download QR";
    downloadBtn.style.flex = "1";
    downloadBtn.style.minWidth = "112px";
    downloadBtn.style.padding = "8px 10px";
    downloadBtn.style.borderRadius = "8px";
    downloadBtn.style.border = "none";
    downloadBtn.style.cursor = "pointer";
    downloadBtn.style.fontWeight = "600";
    downloadBtn.style.fontSize = "12px";
    downloadBtn.style.background = "#0076E9CC";
    downloadBtn.style.color = "#FFFFFF";

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Tutup";
    closeBtn.style.flex = "1";
    closeBtn.style.minWidth = "90px";
    closeBtn.style.padding = "8px 10px";
    closeBtn.style.borderRadius = "8px";
    closeBtn.style.border = "1px solid #F5F5F559";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontWeight = "600";
    closeBtn.style.fontSize = "12px";
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#FFFFFF";

    const helper = document.createElement("p");
    helper.innerText = "Setelah transfer berhasil, tunggu verifikasi otomatis dari sistem.";
    helper.style.margin = "0";
    helper.style.fontSize = "9px";
    helper.style.lineHeight = "1.4";
    helper.style.color = "#979797";

    downloadBtn.onclick = async () => {
        try {
            const response = await fetch(url, { mode: "cors" });

            if (!response.ok) {
                throw new Error("Failed to fetch QR image");
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = objectUrl;
            link.download = "qris-payment.png";
            link.click();
            URL.revokeObjectURL(objectUrl);
        } catch {
            const fallbackLink = document.createElement("a");
            fallbackLink.href = url;
            fallbackLink.target = "_blank";
            fallbackLink.rel = "noopener noreferrer";
            fallbackLink.download = "qris-payment.png";
            fallbackLink.click();
        }
    };

    closeBtn.onclick = () => {
        document.body.removeChild(overlay);
        onClose();
    };

    actions.appendChild(downloadBtn);
    actions.appendChild(closeBtn);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(qrFrame);
    card.appendChild(actions);
    card.appendChild(helper);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
};

// =======================================================================
//    HOOK PAYMENT (ORDER & SUBSCRIPTION)
// =======================================================================
export const usePayment = (paymentType = "ORDER") => {
    const [snapReady, setSnapReady] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const { user } = useAuth();

    // Tentukan endpoint
    const paymentURL =
        paymentType === "ORDER"
            ? `${BACKEND_URL}/api/payment/create`
            : `${BACKEND_URL}/api/payment/create-subscription`;

    // Load Snap.js
    useEffect(() => {
        if (window.snap) {
            setSnapReady(true);
            return;
        }
        const script = document.createElement("script");
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);
    }, []);

    const pay = async (
        { episodeId, contentId, contentType = "PODCAST", tip = null, voucherCode = null, paymentMethod = null },
        callbacks = {}
    ) => {
        if (isPaying) return;
        setIsPaying(true);

        const body =
            paymentType === "ORDER"
                ? JSON.stringify({ episodeId, contentType, tip, voucherCode, paymentMethod })
                : JSON.stringify({ contentId, contentType, tip, voucherCode, paymentMethod });

        try {
            const res = await fetch(paymentURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body,
            });

            const data = await res.json();

            // Promo Free
            if (data.isPromoFree) {
                setIsPaying(false);
                callbacks.onSuccess?.(data);
                return;
            }

            // ================= XENDIT =================
            if (data.provider === "xendit") {
                openXenditPopup(data.snapUrl, () => {
                    setIsPaying(false);
                    callbacks.onSuccess?.(data);
                });
                return;
            }

            if (data.paymentMethod === "qris") {
                const qrisImageUrl = getQrisImageUrl(data);

                if (!qrisImageUrl) {
                    alert("QRIS image tidak tersedia.");
                    setIsPaying(false);
                    callbacks.onError?.(new Error("QRIS image tidak tersedia"));
                    return;
                }

                openQrisImagePopup(qrisImageUrl, () => {
                    setIsPaying(false);
                    callbacks.onPending?.(data);
                });
                return;
            }

            // ================= MIDTRANS =================
            if (!snapReady || !window.snap) {
                alert("Midtrans Snap belum siap.");
                setIsPaying(false);
                return;
            }

            window.snap.pay(data.snapToken, {
                onSuccess: (result) => {
                    setIsPaying(false);
                    callbacks.onSuccess?.(result);
                },
                onPending: (result) => {
                    setIsPaying(false);
                    callbacks.onPending?.(result);
                },
                onError: (error) => {
                    setIsPaying(false);
                    callbacks.onError?.(error);
                },
                onClose: () => {
                    setIsPaying(false);
                    callbacks.onClose?.();
                },
            });
        } catch (err) {
            console.error(err);
            alert("Gagal memproses transaksi.");
            setIsPaying(false);
        }
    };

    return { pay, snapReady, isPaying };
};

// =======================================================================
//    HOOK TIP PAYMENT
// =======================================================================
export const useTipPayment = () => {
    const [snapReady, setSnapReady] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const { user } = useAuth();
    const midtransURL = `${BACKEND_URL}/api/payment/create-tip`;

    useEffect(() => {
        if (window.snap) {
            setSnapReady(true);
            return;
        }
        const script = document.createElement("script");
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);
    }, []);

    const pay = async ({ creatorId, amount }) => {
        if (isPaying) return;
        setIsPaying(true);

        try {
            const res = await fetch(midtransURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ creatorId, amount }),
            });

            const data = await res.json();

            // XENDIT
            if (data.provider === "xendit") {
                openXenditPopup(data.snapUrl, () => {
                    setIsPaying(false);
                    window.location.reload();
                });
                return;
            }

            if (data.paymentMethod === "qris") {
                const qrisImageUrl = getQrisImageUrl(data);

                if (!qrisImageUrl) {
                    alert("QRIS image tidak tersedia.");
                    setIsPaying(false);
                    return;
                }

                openQrisImagePopup(qrisImageUrl, () => {
                    setIsPaying(false);
                    alert("Silakan selesaikan pembayaran QRIS terlebih dahulu.");
                });
                return;
            }

            // MIDTRANS
            window.snap.pay(data.snapToken, {
                onSuccess: () => {
                    setIsPaying(false);
                    window.location.reload();
                },
                onPending: () => {
                    setIsPaying(false);
                    alert("Pembayaran masih pending.");
                },
                onError: (err) => {
                    setIsPaying(false);
                    console.error(err);
                    alert("Pembayaran gagal.");
                },
                onClose: () => {
                    setIsPaying(false);
                    alert("Popup ditutup.");
                },
            });
        } catch (err) {
            console.error(err);
            alert("Gagal membuat transaksi.");
            setIsPaying(false);
        }
    };

    return { pay, snapReady, isPaying };
};

// =======================================================================
//    HOOK DISPLAY PAYMENT (WITHOUT API CALL)
// =======================================================================
export const useDisplayPayment = () => {
    const [snapReady, setSnapReady] = useState(false);
    const [isPaying, setIsPaying] = useState(false);

    // Load Snap.js
    useEffect(() => {
        if (window.snap) {
            setSnapReady(true);
            return;
        }
        const script = document.createElement("script");
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        document.body.appendChild(script);
    }, []);

    const display = async (
        { snapToken, snapUrl, provider = "midtrans", paymentMethod = null, qrisImageUrl = null },
        callbacks = {}
    ) => {
        if (isPaying) return;
        setIsPaying(true);

        try {
            // ================= XENDIT =================
            if (provider === "xendit" && snapUrl) {
                openXenditPopup(snapUrl, () => {
                    setIsPaying(false);
                    callbacks.onClose?.();
                });
                return;
            }

            if (paymentMethod === "qris") {
                const resolvedQrisImageUrl = qrisImageUrl || snapUrl;

                if (!resolvedQrisImageUrl) {
                    alert("QRIS image tidak tersedia.");
                    setIsPaying(false);
                    callbacks.onError?.(new Error("QRIS image tidak tersedia"));
                    return;
                }

                openQrisImagePopup(resolvedQrisImageUrl, () => {
                    setIsPaying(false);
                    callbacks.onPending?.({ paymentMethod: "qris" });
                });
                return;
            }

            // ================= MIDTRANS =================
            if (!snapReady || !window.snap) {
                alert("Midtrans Snap belum siap.");
                setIsPaying(false);
                return;
            }

            window.snap.pay(snapToken, {
                onSuccess: (result) => {
                    setIsPaying(false);
                    callbacks.onSuccess?.(result);
                },
                onPending: (result) => {
                    setIsPaying(false);
                    callbacks.onPending?.(result);
                },
                onError: (error) => {
                    setIsPaying(false);
                    callbacks.onError?.(error);
                },
                onClose: () => {
                    setIsPaying(false);
                    callbacks.onClose?.();
                },
            });
        } catch (err) {
            console.error(err);
            alert("Gagal menampilkan halaman pembayaran.");
            setIsPaying(false);
        }
    };

    return { display, snapReady, isPaying };
};
