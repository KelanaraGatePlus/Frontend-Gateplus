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

const FINAL_PAYMENT_STATUSES = new Set(["SUCCESS", "FAILED", "EXPIRED", "CANCELLED"]);

const getStatusColor = (status) => {
    switch (status) {
        case "SUCCESS":
            return "#1FC16B";
        case "FAILED":
        case "CANCELLED":
            return "#FF6B6B";
        case "EXPIRED":
            return "#F59E0B";
        default:
            return "#C6C6C6";
    }
};

const openQrisImagePopup = ({
    url,
    orderId = null,
    token = null,
    onClose = () => { },
    onSuccess = () => { },
    onFailed = () => { },
    onPending = () => { },
}) => {
    const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.zIndex = 9999;
    overlay.style.display = "flex";
    overlay.style.alignItems = isMobile ? "flex-end" : "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = isMobile ? "12px" : "16px";

    const card = document.createElement("div");
    card.style.position = "relative";
    card.style.width = "100%";
    card.style.maxWidth = isMobile ? "100%" : "345px";
    card.style.background = "#222222";
    card.style.border = "1px solid #F5F5F540";
    card.style.borderRadius = "8px";
    card.style.padding = isMobile ? "12px" : "14px";
    card.style.maxHeight = isMobile ? "82vh" : "88vh";
    card.style.overflowY = "auto";
    card.style.boxShadow = "0 16px 40px rgba(0,0,0,0.45)";
    card.style.color = "#F5F5F5";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = isMobile ? "8px" : "10px";

    const title = document.createElement("h3");
    title.innerText = "Scan QRIS untuk bayar";
    title.style.margin = "0";
    title.style.fontSize = isMobile ? "14px" : "15px";
    title.style.fontWeight = "700";

    const subtitle = document.createElement("p");
    subtitle.innerText = "Gunakan aplikasi e-wallet atau mobile banking, lalu selesaikan pembayaran sebelum waktu habis.";
    subtitle.style.margin = "0";
    subtitle.style.fontSize = isMobile ? "9px" : "10px";
    subtitle.style.lineHeight = "1.5";
    subtitle.style.color = "#C6C6C6";

    const qrFrame = document.createElement("div");
    qrFrame.style.background = "#ffffff";
    qrFrame.style.borderRadius = "8px";
    qrFrame.style.padding = isMobile ? "8px" : "11px";
    qrFrame.style.display = "flex";
    qrFrame.style.alignItems = "center";
    qrFrame.style.justifyContent = "center";

    const image = document.createElement("img");
    image.src = url;
    image.alt = "QRIS Payment";
    image.style.width = "100%";
    image.style.maxWidth = isMobile ? "220px" : "270px";
    image.style.maxHeight = isMobile ? "36vh" : "55vh";
    image.style.objectFit = "contain";
    image.style.display = "block";

    qrFrame.appendChild(image);

    const actions = document.createElement("div");
    actions.style.display = "flex";
    actions.style.gap = "8px";
    actions.style.flexWrap = "wrap";
    actions.style.flexDirection = isMobile ? "column" : "row";

    const downloadBtn = document.createElement("button");
    downloadBtn.innerText = "Download QR";
    downloadBtn.style.flex = isMobile ? "unset" : "1";
    downloadBtn.style.minWidth = isMobile ? "100%" : "112px";
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
    closeBtn.style.flex = isMobile ? "unset" : "1";
    closeBtn.style.minWidth = isMobile ? "100%" : "90px";
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

    const statusWrap = document.createElement("div");
    statusWrap.style.display = "flex";
    statusWrap.style.flexDirection = "column";
    statusWrap.style.gap = isMobile ? "5px" : "6px";
    statusWrap.style.background = "#2D2D2D";
    statusWrap.style.border = "1px solid #F5F5F520";
    statusWrap.style.borderRadius = "8px";
    statusWrap.style.padding = "8px";

    const statusLabel = document.createElement("p");
    statusLabel.style.margin = "0";
    statusLabel.style.fontSize = isMobile ? "9px" : "10px";
    statusLabel.style.color = "#C6C6C6";
    statusLabel.innerText = "Status pembayaran";

    const statusValue = document.createElement("p");
    statusValue.style.margin = "0";
    statusValue.style.fontSize = isMobile ? "11px" : "12px";
    statusValue.style.fontWeight = "700";
    statusValue.style.color = "#C6C6C6";
    statusValue.innerText = "Belum dicek";

    const statusMeta = document.createElement("p");
    statusMeta.style.margin = "0";
    statusMeta.style.fontSize = isMobile ? "8px" : "9px";
    statusMeta.style.color = "#979797";
    statusMeta.innerText = orderId ? `Order ID: ${orderId}` : "Order ID tidak tersedia";

    const checkStatusBtn = document.createElement("button");
    checkStatusBtn.innerText = "Cek Status Terbaru";
    checkStatusBtn.style.width = "100%";
    checkStatusBtn.style.padding = "8px 10px";
    checkStatusBtn.style.borderRadius = "8px";
    checkStatusBtn.style.border = "1px solid #F5F5F559";
    checkStatusBtn.style.cursor = "pointer";
    checkStatusBtn.style.fontWeight = "600";
    checkStatusBtn.style.fontSize = isMobile ? "11px" : "12px";
    checkStatusBtn.style.background = "transparent";
    checkStatusBtn.style.color = "#FFFFFF";

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

    let isClosed = false;
    let isCheckingStatus = false;
    let statusIntervalId = null;

    const clearPolling = () => {
        if (statusIntervalId) {
            clearInterval(statusIntervalId);
            statusIntervalId = null;
        }
    };

    const closeOverlay = ({ triggerOnClose = true } = {}) => {
        if (isClosed) return;
        isClosed = true;
        clearPolling();

        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }

        if (triggerOnClose) {
            onClose();
        }
    };

    const updateStatusUI = (status, checkedAt = null) => {
        statusValue.innerText = status;
        statusValue.style.color = getStatusColor(status);

        if (checkedAt) {
            statusMeta.innerText = `${orderId ? `Order ID: ${orderId} • ` : ""}Last check: ${checkedAt}`;
        }
    };

    const checkLatestStatus = async (isManualCheck = false) => {
        if (!orderId || !token || isClosed || isCheckingStatus) return;

        isCheckingStatus = true;
        checkStatusBtn.disabled = true;
        checkStatusBtn.style.opacity = "0.7";
        checkStatusBtn.innerText = "Mengecek...";

        try {
            const statusRes = await fetch(`${BACKEND_URL}/api/payment/status/${orderId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const statusJson = await statusRes.json();
            const latestStatus = (statusJson?.data?.status || "PENDING").toUpperCase();
            const checkedAt = new Date().toLocaleTimeString("id-ID", { hour12: false });

            updateStatusUI(latestStatus, checkedAt);

            if (isManualCheck && latestStatus === "PENDING") {
                onPending(statusJson?.data || statusJson);
            }

            if (FINAL_PAYMENT_STATUSES.has(latestStatus)) {
                clearPolling();

                if (latestStatus === "SUCCESS") {
                    onSuccess(statusJson?.data || statusJson);
                } else {
                    onFailed(statusJson?.data || statusJson);
                }

                closeOverlay({ triggerOnClose: false });
                return;
            }
        } catch (error) {
            console.error("Gagal cek status pembayaran:", error);
        } finally {
            if (!isClosed) {
                isCheckingStatus = false;
                checkStatusBtn.disabled = false;
                checkStatusBtn.style.opacity = "1";
                checkStatusBtn.innerText = "Cek Status Terbaru";
            }
        }
    };

    checkStatusBtn.onclick = () => {
        checkLatestStatus(true);
    };

    closeBtn.onclick = () => {
        closeOverlay();
    };

    actions.appendChild(downloadBtn);
    actions.appendChild(closeBtn);
    statusWrap.appendChild(statusLabel);
    statusWrap.appendChild(statusValue);
    statusWrap.appendChild(statusMeta);
    statusWrap.appendChild(checkStatusBtn);
    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(qrFrame);
    card.appendChild(actions);
    card.appendChild(statusWrap);
    card.appendChild(helper);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    if (orderId && token) {
        checkLatestStatus();
        statusIntervalId = setInterval(() => {
            checkLatestStatus();
        }, 30000);
    }
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

                openQrisImagePopup({
                    url: qrisImageUrl,
                    orderId: data.orderId || null,
                    token: user?.token || null,
                    onClose: () => {
                        setIsPaying(false);
                        callbacks.onClose?.();
                    },
                    onSuccess: (result) => {
                        setIsPaying(false);
                        callbacks.onSuccess?.(result);
                    },
                    onFailed: (result) => {
                        setIsPaying(false);
                        callbacks.onError?.(result);
                    },
                    onPending: (result) => {
                        callbacks.onPending?.(result);
                    },
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

    const pay = async ({ creatorId, amount, paymentMethod = null }) => {
        if (isPaying) return;
        setIsPaying(true);

        try {
            const res = await fetch(midtransURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ creatorId, amount, paymentMethod }),
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

                openQrisImagePopup({
                    url: qrisImageUrl,
                    orderId: data.orderId || null,
                    token: user?.token || null,
                    onClose: () => {
                        setIsPaying(false);
                    },
                    onSuccess: () => {
                        setIsPaying(false);
                        window.location.reload();
                    },
                    onFailed: () => {
                        setIsPaying(false);
                        alert("Pembayaran QRIS tidak berhasil atau sudah berakhir.");
                    },
                    onPending: () => {
                        alert("Pembayaran masih pending.");
                    },
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
    const { user } = useAuth();

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
        { snapToken, snapUrl, provider = "midtrans", paymentMethod = null, qrisImageUrl = null, orderId = null },
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

                openQrisImagePopup({
                    url: resolvedQrisImageUrl,
                    orderId: orderId || null,
                    token: user?.token || null,
                    onClose: () => {
                        setIsPaying(false);
                        callbacks.onClose?.();
                    },
                    onSuccess: (result) => {
                        setIsPaying(false);
                        callbacks.onSuccess?.(result);
                    },
                    onFailed: (result) => {
                        setIsPaying(false);
                        callbacks.onError?.(result);
                    },
                    onPending: (result) => {
                        callbacks.onPending?.(result);
                    },
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
