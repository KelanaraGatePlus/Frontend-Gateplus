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
        { snapToken, snapUrl, provider = "midtrans" },
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
