// hooks/useMidtransPayment.js
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";
import { useAuth } from "@/components/Context/AuthContext";

const MIDTRANS_URL = "https://app.sandbox.midtrans.com/snap/snap.js";

export const useMidtransPayment = (paymentType = "ORDER") => {
    const [snapReady, setSnapReady] = useState(false);
    const { user } = useAuth();
    let midtransURL;

    switch (paymentType) {
        case "ORDER":
            midtransURL = `${BACKEND_URL}/api/payment/create`;
            break;
        case "SUBSCRIPTION":
            midtransURL = `${BACKEND_URL}/api/payment/create-subscription`;
            break;
        default:
            midtransURL = `${BACKEND_URL}/api/payment/create-subscription`;
            break;
    }

    // Load Snap.js sekali saja
    useEffect(() => {
        if (window.snap) {
            setSnapReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        script.onerror = () => console.error("Failed to load Midtrans Snap.js");
        document.body.appendChild(script);

        // ⚠️ jangan remove script saat cleanup
        return undefined;
    }, []);

    const pay = async (
        { episodeId, contentId, contentType = "PODCAST", tip = null, voucherCode = null },
        callbacks = {}
    ) => {
        const body =
            paymentType === "ORDER"
                ? JSON.stringify({ episodeId, contentType, tip, voucherCode })
                : JSON.stringify({ contentId, contentType, tip, voucherCode });

        if (!snapReady || !window.snap || typeof window.snap.pay !== "function") {
            alert("Midtrans Snap belum siap, coba lagi.");
            return;
        }

        try {
            const res = await fetch(midtransURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: body,
            });

            const data = await res.json();
            if (data.isPromoFree && data.isPromoFree === true) {
                callbacks.onSuccess?.(data);
                return;
            }
            if (!data.snapToken) throw new Error("snapToken tidak ditemukan");

            console.log("Memanggil Midtrans Snap dengan snapToken:", data.snapToken);

            window.snap.pay(data.snapToken, {
                onSuccess: (result) => callbacks.onSuccess?.(result),
                onPending: (result) => callbacks.onPending?.(result),
                onError: (error) => callbacks.onError?.(error),
                onClose: () => callbacks.onClose?.(),
            });
        } catch (error) {
            console.error(error);
            alert("Gagal membuat transaksi.");
        }
    };

    return { pay, snapReady };
};

export const useMidtransTipPayment = () => {
    const [snapReady, setSnapReady] = useState(false);
    const midtransURL = `${BACKEND_URL}/api/payment/create-tip`;
    const { user } = useAuth();

    // Load Snap.js sekali saja
    useEffect(() => {
        if (window.snap) {
            setSnapReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        script.onerror = () => console.error("Failed to load Midtrans Snap.js");
        document.body.appendChild(script);

        return undefined; // jangan remove script
    }, []);

    const pay = async ({ creatorId, amount }) => {
        const body = JSON.stringify({ creatorId, amount });

        if (!snapReady || !window.snap || typeof window.snap.pay !== "function") {
            alert("Midtrans Snap belum siap, coba lagi.");
            return;
        }

        try {
            const res = await fetch(midtransURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: body,
            });

            const data = await res.json();
            if (!data.snapToken) throw new Error("snapToken tidak ditemukan");

            window.snap.pay(data.snapToken, {
                onSuccess: () => console.log("Pembayaran sukses"),
                onPending: () => alert("Pembayaran masih pending."),
                onError: (err) => {
                    console.error("Midtrans error:", err);
                    alert("Pembayaran gagal.");
                },
                onClose: () => alert("Popup ditutup."),
            });
        } catch (error) {
            console.error(error);
            alert("Gagal membuat transaksi.");
        }
    };

    return { pay, snapReady };
};
