import React from "react";
import PropTypes from "prop-types";
import { paymentMethods } from "@/lib/constants/paymentMethod";

export default function PaymentMethodSelector({
  selectedPaymentMethod,
  onMethodChange,
  showError = false,
}) {
  return (
    <div className="flex flex-col gap-2 md:px-8">
      <div className="bg-[#2222224D] p-4 rounded-md">
        <p className="font-bold">Pilih Metode Pembayaran</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {Object.entries(paymentMethods)
          .filter(([, method]) => method.isActive)
          .map(([key, method]) => {
            const isSelected = selectedPaymentMethod === key;
            return (
              <button
                key={method.midtrans_code}
                onClick={() =>
                  onMethodChange(prev => (prev === key ? null : key))
                }
                className={`md:py-4 px-2 py-2 flex flex-row items-center gap-2 md:px-4 drop-shadow-md drop-shadow-[#00000040] rounded-md font-semibold transition hover:cursor-pointer ${isSelected
                    ? "bg-[#0075e9]"
                    : "bg-[#686868] hover:bg-[#686868]"
                  }`}
              >
                <div className="w-10 h-8 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
                  <img
                    src={method.logo ? method.logo.src : ""}
                    alt={method.display_name}
                    className="w-10 h-8 md:h-12 md:w-12 object-contain"
                  />
                </div>
                <span className="h-8 flex items-center text-xs md:text-sm whitespace-nowrap">
                  {method.display_name}
                </span>
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
};
