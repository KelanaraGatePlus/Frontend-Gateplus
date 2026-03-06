"use client";

import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CalendarDays, CreditCard, Hash, CircleCheck, Coins, X } from "lucide-react";
import GateCoinLogo from "@@/GateplusCoin/coinLogo.svg";

const COIN_TARGET_SELECTOR = '[data-gateplus-coin-logo-target="true"]';
const COIN_ARRIVED_EVENT = "gateplus:coin-arrived";

function formatCoin(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

function formatDateTime(value) {
    if (!value) return "-";
    if (typeof value === "string") return value;

    try {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(value));
    } catch {
        return "-";
    }
}

function emitCoinArrived(addedCoins) {
    if (typeof window === "undefined") return;

    window.dispatchEvent(
        new CustomEvent(COIN_ARRIVED_EVENT, {
            detail: { addedCoins },
        })
    );
}

function DetailRow({ icon, label, value, valueClassName = "text-white/85" }) {
    return (
        <div className="flex items-center justify-between gap-2 border-b border-[#F5F5F514] py-1.5 text-xs last:border-b-0">
            <div className="flex items-center gap-1.5 text-[#A9B4C5]">
                {icon}
                <span>{label}</span>
            </div>
            <span className={`max-w-[58%] text-right font-medium leading-tight wrap-break-word ${valueClassName}`}>{value}</span>
        </div>
    );
}

DetailRow.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    valueClassName: PropTypes.string,
};

