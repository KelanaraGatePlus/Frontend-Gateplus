import React from "react";
import PropTypes from "prop-types";
import { fee } from "@/lib/constants/fee";
import { countAdminFee } from "@/lib/constants/paymentMethod";

export default function PaymentSummary({
  price,
  selectedTip,
  totalDiscount,
  selectedPaymentMethod,
  title = "Rincian",
}) {
  const subtotal = Number(price) || 0;
  const tipAmount = Number(selectedTip) || 0;
  const discountAmount = Math.round(totalDiscount);
  const adminFee =
    subtotal - discountAmount + tipAmount === 0
      ? 0
      : countAdminFee(
          subtotal - discountAmount + tipAmount,
          selectedPaymentMethod
        );
  const serviceFee =
    subtotal - discountAmount + tipAmount === 0 ? 0 : fee.serviceFee;
  const total =
    subtotal - discountAmount + tipAmount + adminFee + serviceFee;

  return (
    <div className="bg-[#222222] p-8 flex flex-col gap-4">
      <h2 className="font-bold text-2xl">{title}</h2>
      <div className="flex flex-col gap-1">
        <div className="flex flex-row justify-between">
          <p>Harga konten</p>
          <p className="font-bold">
            Rp {subtotal.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Sawerin</p>
          <p className="font-bold">Rp {tipAmount.toLocaleString("id-ID")}</p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Voucher</p>
          <p className="font-bold text-red-600">
            - Rp {discountAmount.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex flex-row justify-between">
          <p>Biaya Transfer</p>
          <p className="font-bold">
            Rp {Math.round(adminFee).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex flex-row justify-between border-b border-white pb-2">
          <p>Biaya Layanan</p>
          <p className="font-bold">
            Rp {Math.round(serviceFee).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex flex-row justify-between border-white pb-2 text-xl">
          <p>Total</p>
          <p className="font-bold">
            Rp {Math.round(total).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}

PaymentSummary.propTypes = {
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  selectedTip: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalDiscount: PropTypes.number.isRequired,
  selectedPaymentMethod: PropTypes.string,
  title: PropTypes.string,
};

PaymentSummary.defaultProps = {
  selectedTip: 0,
  selectedPaymentMethod: null,
  title: "Rincian",
};
