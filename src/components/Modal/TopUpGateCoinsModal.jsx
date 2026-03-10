"use client";

import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { X } from "lucide-react";

import coinLogo from "@@/GateplusCoin/coinLogo.svg";
import { createPortal } from "react-dom";
import { paymentMethods as paymentMethodConfig } from "@/lib/constants/paymentMethod";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";
import { useGetCoinPackagesQuery } from "@/hooks/api/coinPackageAPI";
import { useCoinPayment } from "@/hooks/api/paymentAPI";
import PaymentSuccessModal from "@/components/Modal/PaymentSuccessModal";
import { useCheckPaymentStatusMutation } from "@/hooks/api/paymentSliceAPI";
import { countAdminFee } from "@/lib/constants/paymentMethod";
import { fee } from "@/lib/constants/fee";

const DEFAULT_PACKAGES = [
    { id: "10k", amount: 10000, price: 10000, bonus: 0 },
    { id: "25k", amount: 25000, price: 25000, bonus: 2500 },
    { id: "50k", amount: 50000, price: 50000, bonus: 7500, isPopular: true },
    { id: "100k", amount: 100000, price: 100000, bonus: 20000 },
    { id: "250k", amount: 250000, price: 250000, bonus: 62500 },
    { id: "500k", amount: 500000, price: 500000, bonus: 150000 },
];

const SUCCESS_MODAL_INITIAL_STATE = {
    status: "Completed",
    transactionId: "-",
    dateTime: null,
    paymentMethod: "-",
    baseAmount: 0,
    bonus: 0,
    newBalance: 0,
};

