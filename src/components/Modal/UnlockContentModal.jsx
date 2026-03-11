"use client";

import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import GateplusCoin from "@@/GateplusCoin/coinLogo.svg";
import { useGetDiscountByVoucherDiscountCodeMutation } from "@/hooks/api/discountVoucherAPI";
import { usePayWithCoinMutation, useSubscribeWithCoinMutation } from "@/hooks/api/paymentSliceAPI";
import TopUpGateCoinsModal from "@/components/Modal/TopUpGateCoinsModal";

const COIN_ARRIVED_EVENT = "gateplus:coin-arrived";

function formatCoin(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default function UnlockContentModal({
    isOpen,
    onClose,
    onGetVouchers,
    title,
    subtitle,
    basePrice,
    userBalance,
    episodeId,
    contentId,
    contentType,
    tip,
    actionType,
    onPaymentSuccess,
}) {
    const [mounted, setMounted] = useState(false);
    const [voucherCode, setVoucherCode] = useState("");
    const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [voucherMessage, setVoucherMessage] = useState("");
    const [voucherMessageType, setVoucherMessageType] = useState("neutral");
    const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
    const [getDiscount] = useGetDiscountByVoucherDiscountCodeMutation();
    const [payWithCoin] = usePayWithCoinMutation();
    const [subscribeWithCoin] = useSubscribeWithCoinMutation();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen && !isTopUpModalOpen) {
            setVoucherCode("");
            setTotalDiscount(0);
            setIsApplyingVoucher(false);
            setIsUnlocking(false);
            setIsTopUpModalOpen(false);
            setVoucherMessage("");
            setVoucherMessageType("neutral");
        }
    }, [isOpen, isTopUpModalOpen]);

    const normalizedBasePrice = useMemo(() => Number(basePrice) || 0, [basePrice]);
    const normalizedPrice = useMemo(
        () => Math.max(normalizedBasePrice - (Number(totalDiscount) || 0), 0),
        [normalizedBasePrice, totalDiscount],
    );
    const normalizedBalance = useMemo(() => Number(userBalance) || 0, [userBalance]);
    const isInsufficient = normalizedBalance < normalizedPrice;

    const handleApplyVoucher = async () => {
        const code = voucherCode.trim();
        if (!code) return;

        setIsApplyingVoucher(true);
        try {
            const response = await getDiscount({
                code,
                amount: normalizedBasePrice,
                contentType,
                contentId,
                paymentType: "TRANSACTION",
            }).unwrap();

            const discount = Number(response?.data) || 0;
            setTotalDiscount(discount);
            setVoucherMessage("Voucher berhasil diterapkan.");
            setVoucherMessageType("success");
        } catch (err) {
            console.error("Failed to apply voucher:", err);
            setTotalDiscount(0);
            setVoucherMessage("Voucher tidak valid atau tidak bisa digunakan.");
            setVoucherMessageType("error");
        } finally {
            setIsApplyingVoucher(false);
        }
    };

    const isSubscribeAction = actionType === "SUBSCRIBE";

    const handleUnlock = async () => {
        if (!contentType || isInsufficient) return;
        if (isSubscribeAction && !contentId) return;
        if (!isSubscribeAction && !episodeId) return;

        setIsUnlocking(true);
        const trimmedCode = voucherCode.trim();
        const payload = isSubscribeAction
            ? { contentId, contentType }
            : { episodeId, contentType };

        if (tip !== undefined && tip !== null && tip !== "") {
            payload.tip = tip;
        }

        if (trimmedCode) {
            payload.voucherCode = trimmedCode;
        }

        try {
            const paymentResult = isSubscribeAction
                ? await subscribeWithCoin(payload).unwrap()
                : await payWithCoin(payload).unwrap();
            const latestBalance = Number(
                paymentResult?.balanceAfterTransaction ??
                paymentResult?.data?.balanceAfterTransaction,
            );
            const grossAmount = Number(
                paymentResult?.gross_amount ??
                paymentResult?.data?.gross_amount,
            ) || 0;

            if (typeof window !== "undefined") {
                window.dispatchEvent(
                    new CustomEvent(COIN_ARRIVED_EVENT, {
                        detail: {
                            addedCoins: grossAmount ? -Math.abs(grossAmount) : 0,
                            targetBalance: Number.isFinite(latestBalance) ? latestBalance : undefined,
                        },
                    }),
                );
            }

            setVoucherMessage(
                isSubscribeAction
                    ? "Pembayaran berhasil. Subscription aktif."
                    : "Pembayaran berhasil. Konten berhasil dibuka.",
            );
            setVoucherMessageType("success");
            onPaymentSuccess?.();
            onClose?.();
        } catch (err) {
            console.error("Failed to pay with coin:", err);
            const backendMessage = err?.data?.message || err?.message;
            setVoucherMessage(backendMessage || "Pembayaran coin gagal. Coba lagi.");
            setVoucherMessageType("error");
        } finally {
            setIsUnlocking(false);
        }
    };

    if (!mounted || (!isOpen && !isTopUpModalOpen)) return null;

    const handleOpenTopUp = () => {
        setIsTopUpModalOpen(true);
        onClose?.();
    };

    return createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 montserratFont">
            <button
                type="button"
                aria-label="Close unlock modal"
                onClick={onClose}
                className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            />

            <div className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[22px] border border-[#F5F5F520] bg-[#222222] text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
                <div className="relative p-6">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-18 w-18 items-center justify-center rounded-full border border-[#F08A16A6] bg-[#F08A161A]">
                            <Icon icon="solar:lock-keyhole-bold" className="h-8 w-8 text-[#FF9800]" />
                        </div>
                        <h2 className="text-[34px] leading-none font-bold tracking-tight sm:text-[40px]">
                            <span className="block text-[14px] leading-5 sm:text-[15px]">{title}</span>
                        </h2>
                        <p className="mt-1 text-lg leading-none font-semibold text-white sm:text-2xl">Unlock Premium Content</p>
                        <p className="mt-1 text-lg leading-none font-semibold text-white sm:text-2xl">
                            {isSubscribeAction ? "Subscribe Premium Content" : "Unlock Premium Content"}
                        </p>
                        <p className="mt-2 text-sm text-white/65 sm:text-base">{subtitle}</p>
                    </div>

                    <div className="mb-4">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-white/95">Apply Voucher</p>
                            {/* <button
                                type="button"
                                className="inline-flex items-center gap-1 text-sm font-medium text-[#26B6FF] hover:text-[#5bc7ff]"
                                onClick={onGetVouchers}
                            >
                                <Icon icon="solar:ticket-sale-bold" className="h-4 w-4" />
                                Get Vouchers
                            </button> */}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={voucherCode}
                                onChange={(e) => {
                                    const nextValue = e.target.value;
                                    setVoucherCode(nextValue);
                                    if (!nextValue.trim()) {
                                        setTotalDiscount(0);
                                        setVoucherMessage("");
                                        setVoucherMessageType("neutral");
                                    }
                                }}
                                placeholder="Enter voucher code"
                                className="h-11 flex-1 rounded-full border border-white/12 bg-white/9 px-5 text-sm text-white placeholder:text-white/40 focus:border-[#2A80C8] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleApplyVoucher}
                                disabled={isApplyingVoucher || !voucherCode?.trim()}
                                className="h-11 rounded-full bg-[#1E73BE] px-6 text-sm font-semibold text-white/75 transition hover:bg-[#1E73BE] disabled:cursor-not-allowed disabled:bg-white/12"
                            >
                                {isApplyingVoucher ? "..." : "Apply"}
                            </button>
                        </div>
                        {voucherMessage && (
                            <p
                                className={`mt-2 text-xs ${voucherMessageType === "error"
                                    ? "text-[#ffb4b4]"
                                    : "text-[#8be3b5]"
                                    }`}
                            >
                                {voucherMessage}
                            </p>
                        )}
                    </div>

                    <div className="mb-5 rounded-xl border border-white/10 bg-[#1F2734]/70 px-4 py-3">
                        <div className="flex items-center justify-between text-[15px] text-white/90">
                            <span>Unlock Price</span>
                            <span className="inline-flex items-center gap-1 font-bold text-[#FF9800]">
                                <img src={GateplusCoin.src} alt="Gateplus Coin" className="h-4 w-4" />
                                {formatCoin(normalizedPrice)}
                            </span>
                        </div>
                        <div className="my-2 h-px w-full bg-white/10" />
                        <div className="flex items-center justify-between text-[15px] text-white/90">
                            <span>Your Balance</span>
                            <span className="inline-flex items-center gap-1 font-bold text-[#00E08A]">
                                <Icon icon="solar:wallet-money-bold" className="h-4 w-4" />
                                {formatCoin(normalizedBalance)}
                            </span>
                        </div>
                    </div>

                    {isInsufficient && (
                        <p className="mb-4 text-sm text-[#ffb4b4]">Saldo tidak cukup untuk unlock konten ini.</p>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-xl bg-white/14 text-lg font-semibold text-white transition hover:bg-white/20"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={isInsufficient ? handleOpenTopUp : handleUnlock}
                            disabled={isUnlocking}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E73BE] text-lg font-semibold text-white transition hover:bg-[#2888da] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Icon icon={isInsufficient ? "solar:wallet-money-bold" : "solar:lock-keyhole-unlocked-bold"} className="h-5 w-5" />
                            {isInsufficient ? "Top Up" : isUnlocking ? "Processing..." : isSubscribeAction ? "Subscribe" : "Unlock"}
                        </button>
                    </div>
                </div>
            </div>

            <TopUpGateCoinsModal
                isOpen={isTopUpModalOpen}
                onClose={() => {
                    setIsTopUpModalOpen(false);
                }}
                balance={normalizedBalance}
            />
        </div>,
        document.body,
    );
}

UnlockContentModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onGetVouchers: PropTypes.func,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    basePrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    userBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    episodeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    contentType: PropTypes.string,
    tip: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    actionType: PropTypes.oneOf(["UNLOCK", "SUBSCRIBE"]),
    onPaymentSuccess: PropTypes.func,
};

UnlockContentModal.defaultProps = {
    onGetVouchers: undefined,
    title: "",
    subtitle: "",
    basePrice: 0,
    userBalance: 0,
    episodeId: null,
    contentId: null,
    contentType: "MOVIE",
    tip: null,
    actionType: "UNLOCK",
    onPaymentSuccess: undefined,
};
