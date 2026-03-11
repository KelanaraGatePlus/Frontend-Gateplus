"use client";

import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CircleAlert, Ticket, X } from "lucide-react";

const sampleAvailableVouchers = [
  {
    id: "welcome-bonus",
    title: "Welcome Bonus",
    meta: "1,000 Coins",
    description: "Get 1,000 free coins for new users",
    code: "WELCOME2024",
    validUntil: "31 Dec 2026",
  },
  {
    id: "creator-boost",
    title: "Creator Boost",
    meta: "+50% Earnings",
    description: "Get 1,000 free coins for new users",
    code: "CREATOR50",
    validUntil: "15 Mar 2026",
  },
  {
    id: "premium-trial",
    title: "Premium Trial",
    meta: "7 Days Premium",
    description: "7 days premium features access",
    code: "PREMIUM7DAY",
    validUntil: "28 Feb 2026",
  },
  {
    id: "new-year-gift",
    title: "New Year Gift",
    meta: "500 Coins",
    description: "Special new year celebration bonus",
    code: "NEWYEAR500",
    validUntil: "10 Jan 2026",
  },
];

function VoucherCard({ voucher, actionLabel, onAction, actionDisabled }) {
  return (
    <article className="rounded-xl border border-white/10 bg-gradient-to-b from-[#222222] to-[#1F1F1F] p-3 text-white md:p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h4 className="montserratFont text-sm font-bold md:text-[15px]">{voucher.title}</h4>
          <p className="montserratFont mt-0.5 text-[11px] text-[#A3AAB6] md:text-xs">{voucher.meta}</p>
        </div>
        <Ticket className="h-4 w-4 shrink-0 text-[#D6DBE5]" />
      </div>

      <p className="montserratFont mb-3 text-xs text-[#E7E9EE] md:text-[13px]">{voucher.description}</p>

      <div className="mb-2 flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1.5 md:px-3 md:py-2">
        <div className="min-w-0 flex-1">
          <p className="montserratFont text-[10px] uppercase tracking-wide text-[#8E96A5]">Voucher Code</p>
          <p className="montserratFont truncate text-[11px] font-semibold tracking-[0.09em] text-[#EDF2FF] md:text-xs">
            {voucher.code}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onAction(voucher)}
          disabled={actionDisabled}
          className="montserratFont rounded-md border border-[#58A6FF66] bg-[#1F4F7A] px-3 py-1.5 text-[11px] font-semibold text-[#DFF0FF] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLabel}
        </button>
      </div>

      <div className="flex items-center gap-1 text-[10px] text-[#8A93A2] md:text-[11px]">
        <CircleAlert className="h-3.5 w-3.5" />
        <p className="montserratFont">Valid until {voucher.validUntil}</p>
      </div>
    </article>
  );
}

VoucherCard.propTypes = {
  voucher: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    meta: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    validUntil: PropTypes.string.isRequired,
  }).isRequired,
  actionLabel: PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
  actionDisabled: PropTypes.bool,
};

VoucherCard.defaultProps = {
  actionDisabled: false,
};