function formatRupiah(value) {
    return `Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
}

function formatCoin(value) {
    return new Intl.NumberFormat("id-ID").format(value);
}

function toNumber(value) {
    const normalized = Number(value);
    return Number.isFinite(normalized) ? normalized : 0;
}

function normalizeCoinPackagesResponse(response) {
    const candidateList =
        (Array.isArray(response) && response) ||
        (Array.isArray(response?.data) && response.data) ||
        (Array.isArray(response?.data?.data) && response.data.data) ||
        (Array.isArray(response?.data?.data?.data) && response.data.data.data) ||
        [];

    return candidateList
        .map((item, index) => {
            const amount = toNumber(item?.amount ?? item?.coinAmount ?? item?.coin ?? item?.coins);
            const price = toNumber(item?.price ?? item?.nominalPrice ?? item?.rupiah ?? item?.amountPrice);
            const bonus = toNumber(item?.bonus ?? item?.bonusCoin ?? item?.bonusAmount);

            return {
                id: String(item?.id ?? item?._id ?? item?.packageId ?? `coin-package-${index}`),
                amount,
                price,
                bonus,
                isPopular: Boolean(item?.isPopular ?? item?.popular ?? item?.isBestSeller),
            };
        })
        .filter((item) => item.amount > 0 && item.price > 0);
}

function resolveOrderId(result) {
    const candidate =
        result?.orderId ||
        result?.order_id ||
        result?.transaction_id ||
        result?.transactionId ||
        result?.id;

    return candidate ? String(candidate) : null;
}

function formatPaymentStatus(result) {
    return String(result?.transaction_status || result?.status || "Completed")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveTransactionId(result) {
    return String(result?.transaction_id || result?.order_id || result?.orderId || result?.id || "-");
}

export default function TopUpGateCoinsModal({
    isOpen,
    onClose,
    balance = 0,
    packages = DEFAULT_PACKAGES,
    defaultPackageId,
    defaultPaymentMethodId,
    onContinue,
}) {
    const { payCoin, isPaying } = useCoinPayment();
    const [checkPaymentStatus] = useCheckPaymentStatusMutation();

    const { data: coinPackagesResponse } = useGetCoinPackagesQuery(undefined, {
        skip: !isOpen,
    });

    const apiPackages = useMemo(() => normalizeCoinPackagesResponse(coinPackagesResponse), [coinPackagesResponse]);
    const resolvedPackages = apiPackages.length > 0 ? apiPackages : packages;

    const initialPackageId = useMemo(() => {
        if (defaultPackageId) return defaultPackageId;
        const popularPackage = resolvedPackages.find((item) => item.isPopular);
        return popularPackage?.id || resolvedPackages[0]?.id || null;
    }, [defaultPackageId, resolvedPackages]);

    const initialPaymentMethodId = useMemo(() => defaultPaymentMethodId || null, [defaultPaymentMethodId]);

    const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(initialPaymentMethodId);
    const [isConfirmStep, setIsConfirmStep] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successModalData, setSuccessModalData] = useState(SUCCESS_MODAL_INITIAL_STATE);

    useEffect(() => {
        if (!isOpen) return;
        setSelectedPackageId(initialPackageId);
        setSelectedPaymentMethodId(initialPaymentMethodId);
        setIsConfirmStep(false);
        setIsSuccessModalOpen(false);
    }, [isOpen, initialPackageId, initialPaymentMethodId]);

    const selectedPackage = useMemo(
        () => resolvedPackages.find((item) => item.id === selectedPackageId) || null,
        [resolvedPackages, selectedPackageId]
    );

    const selectedPaymentMethod = useMemo(() => {
        if (!selectedPaymentMethodId) return null;
        return {
            id: selectedPaymentMethodId,
            ...paymentMethodConfig[selectedPaymentMethodId],
        };
    }, [selectedPaymentMethodId]);

    const isSelectionInvalid = !selectedPackage || !selectedPaymentMethod;
    const isDisabled = isSelectionInvalid || isPaying;
    const totalCoins = (selectedPackage?.amount || 0) + (selectedPackage?.bonus || 0);
    const paymentAmount = selectedPackage?.price || 0;
    const transferFee = selectedPaymentMethodId
        ? countAdminFee(paymentAmount, selectedPaymentMethodId) || 0
        : 0;
    const systemFee = paymentAmount > 0 ? fee.serviceFee || 0 : 0;
    const totalPayable = paymentAmount + transferFee + systemFee;

    const getLatestPaymentResult = async (result) => {
        const orderId = resolveOrderId(result);
        if (!orderId) return result;

        try {
            const latest = await checkPaymentStatus(orderId).unwrap();
            return latest?.data || latest || result;
        } catch {
            return result;
        }
    };

    const buildSuccessModalData = (result) => {
        const nextBalance =
            toNumber(
                result?.newBalance ??
                result?.new_balance ??
                result?.balanceAfter ??
                result?.balance_after
            ) || (toNumber(balance) + totalCoins);

        return {
            status: formatPaymentStatus(result),
            transactionId: resolveTransactionId(result),
            dateTime: result?.transaction_time || result?.transactionTime || Date.now(),
            paymentMethod: selectedPaymentMethod?.display_name || "-",
            baseAmount: selectedPackage?.amount || 0,
            bonus: selectedPackage?.bonus || 0,
            newBalance: nextBalance,
        };
    };

    const openSuccessModal = (result) => {
        setSuccessModalData(buildSuccessModalData(result));
        setIsSuccessModalOpen(true);
    };

    const handlePaymentSuccess = async (result) => {
        const latestResult = await getLatestPaymentResult(result);
        openSuccessModal(latestResult);
    };

    const handlePaymentPending = async (result) => {
        await getLatestPaymentResult(result);
        onClose?.();
    };

    const handlePaymentError = async (result) => {
        await getLatestPaymentResult(result);
        alert("Gagal memproses pembayaran coin.");
    };

    const handleContinue = () => {
        if (isDisabled) return;
        setIsConfirmStep(true);
    };

    const handlePayNow = async () => {
        if (isSelectionInvalid || isPaying) return;

        const coinPackageId = selectedPackage?.id;
        const paymentMethod = selectedPaymentMethod?.midtrans_code || selectedPaymentMethodId;

        if (!coinPackageId || !paymentMethod) return;

        onContinue?.({
            package: selectedPackage,
            paymentMethod: selectedPaymentMethod,
            coinPackageId,
        });

        await payCoin(
            {
                coinPackageId,
                paymentMethod,
            },
            {
                onSuccess: handlePaymentSuccess,
                onPending: handlePaymentPending,
                onError: handlePaymentError,
            }
        );
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        onClose?.();
    };

    if (!isOpen && !isSuccessModalOpen) return null;

    return (
        <>
            {isOpen && !isSuccessModalOpen &&
                createPortal(
                    <div className="fixed inset-0 z-999 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:py-6">
                        <button
                            type="button"
                            aria-label="Close modal"
                            onClick={onClose}
                            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
                        />
                        <div className="relative z-10 my-auto flex max-h-[88vh] w-full max-w-180 flex-col overflow-hidden rounded-2xl border border-[#F5F5F51F] bg-[#222222] p-5 text-white shadow-2xl shadow-black/40 md:p-6">
                            <button
                                type="button"
                                aria-label="Close top up modal"
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                            >
                                <X size={18} />
                            </button>
                            {!isConfirmStep ? (
                                <>
                                    <div className="text-center">
                                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#F18A00]/20 ring-1 ring-[#F18A00]/30">
                                            <Image src={coinLogo} alt="GateCoin" width={24} height={24} />
                                        </div>
                                        <h2 className="montserratFont text-3xl font-bold">Top Up GateCoins</h2>
                                    </div>
                                    <div className="mt-8 flex-1 overflow-y-auto pr-1">
                                        <h3 className="montserratFont text-xl font-bold">Select Coin Package</h3>
                                        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                                            {resolvedPackages.map((item) => {
                                                const isSelected = item.id === selectedPackageId;
                                                return (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => setSelectedPackageId(item.id)}
                                                        className={`relative rounded-xl border px-4 py-3 text-center transition ${isSelected
                                                            ? "bg-linear-to-br from-[#FFCCA5]/15 via-[#F07F26]/15 to-[#FFCCA5]/15 border-[#F07F26]/50"
                                                            : "border-[#F5F5F526] bg-[#FFFFFF05] hover:bg-[#FFFFFF10]"
                                                            }`}
                                                    >
                                                        {item.isPopular && (
                                                            <span className="absolute -right-1 -top-2 rounded-full bg-linear-to-br from-[#FF6900] to-[#F0B100] px-2 py-0.5 text-[10px] font-semibold text-white">
                                                                Popular
                                                            </span>
                                                        )}
                                                        <div className="flex items-center justify-center gap-1.5 text-3xl font-bold leading-tight">
                                                            <Image src={coinLogo} alt="Coin" width={18} height={18} className="h-4.5 w-4.5" />
                                                            <span className="text-3xl zeinFont">{formatCoin(item.amount)}</span>
                                                        </div>
                                                        {item.bonus > 0 && (
                                                            <p className="mt-1 text-xs font-semibold text-[#05DF72]">
                                                                +{formatCoin(item.bonus)} Bonus
                                                            </p>
                                                        )}
                                                        <p className="text-base text-[#C6C6C6]">{formatRupiah(item.price)}</p>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-7 flex flex-col gap-4">
                                            <h3 className="montserratFont text-xl font-bold">Payment Method</h3>
                                            <PaymentMethodSelector
                                                selectedPaymentMethod={selectedPaymentMethodId}
                                                onMethodChange={setSelectedPaymentMethodId}
                                                basePrice={selectedPackage?.price || 0}
                                                variant="topup-modal"
                                                showHeader={false}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-[#F5F5F526] pt-4">
                                        <button
                                            type="button"
                                            onClick={handleContinue}
                                            disabled={isDisabled}
                                            className="w-full rounded-xl bg-[#1F80D8] px-4 py-4 text-lg font-semibold transition hover:bg-[#2373BD] disabled:cursor-not-allowed disabled:bg-[#1F80D8]/45"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4 text-center">
                                        <h2 className="montserratFont text-2xl font-bold">Confirm Payment</h2>
                                    </div>

                                    <div className="rounded-xl border border-[#F5F5F526] bg-[#1E293980] p-4 montserratFont">
                                        <div className="gap-2 flex flex-col text-sm text-[#C6C6C6]">
                                            <div className="flex items-center justify-between pb-2">
                                                <span>Package</span>
                                                <span className="flex items-center gap-1.5 text-base font-semibold text-white">
                                                    <Image src={coinLogo} alt="Coin" width={20} height={20} />
                                                    {formatCoin(selectedPackage?.amount || 0)} Coins <span className="font-semibold text-[#05DF72] text-xs">
                                                        +{formatCoin(selectedPackage?.bonus || 0)} Coins
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between pb-2">
                                                <span>Payment Amount</span>
                                                <span className="text-base font-semibold text-white">{formatRupiah(paymentAmount)}</span>
                                            </div>

                                            <hr />

                                            <div className="flex items-center justify-between">
                                                <span>Total Coins</span>
                                                <div className="flex flex-row gap-1 items-center">
                                                    <Image src={coinLogo} alt="Coin" width={20} height={20} />
                                                    <span className="text-lg font-bold text-[#F0B100]">{formatCoin(totalCoins)}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span>Discount</span>
                                                <span className="text-xs font-semibold text-red-600">-{formatRupiah(0)}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span>Transfer Fee</span>
                                                <span className="text-xs font-semibold text-[#979797]">{formatRupiah(transferFee)}</span>
                                            </div>

                                            <div className="flex items-center justify-between pb-2 border-b border-[#F5F5F526]">
                                                <span>System Fee</span>
                                                <span className="text-xs font-semibold text-[#979797]">{formatRupiah(systemFee)}</span>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-white">Total Payment</span>
                                                <span className="text-lg font-bold text-white">{formatRupiah(totalPayable)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-4 rounded-lg border border-[#2B7FFF4D] bg-[#1C398E33] p-4 text-center text-sm text-[#50A7F6]">
                                        Payment method: {selectedPaymentMethod?.display_name || "-"}
                                    </p>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsConfirmStep(false)}
                                            disabled={isPaying}
                                            className="rounded-lg bg-[#FFFFFF1A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#FFFFFF2A] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handlePayNow}
                                            disabled={isDisabled}
                                            className="rounded-lg bg-[#1F80D8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2373BD] disabled:cursor-not-allowed disabled:bg-[#1F80D8]/45"
                                        >
                                            {isPaying ? "Processing..." : "Pay Now"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>,
                    document.body
                )}

            <PaymentSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                status={successModalData.status}
                transactionId={successModalData.transactionId}
                dateTime={successModalData.dateTime}
                paymentMethod={successModalData.paymentMethod}
                baseAmount={successModalData.baseAmount}
                bonus={successModalData.bonus}
                newBalance={successModalData.newBalance}
            />
        </>
    );
}

TopUpGateCoinsModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    balance: PropTypes.number,
    packages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            price: PropTypes.number.isRequired,
            bonus: PropTypes.number,
            isPopular: PropTypes.bool,
        })
    ),
    defaultPackageId: PropTypes.string,
    defaultPaymentMethodId: PropTypes.string,
    onContinue: PropTypes.func,
};
