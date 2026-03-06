import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { countAdminFee, paymentMethods } from "@/lib/constants/paymentMethod";

export default function PaymentMethodSelector({
  selectedPaymentMethod,
  onMethodChange,
  showError = false,
  basePrice = 0,
  variant = "default",
  showHeader = true,
}) {
  const activePaymentMethods = Object.entries(paymentMethods)
    .filter(([, method]) => method.isActive)
    .map(([key, method], index) => ({
      key,
      method,
      fee: countAdminFee(basePrice, method.midtrans_code),
      index,
    }));

  const sortedPaymentMethods = [...activePaymentMethods].sort((a, b) => {
    if (a.fee !== b.fee) return a.fee - b.fee;
    return a.index - b.index;
  });

  const cheapestMethodKey = sortedPaymentMethods[0]?.key || null;
  const topThreeCheapestKeys = new Set(
    sortedPaymentMethods.slice(0, 3).map((item) => item.key)
  );

  const prioritizedPaymentMethods = [
    ...sortedPaymentMethods.slice(0, 3),
    ...activePaymentMethods.filter((item) => !topThreeCheapestKeys.has(item.key)),
  ];

  const isTopUpModalVariant = variant === "topup-modal";

  // Auto-select the cheapest method on mount or when basePrice changes
  useEffect(() => {
    if (!selectedPaymentMethod && cheapestMethodKey) {
      onMethodChange(() => cheapestMethodKey);
    }
  }, [basePrice, cheapestMethodKey, selectedPaymentMethod, onMethodChange]);

  return (
    <div className={`flex flex-col gap-2 ${isTopUpModalVariant ? "" : "md:px-8"}`}>
      {showHeader && (
        <div className="bg-[#2222224D] p-4 rounded-md">
          <p className="font-bold">Pilih Metode Pembayaran</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {prioritizedPaymentMethods
          .map(({ key, method, fee }) => {
            const isSelected = selectedPaymentMethod === key;
            const isCheapest = key === cheapestMethodKey;
            return (
              <button
                key={method.midtrans_code}
                onClick={() =>
                  onMethodChange(prev => (prev === key ? null : key))
                }
                className={`flex relative flex-row items-center gap-2 font-semibold transition hover:cursor-pointer ${isTopUpModalVariant
                  ? `${isSelected
                    ? "border-[#2B8CF4] bg-[#1F6DB8]"
                    : "border-[#F5F5F526] bg-linear-to-br from-[#2A2A2ACC] to-[#1F1F1FCC] hover:bg-[#FFFFFF10]"
                  } rounded-xl border px-4 py-3`
                  : `${isSelected
                    ? "bg-[#0075e9]"
                    : "bg-[#686868] hover:bg-[#686868]"
                  } md:py-4 px-2 py-2 md:px-4 drop-shadow-md drop-shadow-[#00000040] rounded-md`
                  }`}
              >
                {isCheapest && (
                  <div className="bg-[#1FC16B] rounded-xl absolute w-max h-max px-2 py-1 -top-3 right-5">
                    Termurah
                  </div>
                )}
                <div className="w-10 h-8 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                  <img
                    src={method.logo ? method.logo.src : ""}
                    alt={method.display_name}
                    className="w-10 h-8 md:h-12 md:w-12 object-contain"
                  />
                </div>
                <span className="h-8 flex items-center text-xs md:text-sm whitespace-nowrap">
                  {method.display_name}
                </span>
                <div className="flex flex-col items-end gap-1 text-xs w-full">
                  <p className="text-[#C6C6C6]">Biaya Admin</p>
                  <p>+{fee}</p>
                </div>
              </button>
            );
          })}
      </div>
      {showError && !selectedPaymentMethod && (
        <p className="text-red-600 text-xs md:text-sm font-semibold">
          Pilih metode pembayaran terlebih dahulu
        </p>
      )}
    </div>
  );
}

PaymentMethodSelector.propTypes = {
  selectedPaymentMethod: PropTypes.string,
  onMethodChange: PropTypes.func.isRequired,
  showError: PropTypes.bool,
  basePrice: PropTypes.number,
  variant: PropTypes.oneOf(["default", "topup-modal"]),
  showHeader: PropTypes.bool,
};
