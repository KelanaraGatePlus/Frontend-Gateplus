"use client"

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import CoinLogo from "@@/GateplusCoin/coinLogo.svg";
import TopUpGateCoinsModal from "../Modal/TopUpGateCoinsModal";

const COIN_ARRIVED_EVENT = "gateplus:coin-arrived";

function formatCoin(value) {
    return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

export default function ShowCoin({ balance, withPayment = true }) {
    const [modalTopUpOpen, setModalTopUpOpen] = React.useState(false);
    const [displayBalance, setDisplayBalance] = React.useState(Number(balance) || 0);
    const [isLogoGlowing, setIsLogoGlowing] = React.useState(false);
    const [isCounting, setIsCounting] = React.useState(false);
    const [impactKey, setImpactKey] = React.useState(0);
    const balanceRef = React.useRef(Number(balance) || 0);
    const balancePropRef = React.useRef(Number(balance) || 0);
    const previousBalancePropRef = React.useRef(Number(balance) || 0);
    const isCountingRef = React.useRef(false);
    const animationFrameRef = React.useRef(null);
    const animationRunIdRef = React.useRef(0);
    const delayedSyncTimeoutRef = React.useRef(null);
    const pendingSyncBalanceRef = React.useRef(null);

    const clearDelayedSync = React.useCallback(() => {
        if (delayedSyncTimeoutRef.current) {
            clearTimeout(delayedSyncTimeoutRef.current);
            delayedSyncTimeoutRef.current = null;
        }
    }, []);

    React.useEffect(() => {
        const nextBalance = Number(balance) || 0;
        previousBalancePropRef.current = balancePropRef.current;
        balancePropRef.current = nextBalance;

        if (isCountingRef.current) return;

        const currentDisplay = balanceRef.current;
        const isIncrease = nextBalance > currentDisplay;

        if (isIncrease) {
            // Hold optimistic prop update; coin-arrived event will drive the visible count-up.
            pendingSyncBalanceRef.current = nextBalance;
            clearDelayedSync();
            delayedSyncTimeoutRef.current = setTimeout(() => {
                const pendingBalance = pendingSyncBalanceRef.current;
                if (pendingBalance !== null && !isCountingRef.current) {
                    setDisplayBalance(pendingBalance);
                    balanceRef.current = pendingBalance;
                }
                pendingSyncBalanceRef.current = null;
                delayedSyncTimeoutRef.current = null;
            }, 4000);
            return;
        }

        pendingSyncBalanceRef.current = null;
        clearDelayedSync();
        {
            setDisplayBalance(nextBalance);
            balanceRef.current = nextBalance;
        }
    }, [balance, clearDelayedSync]);

    React.useEffect(() => {
        const animateBalanceTo = (targetValue) => {
            const nextTarget = Number(targetValue);
            if (!Number.isFinite(nextTarget)) return;

            const startValue = balanceRef.current;
            if (nextTarget === startValue) return;

            clearDelayedSync();
            pendingSyncBalanceRef.current = null;
            const endValue = nextTarget;

            const runId = animationRunIdRef.current + 1;
            animationRunIdRef.current = runId;
            setIsCounting(true);
            isCountingRef.current = true;
            setIsLogoGlowing(true);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            const distance = Math.abs(endValue - startValue);
            const duration = Math.min(1400, Math.max(550, 500 + distance * 12));
            let startTs = null;

            const step = (timestamp) => {
                if (!startTs) startTs = timestamp;
                const elapsed = timestamp - startTs;
                const progress = Math.min(elapsed / duration, 1);

                const eased = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.round(startValue + (endValue - startValue) * eased);

                balanceRef.current = currentValue;
                setDisplayBalance(currentValue);

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(step);
                } else {
                    const finalValue = endValue;
                    balanceRef.current = finalValue;
                    setDisplayBalance(finalValue);
                    animationFrameRef.current = null;
                    if (animationRunIdRef.current === runId) {
                        setIsCounting(false);
                        isCountingRef.current = false;
                        setIsLogoGlowing(false);
                    }
                }
            };

            animationFrameRef.current = requestAnimationFrame(step);
        };

        const handleCoinArrived = (event) => {
            const detail = event?.detail || {};
            const targetBalance = Number(
                detail?.targetBalance ?? detail?.balanceAfterTransaction,
            );
            const amount = Number(detail?.addedCoins);

            setImpactKey((prev) => prev + 1);

            if (Number.isFinite(targetBalance)) {
                animateBalanceTo(targetBalance);
                return;
            }

            if (Number.isFinite(amount) && amount !== 0) {
                animateBalanceTo(balanceRef.current + amount);
            }
        };

        window.addEventListener(COIN_ARRIVED_EVENT, handleCoinArrived);

        return () => {
            window.removeEventListener(COIN_ARRIVED_EVENT, handleCoinArrived);
            clearDelayedSync();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            setIsCounting(false);
            isCountingRef.current = false;
            setIsLogoGlowing(false);
        };
    }, [clearDelayedSync]);

    return (
        <>
            <motion.div
                className={`flex items-center justify-center gap-2 w-max h-full border bg-[#F5F5F5]/6 text-white delay-100 backdrop-blur-sm rounded-full px-2 py-2 transition-colors duration-200 ${isCounting
                    ? "border-[#FFB000AA]"
                    : "border-[#F5F5F51A]"
                    }`}
                animate={isCounting
                    ? {
                        boxShadow: [
                            "0 0 0px rgba(255, 176, 0, 0)",
                            "0 0 18px rgba(255, 176, 0, 0.55)",
                            "0 0 0px rgba(255, 176, 0, 0)",
                        ],
                    }
                    : { boxShadow: "0 0 0px rgba(255, 176, 0, 0)" }}
                transition={{ duration: 0.9, repeat: isCounting ? Infinity : 0, ease: [0.22, 1, 0.36, 1] }}
            >
                <div className="flex items-center justify-center gap-1">
                    <div className="relative flex items-center justify-center">
                        <motion.img
                            data-gateplus-coin-logo-target="true"
                            src={CoinLogo.src}
                            alt="Coin Logo"
                            width={20}
                            height={20}
                            initial={false}
                            animate={
                                isLogoGlowing
                                    ? {
                                        scale: [1, 1.16, 1],
                                        filter: [
                                            "drop-shadow(0 0 0px rgba(255, 176, 0, 0))",
                                            "drop-shadow(0 0 16px rgba(255, 176, 0, 0.96))",
                                            "drop-shadow(0 0 0px rgba(255, 176, 0, 0))",
                                        ],
                                    }
                                    : { scale: 1, filter: "drop-shadow(0 0 0px rgba(255, 176, 0, 0))" }
                            }
                            transition={isLogoGlowing
                                ? {
                                    duration: 0.9,
                                    repeat: Infinity,
                                    ease: [0.22, 1, 0.36, 1],
                                }
                                : { duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        />

                        <AnimatePresence>
                            {impactKey > 0 && (
                                <>
                                    <motion.span
                                        key={`impact-ring-1-${impactKey}`}
                                        className="pointer-events-none absolute h-6 w-6 rounded-full border border-[#FFB000AA]"
                                        initial={{ scale: 0.6, opacity: 0.9 }}
                                        animate={{ scale: 2.2, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                    <motion.span
                                        key={`impact-ring-2-${impactKey}`}
                                        className="pointer-events-none absolute h-5 w-5 rounded-full border border-[#FFD166CC]"
                                        initial={{ scale: 0.7, opacity: 0.8 }}
                                        animate={{ scale: 1.7, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.42, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                                    />
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                    <span className="font-bold text-md montserratFont text-white">{formatCoin(displayBalance)}</span>
                </div>
                {withPayment && (
                    <button
                        className="bg-[#F07F26] hover:border hover:border-white text-xs rounded-full px-2.5 py-1 montserratFont font-bold text-white"
                        onClick={() => setModalTopUpOpen(true)}
                    >
                        Top Up
                    </button>
                )}
            </motion.div>
            {withPayment && <TopUpGateCoinsModal isOpen={modalTopUpOpen} onClose={() => setModalTopUpOpen(false)} />}
        </>
    );
}