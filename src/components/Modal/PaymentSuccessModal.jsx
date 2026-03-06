"use client";

import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CalendarDays, CreditCard, Hash, CircleCheck, Coins, X } from "lucide-react";
import GateCoinLogo from "@@/GateplusCoin/coinLogo.svg";

const COIN_TARGET_SELECTOR = '[data-gateplus-coin-logo-target="true"]';
const COIN_ARRIVED_EVENT = "gateplus:coin-arrived";

// ─── Math helpers ─────────────────────────────────────────────────────────────

/** Cubic bezier point: p0=start, p1=cp1, p2=cp2, p3=end */
function cubicBezier(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return {
        x: u ** 3 * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t ** 3 * p3.x,
        y: u ** 3 * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t ** 3 * p3.y,
    };
}

/** ease-in-out sine — paling natural untuk gerak fisik */
function eioSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}

/** ease-out cubic */
function eoCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// ─── Rotasi koin: spin bebas lalu snap ke depan saat mendarat ─────────────────
// raw 0–0.72 : spin penuh bebas  (0 → 360°)
// raw 0.72–1 : spin melambat dan snap ke 0° (menghadap depan)
function coinRotateY(raw) {
    if (raw <= 0.72) {
        // satu putaran penuh selama 72% perjalanan
        return eioSine(raw / 0.72) * 360;
    }
    // 28% terakhir: dari titik rotasi saat t=0.72 → 0° (muka depan)
    const baseAngle = 360; // sudah penuh satu putaran
    const landPhase = (raw - 0.72) / 0.28;
    // ease-out cubic agar snap halus, bukan tiba-tiba
    return baseAngle * (1 - eoCubic(landPhase));
}

// ─── Scale koin: tumbuh saat naik, stabil di tengah, kecil saat mendarat ─────
function coinScale(raw) {
    if (raw < 0.35) return 1 + eoCubic(raw / 0.35) * 0.28;   // 1 → 1.28
    if (raw < 0.72) return 1.28;                               // stabil
    return 1.28 - eoCubic((raw - 0.72) / 0.28) * 0.9;        // 1.28 → 0.38
}

// ─── Glow: penuh selama terbang, mulai fade hanya 88–100% ────────────────────
function coinGlow(raw) {
    if (raw < 0.88) return 1;
    return 1 - ((raw - 0.88) / 0.12);
}

