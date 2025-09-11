// hooks/useMidtransPayment.js
import { useEffect, useState } from "react";
import { BACKEND_URL, MIDTRANS_URL } from "@/lib/constants/backendUrl";

export const useMidtransPayment = (paymentType = 'ORDER') => {
    const [snapReady, setSnapReady] = useState(false);
    const [token, setToken] = useState('');
    let midtransURL;

    switch (paymentType) {
        case 'ORDER':
            midtransURL = `${BACKEND_URL}/api/payment/create`;
            break;
        case 'TIP':
            midtransURL = `${BACKEND_URL}/api/payment/create-tip`;
            break;
        case 'SUBSCRIPTION':
            midtransURL = `${BACKEND_URL}/api/payment/create-subscription`;
            break;
        default:
            midtransURL = `${BACKEND_URL}/api/payment/create-subscription`;
            break;
    }

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
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        script.onerror = () => console.error("Failed to load Midtrans Snap.js");
        document.body.appendChild(script);

        return () => document.body.removeChild(script);
    }, []);

    const pay = async ({ creatorId, episodeId, contentId, price, contentType = "PODCAST" }) => {
        const body = paymentType === 'ORDER' ? JSON.stringify({
            creatorId,
            episodeId,
            contentType,
            price,
        }) : JSON.stringify({
            creatorId,
            contentId,
            contentType,
            price,
        });

        if (!snapReady || !window.snap) {
            alert("Midtrans Snap belum siap.");
            return;
        }

        try {
            const res = await fetch(midtransURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: body,
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

export const useMidtransTipPayment = () => {
    const [snapReady, setSnapReady] = useState(false);
    const [token, setToken] = useState('');
    const midtransURL = `${BACKEND_URL}/api/payment/create-tip`;

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
        script.src = MIDTRANS_URL;
        script.async = true;
        script.onload = () => setSnapReady(true);
        script.onerror = () => console.error("Failed to load Midtrans Snap.js");
        document.body.appendChild(script);

        return () => document.body.removeChild(script);
    }, []);

    const pay = async ({ creatorId, amount }) => {
        const body = JSON.stringify({
            creatorId,
            amount,
        });

        if (!snapReady || !window.snap) {
            alert("Midtrans Snap belum siap.");
            return;
        }

        try {
            const res = await fetch(midtransURL, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: body,
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
}