function mapApiVoucherToCard(apiVoucher) {
  if (!apiVoucher) return null;
  
  const formatDate = (dateString) => {
    if (!dateString) return "Tidak terbatas";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return {
    id: apiVoucher.id || apiVoucher.code,
    title: apiVoucher.name || apiVoucher.code,
    meta: `${apiVoucher.type === "FIXED" ? "Rp." : "%"} ${apiVoucher.value}`,
    description: apiVoucher.description || `Diskon untuk transaksi Anda`,
    code: apiVoucher.code,
    validUntil: formatDate(apiVoucher.endDate),
  };
}

export default function VoucherHubModal({
  isOpen,
  onClose,
  availableVouchers,
  redeemedVouchers,
  coinBalance,
  onUseVoucher,
}) {
  const [activeTab, setActiveTab] = useState("available");

  const mappedAvailableVouchers = useMemo(() => {
    if (!Array.isArray(availableVouchers)) return sampleAvailableVouchers;
    return availableVouchers.map(mapApiVoucherToCard).filter(Boolean);
  }, [availableVouchers]);

  const safeAvailableVouchers = mappedAvailableVouchers.length > 0 ? mappedAvailableVouchers : sampleAvailableVouchers;
  const safeRedeemedVouchers = Array.isArray(redeemedVouchers)
    ? redeemedVouchers
    : [];
  const handleVoucherAction = typeof onUseVoucher === "function" ? onUseVoucher : () => {};

  const visibleVouchers = useMemo(() => {
    return activeTab === "available" ? safeAvailableVouchers : safeRedeemedVouchers || [];
  }, [activeTab, safeAvailableVouchers, safeRedeemedVouchers]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[black/70] p-3 backdrop-blur-[2px] md:p-4">
      <div className="relative w-full max-w-[560px] rounded-2xl border border-white/10 bg-[#222222] p-4 text-white shadow-[0_22px_70px_-22px_rgba(0,0,0,0.95)] md:p-5">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-md p-1 text-[#A9B1BF] transition hover:bg-white/10 hover:text-white"
          aria-label="Close voucher hub"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mt-2 flex flex-col items-center text-center">
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-[#A026F733] ring-1 ring-[#A026F766]">
            <Ticket className="h-5 w-5 text-[#D6A7FF]" />
          </div>

          <h2 className="montserratFont text-2xl font-bold">Voucher Hub</h2>
          <p className="montserratFont mt-1 text-xs text-[#8D95A3]">Use Voucher to Save on Your Transactions</p>

          <div className="montserratFont mt-3 inline-flex items-center gap-1 rounded-full bg-[#2A2F38] px-3 py-1 text-sm font-semibold text-[#F3F7FF]">
            <span className="inline-block h-3.5 w-3.5 rounded-full bg-[#F3B63F] text-[10px] leading-[14px] text-[#282204]">
              G
            </span>
            {coinBalance} Coins
          </div>
        </div>

        <div className="mt-5 border-b border-white/10">
          <div className="grid grid-cols-2">
            <button
              type="button"
              onClick={() => setActiveTab("available")}
              className={`montserratFont relative pb-2 text-sm transition ${
                activeTab === "available" ? "text-[#2EB4FF]" : "text-[#B1B8C4]"
              }`}
            >
              Available ({safeAvailableVouchers.length})
              {activeTab === "available" && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#2EB4FF]" />}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("redeemed")}
              className={`montserratFont relative pb-2 text-sm transition ${
                activeTab === "redeemed" ? "text-[#2EB4FF]" : "text-[#B1B8C4]"
              }`}
            >
              Redeemed ({safeRedeemedVouchers.length})
              {activeTab === "redeemed" && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#2EB4FF]" />}
            </button>
          </div>
        </div>

        <div className="custom-scrollbar mt-4 max-h-[56vh] space-y-2.5 overflow-y-auto pr-1">
          {visibleVouchers.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-6 text-center">
              <p className="montserratFont text-sm text-[#9FA8B8]">No vouchers in this tab yet.</p>
            </div>
          )}

          {visibleVouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
              actionLabel={activeTab === "available" ? "Use Code" : "Used"}
              actionDisabled={activeTab === "redeemed"}
              onAction={handleVoucherAction}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

VoucherHubModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  availableVouchers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      meta: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      validUntil: PropTypes.string.isRequired,
    }),
  ),
  redeemedVouchers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      meta: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      validUntil: PropTypes.string.isRequired,
    }),
  ),
  coinBalance: PropTypes.number,
  onUseVoucher: PropTypes.func,
};

VoucherHubModal.defaultProps = {
  isOpen: false,
  onClose: () => {},
  availableVouchers: sampleAvailableVouchers,
  redeemedVouchers: [],
  coinBalance: 50,
  onUseVoucher: () => {},
};