export default function PaymentSuccessModal({
    isOpen,
    onClose,
    status = "Completed",
    transactionId = "-",
    dateTime = null,
    paymentMethod = "-",
    baseAmount = 0,
    bonus = 0,
    newBalance = 0,
    title = "Payment Successful!",
    subtitle = "Your coins have been added to your account",
}) {
    const modalCardRef = useRef(null);
    const coinSourceRef = useRef(null);
    const [phase, setPhase] = useState("idle");
    const [flightPath, setFlightPath] = useState(null);
    const [morphOrigin, setMorphOrigin] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setPhase("idle");
            setFlightPath(null);
            setMorphOrigin(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const addedCoins = Number(baseAmount || 0) + Number(bonus || 0);

    const handleDoneClick = () => {
        if (phase !== "idle") return;

        const sourceEl = coinSourceRef.current;
        const modalEl = modalCardRef.current;
        const targetEl = typeof document !== "undefined" ? document.querySelector(COIN_TARGET_SELECTOR) : null;

        if (!sourceEl || !modalEl || !targetEl) {
            emitCoinArrived(addedCoins);
            onClose?.();
            return;
        }

        const sourceRect = sourceEl.getBoundingClientRect();
        const modalRect = modalEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const startX = modalRect.left + modalRect.width / 2;
        const startY = modalRect.top + modalRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;
        const liftY = startY - 70;
        const peakX = (startX + endX) / 2;
        const peakY = Math.min(liftY, endY) - 120;

        setFlightPath({ startX, startY, endX, endY, liftY, peakX, peakY });
        setMorphOrigin({
            x: sourceRect.left + sourceRect.width / 2,
            y: sourceRect.top + sourceRect.height / 2,
            modalCenterX: startX,
            modalCenterY: startY,
        });
        setPhase("morph");
    };

    const handleModalMorphComplete = () => {
        if (phase === "morph") {
            setPhase("morph-coin");
        }
    };

    const handleMorphCoinComplete = () => {
        if (phase === "morph-coin") {
            setPhase("fly");
        }
    };

    const handleFlyComplete = () => {
        emitCoinArrived(addedCoins);
        onClose?.();
    };

    return createPortal(
        <div className="fixed inset-0 z-999 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4 montserratFont">
            <motion.button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="absolute inset-0"
                initial={false}
                animate={
                    phase === "idle"
                        ? {
                            backgroundColor: "rgba(0,0,0,0.7)",
                            backdropFilter: "blur(2px)",
                        }
                        : {
                            backgroundColor: "rgba(0,0,0,0.5)",
                            backdropFilter: "blur(0px)",
                        }
                }
                transition={{ duration: phase === "idle" ? 0.2 : 0.01, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
                ref={modalCardRef}
                className="relative z-10 my-auto flex max-h-[94vh] w-full max-w-110 flex-col overflow-y-auto rounded-2xl border border-[#F5F5F51F] bg-[#222222] p-4 text-white shadow-2xl shadow-black/40"
                initial={false}
                animate={
                    phase === "idle"
                        ? {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            borderRadius: "16px",
                            filter: "blur(0px)",
                        }
                        : {
                            // Keep hidden for morph, morph-coin, and fly so modal does not reappear.
                            opacity: 0,
                            scale: 0.18,
                            y: -28,
                            borderRadius: "9999px",
                            filter: "blur(8px)",
                        }
                }
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                onAnimationComplete={handleModalMorphComplete}
            >
                <button
                    type="button"
                    aria-label="Close payment success modal"
                    onClick={onClose}
                    disabled={phase !== "idle"}
                    className="absolute right-3 top-3 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                    <X size={16} />
                </button>

                <div className="flex flex-col gap-1 text-center">
                    <div>
                        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#00C853] bg-[#00C8531A] text-[#00E676]">
                            <Check size={20} />
                        </div>
                        <h2 className="montserratFont text-xl font-bold md:text-2xl">{title}</h2>
                    </div>
                    <p className="text-xs leading-relaxed text-[#BFC8D6]">{subtitle}</p>
                </div>

                <div className="mt-3 rounded-xl border border-[#FF69004D] bg-linear-to-br from-[#FF69001A] to-[#F0B1001A] p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-[#FF8904]">
                        <img
                            ref={coinSourceRef}
                            src={GateCoinLogo.src}
                            alt="GateCoin"
                            className="drop-shadow-[0_0_10px_rgba(255,137,4,0.55)]"
                            width={22}
                            height={22}
                        />
                        <span className="text-3xl font-extrabold leading-none">+{formatCoin(addedCoins)}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#BFC8D6]">GateCoins Added</p>
                </div>

                <div className="mt-3 rounded-xl border border-[#F5F5F514] bg-[#1E293980] p-3">
                    <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-white">
                        <CircleCheck size={14} className="text-[#6EA8FF]" />
                        Transaction Details
                    </h3>

                    <DetailRow
                        icon={<CircleCheck size={12} />}
                        label="Status"
                        value={status}
                        valueClassName="text-[#05DF72]"
                    />
                    <DetailRow icon={<Hash size={12} />} label="Transaction ID" value={transactionId} valueClassName="text-[11px] text-[#D8E2F0]" />
                    <DetailRow icon={<CalendarDays size={12} />} label="Date & Time" value={formatDateTime(dateTime)} valueClassName="text-[#E4ECF8]" />
                    <DetailRow icon={<CreditCard size={12} />} label="Payment Method" value={paymentMethod} />
                    <DetailRow icon={<Coins size={12} />} label="Base Amount" value={`${formatCoin(baseAmount)} Coins`} />
                    <DetailRow icon={<Coins size={12} />} label="Bonus" value={`+${formatCoin(bonus)} Coins`} valueClassName="text-[#05DF72]" />
                    <DetailRow icon={<Coins size={12} />} label="New Balance" value={`${formatCoin(newBalance)} Coins`} valueClassName="text-[#FF9900] text-base font-bold" />
                </div>

                <button
                    type="button"
                    onClick={handleDoneClick}
                    disabled={phase !== "idle"}
                    className="mt-3 w-full rounded-lg bg-[#00C853] px-4 py-2.5 text-base font-semibold transition hover:bg-[#00B34A]"
                >
                    Done
                </button>
            </motion.div>

            <AnimatePresence>
                {phase === "morph-coin" && morphOrigin && (
                    <motion.div
                        key="gateplus-morph-coin"
                        className="pointer-events-none fixed z-10000 flex items-center justify-center rounded-full border border-[#FFB00099] bg-[#FF8A0026]"
                        style={{
                            width: 42,
                            height: 42,
                            left: morphOrigin.modalCenterX,
                            top: morphOrigin.modalCenterY,
                            x: "-50%",
                            y: "-50%",
                        }}
                        initial={{
                            scale: 0.2,
                            opacity: 0,
                            filter: "drop-shadow(0 0 0px rgba(255,176,0,0))",
                        }}
                        animate={{
                            scale: [0.2, 1.12, 1],
                            opacity: [0, 1, 1],
                            filter: [
                                "drop-shadow(0 0 0px rgba(255,176,0,0))",
                                "drop-shadow(0 0 18px rgba(255,176,0,0.95))",
                                "drop-shadow(0 0 12px rgba(255,176,0,0.8))",
                            ],
                        }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        exit={{ opacity: 0 }}
                        onAnimationComplete={handleMorphCoinComplete}
                    >
                        <img src={GateCoinLogo.src} alt="Morph GateCoin" width={24} height={24} />
                    </motion.div>
                )}

                {phase === "fly" && flightPath && (
                    <motion.img
                        key="gateplus-fly-coin"
                        src={GateCoinLogo.src}
                        alt="Flying GateCoin"
                        className="pointer-events-none fixed z-10000"
                        style={{ width: 30, height: 30 }}
                        initial={{
                            left: flightPath.startX,
                            top: flightPath.startY - 8,
                            x: "-50%",
                            y: "-50%",
                            scale: 1.55,
                            opacity: 1,
                            filter: "drop-shadow(0 0 16px rgba(255, 176, 0, 0.95))",
                        }}
                        animate={{
                            left: [flightPath.startX, flightPath.startX, flightPath.peakX, flightPath.endX],
                            top: [flightPath.startY, flightPath.liftY, flightPath.peakY, flightPath.endY],
                            scale: [1.55, 1.18, 1, 0.72],
                            opacity: [1, 1, 1, 0.9],
                            filter: [
                                "drop-shadow(0 0 16px rgba(255, 176, 0, 0.95))",
                                "drop-shadow(0 0 14px rgba(255, 176, 0, 0.9))",
                                "drop-shadow(0 0 12px rgba(255, 176, 0, 0.84))",
                                "drop-shadow(0 0 10px rgba(255, 176, 0, 0.72))",
                            ],
                        }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        exit={{ opacity: 0 }}
                        onAnimationComplete={handleFlyComplete}
                    />
                )}
            </AnimatePresence>
        </div>,
        document.body
    );
}

PaymentSuccessModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    status: PropTypes.string,
    transactionId: PropTypes.string,
    dateTime: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]),
    paymentMethod: PropTypes.string,
    baseAmount: PropTypes.number,
    bonus: PropTypes.number,
    newBalance: PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string,
};