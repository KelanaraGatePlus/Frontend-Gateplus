// hooks/useMidtransPayment.js
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const useMidtransPayment = () => {
    const [snapReady, setSnapReady] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("token") || '');
        }
    }, []);

    // Load Snap.js once
    useEffect(() => {
        if (window.snap) {
            setSnapReady(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", "SB-Mid-client-w_nX8byQy-u4QRfl");
        script.async = true;
        script.onload = () => setSnapReady(true);
        script.onerror = () => console.error("Failed to load Midtrans Snap.js");
        document.body.appendChild(script);

        return () => document.body.removeChild(script);
    }, []);

    const pay = async ({ creatorId, episodeId, price, contentType = "PODCAST" }) => {
        if (!snapReady || !window.snap) {
            alert("Midtrans Snap belum siap.");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_URL}/api/payment/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    creatorId,
                    episodeId,
                    contentType,
                    price,
                }),
            });

            const data = await res.json();
            if (!data.snapToken) throw new Error("snapToken tidak ditemukan");

            window.snap.pay(data.snapToken, {
                onSuccess: () => console.log("Pembayaran sukses"),
                onPending: () => alert("Pembayaran masih pending."),
                onError: () => alert("Pembayaran gagal."),
                onClose: () => alert("Popup ditutup."),
            });
        } catch (error) {
            console.error(error);
            alert("Gagal membuat transaksi.");
        }
    };

    return { pay, snapReady };
};
