"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { Coins, ReceiptText, XIcon } from "lucide-react";
import { FaFunnelDollar } from "react-icons/fa";
import { Icon } from "@iconify/react";
import { useAuth } from "../Context/AuthContext";
import { usePaymentHistoryQuery } from "@/hooks/api/paymentSliceAPI";
import { useDisplayPayment } from "@/hooks/api/paymentAPI";


function formatRupiah(value) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(Number(value) || 0)}`;
}

function formatCoin(value) {
  return new Intl.NumberFormat("id-ID").format(Number(value) || 0);
}

function pickFirstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "") ?? null;
}

function TopupCard({ id, coinAmount, bonusAmount, amountPaid, paymentMethod, createdAt, status, onContinuePayment }) {
  const normalizedStatus = String(status || "").toUpperCase();
  const cardBorderClass = normalizedStatus === "PENDING" ? "border border-[#F7C32B]" : "border border-transparent";
  const statusBadgeClass =
    normalizedStatus === "SUCCESS"
      ? "border-[#00C9504D] text-[#05DF72] bg-[#00C95033]"
      : normalizedStatus === "PENDING"
        ? "border-[#B8B8B84D] text-[#CFCFCF] bg-[#9A9A9A33]"
        : "border-[#FB2C364D] text-[#FF6467] bg-[#FB2C3633]";

  return (
    <article key={id} className={`${cardBorderClass} rounded-lg bg-[#3C3C3F] p-3 md:p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-start gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-[#00C9504D] bg-[#00C95033] text-[#05DF72]">
              <Coins className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-row items-center gap-2">
                <p className="montserratFont truncate text-lg font-bold leading-none text-white">
                  {formatCoin(coinAmount)} Coins
                </p>
                {bonusAmount > 0 && (
                  <span className="rounded bg-[#70461B] px-1.5 py-0.5 text-xs font-semibold text-[#FF9F2A]">
                    +{formatCoin(bonusAmount)} Bonus
                  </span>
                )}
              </div>
              <p className="montserratFont mt-1 text-xs text-white/75">{paymentMethod}</p>
              <p className="montserratFont mt-0.5 truncate text-[11px] text-white/40">
                {new Date(createdAt).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {` · ${id}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-2">
          <p className="montserratFont shrink-0 text-lg font-bold text-white">
            {formatRupiah(amountPaid)}
          </p>
          {normalizedStatus === "PENDING" && typeof onContinuePayment === "function" && (
            <button
              type="button"
              onClick={onContinuePayment}
              className="montserratFont w-max rounded-full border border-[#F7C32B] bg-[#F7C32B1A] px-3 py-1 text-xs font-semibold text-[#F7C32B] transition hover:bg-[#F7C32B26]"
            >
              Continue Payment
            </button>
          )}
          {normalizedStatus !== "PENDING" && (
            <div className={`${statusBadgeClass} text-xs items-center flex flex-row gap-0.5 w-max border rounded-full px-3 py-1`}>
              <Icon
                icon={'prime:check-circle'}
                width={14}
                height={14}
              />
              {status}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function SpendingCard({ spendingPurpose, totalSpending, paymentMethod, createdAt, id }) {
  return (
    <article key={id} className="rounded-lg bg-[#3C3C3F] p-3 md:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-start gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl border border-[#FB2C364D] bg-[#FB2C3633] text-[#FF6467]">
              <Coins className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-row items-center gap-2">
                <p className="montserratFont truncate text-lg font-bold leading-none text-white">
                  {spendingPurpose}
                </p>
              </div>
              <p className="montserratFont mt-1 text-xs text-white/75">{paymentMethod}</p>
              <p className="montserratFont mt-0.5 truncate text-[11px] text-white/40">
                {new Date(createdAt).toLocaleString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {` · ${id}`}
              </p>
            </div>
          </div>
        </div>
        <p className="montserratFont shrink-0 text-lg font-bold text-[#FDC700]">
          {paymentMethod === "COIN" || paymentMethod === "FREE" ? `-${totalSpending}` : formatRupiah(totalSpending)}
        </p>
      </div>
    </article>
  )
}

function resolveFilterType(type) {
  if (type === "TOP_UP") return "TOP_UP";
  if (type === "SPENDING") return "SPENDING";
  return "ALL";
}

function normalizeTransaction(item, index) {
  if (!item) return null;

  const type = item.type === "SPENDING" || item.mode === "spending" ? "SPENDING" : "TOP_UP";
  const coinAmount = Number(item.coinAmount ?? item.coinPackage?.coin ?? item.coins ?? 0) || 0;
  const bonusAmount = Number(item.bonusAmount ?? item.bonus ?? 0) || 0;
  const amountPaid = Number(item.amountPaid ?? item.amount ?? item.paidAmount ?? item.totalPrice ?? item.price ?? 0) || 0;

  return {
    id: String(item.id ?? item.transactionId ?? item.orderId ?? `purchase-${index}`),
    type,
    status: item.status,
    orderId: String(item.orderId ?? item.id ?? `purchase-${index}`),
    coinAmount,
    bonusAmount,
    paymentMethod: item.paymentMethod ?? item.paymentType ?? item.methodName ?? item.method ?? "-",
    paymentLabel: item.paymentLabel ?? (type === "SPENDING" ? "Spending" : "Top Up"),
    amountPaid,
    createdAt: item.createdAt ?? item.transactionTime ?? new Date().toISOString(),
    spendingPurpose: item.spendingPurpose ?? item.contentTitle ?? item.paymentLabel,
    snapToken: pickFirstValue(item.snapToken, item.token, item.snap_token, item?.snap?.token),
    snapUrl: pickFirstValue(item.snapUrl, item.redirectUrl, item.redirect_url, item?.actions?.[0]?.url),
    qrisImageUrl: pickFirstValue(item.qrisImageUrl, item.qrisUrl, item.qrCodeUrl, item.qrUrl),
    provider: item.provider ?? "midtrans",
  };
}

function FilterChip({ isActive, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`montserratFont rounded-full px-3 py-1 text-[11px] font-semibold transition ${isActive ? "bg-[#2D7BFF] text-white" : "bg-white/10 text-white/70 hover:bg-white/15"
        }`}
    >
      {children}
    </button>
  );
}

FilterChip.propTypes = {
  isActive: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

FilterChip.defaultProps = {
  isActive: false,
};

export default function PurchaseHistoryModal({ isOpen, onClose, transactions }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { user } = useAuth();
  const { display } = useDisplayPayment();

  const { data: paymentHistoryData, isLoading, isFetching, refetch } = usePaymentHistoryQuery(
    { page: 1, limit: 10 },
    { skip: !isOpen || !user?.token },
  );

  const handleContinuePayment = async (transaction) => {
    const snapToken = transaction?.snapToken;
    const snapUrl = transaction?.snapUrl;
    const qrisImageUrl = transaction?.qrisImageUrl;
    const normalizedMethod = String(transaction?.paymentMethod || "").toLowerCase();

    if (!snapToken && !snapUrl && !(normalizedMethod === "qris" && qrisImageUrl)) {
      window.alert("Payment session tidak tersedia untuk transaksi ini.");
      return;
    }

    try {
      await display(
        {
          snapToken,
          snapUrl,
          orderId: transaction?.orderId || transaction?.id || null,
          provider: transaction?.provider || "midtrans",
          paymentMethod: normalizedMethod || null,
          qrisImageUrl,
        },
        {
          onSuccess: async () => {
            await refetch();
          },
          onPending: async () => {
            await refetch();
          },
          onError: async () => {
            await refetch();
          },
          onClose: async () => {
            await refetch();
          },
        },
      );
    } catch (error) {
      console.error("Failed to continue payment:", error);
      window.alert("Gagal melanjutkan pembayaran.");
    }
  };

  const normalizedTransactions = useMemo(() => {
    const fallbackTransactions = Array.isArray(transactions) ? transactions : [];
    const apiTransactions = paymentHistoryData?.data?.all?.items ?? paymentHistoryData?.data?.items ?? [];
    const source = apiTransactions.length > 0 ? apiTransactions : fallbackTransactions;

    return source.map(normalizeTransaction).filter(Boolean);
  }, [transactions, paymentHistoryData]);

  const filteredTransactions = useMemo(() => {
    if (activeFilter === "ALL") return normalizedTransactions;
    return normalizedTransactions.filter((item) => resolveFilterType(item.type) === activeFilter);
  }, [activeFilter, normalizedTransactions]);

  const summary = useMemo(() => {
    const totalSpent = normalizedTransactions.reduce((sum, item) => sum + (item.amountPaid || 0), 0);
    const totalCoinsPurchased = normalizedTransactions
      .filter((item) => item.type === "TOP_UP")
      .reduce((sum, item) => sum + (item.coinAmount || 0) + (item.bonusAmount || 0), 0);

    return {
      totalSpent,
      totalCoinsPurchased,
      transactionCount: normalizedTransactions.length,
    };
  }, [normalizedTransactions]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-3 md:p-4 montserratFont">
      <button
        type="button"
        aria-label="Close purchase history modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
      />

      <div className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-[14px] border border-white/10 bg-[#2B2B2B] text-white shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
        <div className="bg-gradient-to-r from-[#F5490033] to-[#D0870033] px-4 pb-4 pt-3 md:px-5">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-md p-1 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>

          <div className="mb-3 flex items-stretch gap-2">
            <div className="grid w-10 aspect-square shrink-0 place-items-center self-stretch rounded-md border border-[#FF69004D] bg-gradient-to-br from-[#FF690033] to-[#F0B10033]">
              <ReceiptText className="h-6 w-6 text-[#FFD89A]" />
            </div>
            <div className="flex flex-col justify-between">
              <h2 className="montserratFont text-2xl leading-none font-bold">Purchase History</h2>
              <p className="montserratFont mt-1 text-xs text-white/65">{summary.transactionCount} transactions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[#393939] bg-[#1E293980] px-4 py-3">
              <p className="montserratFont text-xs text-white/65">Total Coins Spent</p>
              <p className="montserratFont mt-1 text-2xl leading-none font-bold text-[#FF9A00]">
                {formatCoin(paymentHistoryData?.data?.totalSpent) || 0}
              </p>
            </div>

            <div className="rounded-lg border border-[#393939] bg-[#1E293980] px-4 py-3">
              <p className="montserratFont text-xs text-white/65">Total Coins Purchased</p>
              <p className="montserratFont mt-1 text-2xl leading-none font-bold text-[#F7C32B]">
                {formatCoin(paymentHistoryData?.data?.totalCoinsPurchased) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#222222] to-[#393939] mb-2">
          <div className="mb-3 flex items-center gap-2 border-b border-[#393939] p-4">
            <FaFunnelDollar className="h-3.5 w-3.5 text-white/65" />
            <p className="montserratFont text-xs text-white/70">Filter:</p>
            <FilterChip isActive={activeFilter === "ALL"} onClick={() => setActiveFilter("ALL")}>All</FilterChip>
            <FilterChip isActive={activeFilter === "TOP_UP"} onClick={() => setActiveFilter("TOP_UP")}>Top Up</FilterChip>
            <FilterChip isActive={activeFilter === "SPENDING"} onClick={() => setActiveFilter("SPENDING")}>Spending</FilterChip>
          </div>
          <div className="px-4 md:px-5">
            <div className="custom-scrollbar max-h-[50vh] space-y-2.5 overflow-y-auto pr-1">
              {filteredTransactions.length === 0 && (
                <div className="rounded-lg border border-dashed border-white/20 bg-black/10 p-6 text-center">
                  <p className="montserratFont text-sm text-white/70">
                    {isLoading || isFetching ? "Loading transaction history..." : "No transaction found."}
                  </p>
                </div>
              )}
              {filteredTransactions.map((item) => {
                if (item.type === "SPENDING") {
                  return (
                    <SpendingCard
                      key={item.id}
                      id={item.id}
                      spendingPurpose={item.spendingPurpose || "Spending"}
                      totalSpending={item.amountPaid}
                      paymentMethod={item.paymentMethod}
                      createdAt={item.createdAt}
                    />
                  );
                }

                return (
                  <TopupCard
                    key={item.id}
                    id={item.id}
                    coinAmount={item.coinAmount}
                    bonusAmount={item.bonusAmount}
                    amountPaid={item.amountPaid}
                    paymentMethod={item.paymentMethod}
                    createdAt={item.createdAt}
                    status={item.status}
                    onContinuePayment={() => handleContinuePayment(item)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}




PurchaseHistoryModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      type: PropTypes.oneOf(["TOP_UP", "SPENDING"]),
      coinAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      bonusAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      paymentMethod: PropTypes.string,
      paymentLabel: PropTypes.string,
      amountPaid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      createdAt: PropTypes.string,
      spendingPurpose: PropTypes.string,
      status: PropTypes.string,
      orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      snapToken: PropTypes.string,
      snapUrl: PropTypes.string,
      qrisImageUrl: PropTypes.string,
      provider: PropTypes.string,
    }),
  ),
};

PurchaseHistoryModal.defaultProps = {
  isOpen: false,
  onClose: () => { },
  transactions: [],
};