// ─── FlyingCoin: Web Animations API, 100 keyframe, zero jitter ───────────────
function FlyingCoin({ index, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY, delay, onArrived }) {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const STEPS    = 100;
        const duration = 980 + index * 25; // sedikit beda tiap koin → organik

        const keyframes = Array.from({ length: STEPS + 1 }, (_, i) => {
            const raw = i / STEPS;
            const t   = eioSine(raw); // smooth easing untuk path position

            const pos    = cubicBezier(t,
                { x: startX, y: startY },
                { x: cp1x,   y: cp1y   },
                { x: cp2x,   y: cp2y   },
                { x: endX,   y: endY   },
            );
            const rotY   = coinRotateY(raw);
            const scale  = coinScale(raw);
            const glowA  = coinGlow(raw);

            // Glow: kuat di tengah perjalanan (puncak arc), redup saat landing
            const glowPx = raw < 0.88
                ? 8 + Math.sin(raw * Math.PI) * 14   // 8→22→8px
                : 8 * (1 - (raw - 0.88) / 0.12);     // 8→0

            return {
                left:      `${pos.x}px`,
                top:       `${pos.y}px`,
                opacity:   raw < 0.88 ? 1 : 1 - eoCubic((raw - 0.88) / 0.12),
                filter:    `drop-shadow(0 0 ${glowPx}px rgba(255,176,0,${(glowA * 0.92).toFixed(2)})) drop-shadow(0 1px 3px rgba(0,0,0,0.45))`,
                transform: `translate(-50%,-50%) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
                offset:    raw,
            };
        });

        // initial keyframe: tersembunyi sebelum delay
        el.style.opacity = "0";

        const anim = el.animate(keyframes, {
            duration,
            delay,
            fill:   "forwards",
            easing: "linear", // easing sudah tertanam per-keyframe
        });

        anim.onfinish = () => onArrived?.();
        return () => anim.cancel();
    }, []);

    return (
        <img
            ref={ref}
            src={GateCoinLogo.src}
            alt=""
            style={{
                position:        "fixed",
                width:           26,
                height:          26,
                pointerEvents:   "none",
                zIndex:          10000,
                // perspectiveOrigin di elemen sendiri agar rotateY benar
                perspective:     "180px",
                transformStyle:  "preserve-3d",
                willChange:      "transform, opacity, left, top, filter",
                opacity:         0,
            }}
        />
    );
}

// ─── Burst effect: DOM-native, zero React re-render ──────────────────────────
function BurstEffect({ cx, cy }) {
    const wrapRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        // Helper: buat elemen dan langsung animate
        function spawn(css, frames, opts) {
            const el = document.createElement("div");
            el.style.cssText = `position:absolute;pointer-events:none;${css}`;
            wrap.appendChild(el);
            el.animate(frames, { fill: "forwards", ...opts });
        }

        // 1. Glow flash — soft radial bloom, cepat hilang
        spawn(
            "width:32px;height:32px;border-radius:50%;left:-16px;top:-16px;" +
            "background:radial-gradient(circle,rgba(255,220,80,0.85) 0%,rgba(255,160,0,0.3) 55%,transparent 75%);" +
            "box-shadow:0 0 18px 8px rgba(255,176,0,0.5);",
            [
                { transform: "scale(0.5)", opacity: 1 },
                { transform: "scale(2.2)", opacity: 0 },
            ],
            { duration: 380, easing: "cubic-bezier(0.1,0,0.25,1)" }
        );

        // 2. Spark trails — menyebar 360°
        const SPARKS = 20;
        for (let i = 0; i < SPARKS; i++) {
            const angle   = (i / SPARKS) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
            const dist    = 30 + Math.random() * 42;
            const tx      = Math.cos(angle) * dist;
            const ty      = Math.sin(angle) * dist;
            const hue     = 36 + Math.random() * 26;
            const lit     = 54 + Math.random() * 22;
            const sz      = 4 + Math.random() * 5;
            const dur     = 380 + Math.random() * 240;
            const dly     = Math.random() * 55;

            spawn(
                `width:${sz}px;height:${sz}px;border-radius:50%;left:${-sz / 2}px;top:${-sz / 2}px;` +
                `background:hsl(${hue},100%,${lit}%);box-shadow:0 0 6px 2px hsla(${hue},100%,70%,0.75);`,
                [
                    { transform: "translate(0,0) scale(1)", opacity: 1 },
                    { transform: `translate(${tx * 0.55}px,${ty * 0.55}px) scale(0.85)`, opacity: 1, offset: 0.28 },
                    { transform: `translate(${tx}px,${ty}px) scale(0)`, opacity: 0 },
                ],
                { duration: dur, delay: dly, easing: "cubic-bezier(0.2,0,0.5,1)" }
            );
        }

        // 3. Shimmer dots — partikel kecil berkilau, bergerak lambat
        for (let i = 0; i < 6; i++) {
            const a  = Math.random() * Math.PI * 2;
            const d  = 10 + Math.random() * 20;
            const tx = Math.cos(a) * d;
            const ty = Math.sin(a) * d;

            spawn(
                "width:3px;height:3px;border-radius:50%;left:-1.5px;top:-1.5px;" +
                "background:#FFFDE7;box-shadow:0 0 5px 2px rgba(255,245,130,0.9);",
                [
                    { transform: "translate(0,0) scale(1.2)", opacity: 1 },
                    { transform: `translate(${tx}px,${ty}px) scale(0)`, opacity: 0 },
                ],
                { duration: 500 + Math.random() * 200, delay: 90 + Math.random() * 110, easing: "ease-out" }
            );
        }

        const cleanup = setTimeout(() => wrap.remove(), 1400);
        return () => clearTimeout(cleanup);
    }, []);

    return (
        <div
            ref={wrapRef}
            style={{ position: "fixed", left: cx, top: cy, pointerEvents: "none", zIndex: 10002 }}
        />
    );
}

// ─── Utilities (tidak diubah) ─────────────────────────────────────────────────

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
    window.dispatchEvent(new CustomEvent(COIN_ARRIVED_EVENT, { detail: { addedCoins } }));
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

// ─── Main Modal ───────────────────────────────────────────────────────────────

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
    const modalCardRef  = useRef(null);
    const coinSourceRef = useRef(null);
    const arrivedRef    = useRef(0);
    const emittedOnFirstArrivalRef = useRef(false);

    const [phase,       setPhase]       = useState("idle");
    const [flightPath,  setFlightPath]  = useState(null);
    const [morphOrigin, setMorphOrigin] = useState(null);
    const [flyingCoins, setFlyingCoins] = useState([]);
    const [burst,       setBurst]       = useState(null);

    const FLYING_COIN_COUNT = 8;

    useEffect(() => {
        if (!isOpen) {
            setPhase("idle");
            setFlightPath(null);
            setMorphOrigin(null);
            setFlyingCoins([]);
            setBurst(null);
            arrivedRef.current = 0;
            emittedOnFirstArrivalRef.current = false;
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const addedCoins = Number(baseAmount || 0) + Number(bonus || 0);

    const handleDoneClick = () => {
        if (phase !== "idle") return;

        const sourceEl = coinSourceRef.current;
        const modalEl  = modalCardRef.current;
        const targetEl = typeof document !== "undefined" ? document.querySelector(COIN_TARGET_SELECTOR) : null;

        if (!sourceEl || !modalEl || !targetEl) {
            emitCoinArrived(addedCoins);
            onClose?.();
            return;
        }

        const sourceRect = sourceEl.getBoundingClientRect();
        const modalRect  = modalEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();

        const startX = modalRect.left  + modalRect.width  / 2;
        const startY = modalRect.top   + modalRect.height / 2;
        const endX   = targetRect.left + targetRect.width  / 2;
        const endY   = targetRect.top  + targetRect.height / 2;

        // ── Premium cubic bezier path ─────────────────────────────────────────
        // Kurva S-elegan: CP1 naik vertikal dari start, CP2 mendatar ke target
        // Hasilnya: koin "melesat ke atas" lalu "meluncur masuk" ke navbar
        const MARGIN = 20;
        const vw     = window.innerWidth;
        const minY   = Math.min(startY, endY);

        // Tinggi arc: cukup tinggi agar terasa dramatis, tapi tidak keluar layar
        const arcH  = Math.min(Math.abs(endX - startX) * 0.5 + 80, minY - MARGIN);

        // CP1: langsung naik dari start (takeoff vertikal)
        const cp1x  = Math.max(MARGIN, Math.min(vw - MARGIN, startX + (endX - startX) * 0.08));
        const cp1y  = startY - arcH;

        // CP2: masuk ke target dari arah hampir horizontal (landing mulus)
        const cp2x  = Math.max(MARGIN, Math.min(vw - MARGIN, endX - (endX - startX) * 0.08));
        const cp2y  = endY - arcH * 0.18;

        setFlightPath({ startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY });
        setMorphOrigin({
            x: sourceRect.left + sourceRect.width  / 2,
            y: sourceRect.top  + sourceRect.height / 2,
            modalCenterX: startX,
            modalCenterY: startY,
        });
        setPhase("morph");
    };

    const handleModalMorphComplete = () => {
        if (phase === "morph") setPhase("morph-coin");
    };

    const handleMorphCoinComplete = () => {
        if (phase !== "morph-coin") return;
        arrivedRef.current = 0;

        // Fan-spread kecil di posisi awal
        const coins = Array.from({ length: FLYING_COIN_COUNT }, (_, i) => ({
            id:     i,
            delay:  i * 48,
            startX: flightPath.startX + (Math.random() - 0.5) * 20,
            startY: flightPath.startY + (Math.random() - 0.5) * 12,
        }));
        setFlyingCoins(coins);
        setPhase("fly");
    };

    const handleCoinArrived = () => {
        arrivedRef.current += 1;

        // Start navbar glow and count effect as soon as the first coin lands.
        if (!emittedOnFirstArrivalRef.current) {
            emittedOnFirstArrivalRef.current = true;
            emitCoinArrived(addedCoins);
        }

        if (arrivedRef.current < FLYING_COIN_COUNT) return;

        const targetEl = document.querySelector(COIN_TARGET_SELECTOR);
        if (targetEl) {
            const r = targetEl.getBoundingClientRect();
            setBurst({ cx: r.left + r.width / 2, cy: r.top + r.height / 2 });
        }

        setTimeout(() => {
            onClose?.();
        }, 680);
    };

    return createPortal(
        <>
            {/* ── Overlay + Modal card ── */}
            <div className="fixed inset-0 z-999 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4 montserratFont">
                <motion.button
                    type="button"
                    aria-label="Close modal"
                    onClick={onClose}
                    className="absolute inset-0"
                    initial={false}
                    animate={
                        phase === "idle"
                            ? { backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)" }
                            : phase === "morph" || phase === "morph-coin"
                                ? { backgroundColor: "rgba(0,0,0,0.22)", backdropFilter: "blur(0px)" }
                                : { backgroundColor: "rgba(0,0,0,0.06)", backdropFilter: "blur(0px)" }
                    }
                    transition={{ duration: phase === "idle" ? 0.2 : 0.01, ease: [0.22, 1, 0.36, 1] }}
                />

                <motion.div
                    ref={modalCardRef}
                    className="relative z-10 my-auto flex max-h-[94vh] w-full max-w-110 flex-col overflow-y-auto rounded-2xl border border-[#F5F5F51F] bg-[#222222] p-4 text-white shadow-2xl shadow-black/40"
                    initial={false}
                    animate={
                        phase === "idle"
                            ? { opacity: 1, scale: 1, y: 0, borderRadius: "16px", filter: "blur(0px)" }
                            : { opacity: 0, scale: 0.18, y: -28, borderRadius: "9999px", filter: "blur(8px)" }
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
                        <DetailRow icon={<CircleCheck size={12} />} label="Status" value={status} valueClassName="text-[#05DF72]" />
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

                {/* ── Morph coin bubble (tidak diubah) ── */}
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
                </AnimatePresence>
            </div>

            {/* ── Flying Coins — Web Animations API ── */}
            {phase === "fly" && flightPath && flyingCoins.map((coin) => (
                <FlyingCoin
                    key={coin.id}
                    index={coin.id}
                    startX={coin.startX}
                    startY={coin.startY}
                    cp1x={flightPath.cp1x}
                    cp1y={flightPath.cp1y}
                    cp2x={flightPath.cp2x}
                    cp2y={flightPath.cp2y}
                    endX={flightPath.endX}
                    endY={flightPath.endY}
                    delay={coin.delay}
                    onArrived={handleCoinArrived}
                />
            ))}

            {/* ── Burst effect saat koin landing ── */}
            {burst && (
                <BurstEffect
                    key={`burst-${burst.cx}-${burst.cy}`}
                    cx={burst.cx}
                    cy={burst.cy}
                />
            )}
        </>,
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