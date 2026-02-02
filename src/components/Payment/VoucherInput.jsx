import React from "react";
import PropTypes from "prop-types";
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function VoucherInput({
  voucherCode,
  onVoucherChange,
  onApplyVoucher,
  isLoading,
  error,
  isSuccess,
}) {
  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      {
        <div className="flex md:flex-row flex-col bg-[#DEDEDE4D] md:rounded-l-full rounded-lg md:rounded-r-lg overflow-hidden">
          <button
            disabled={!voucherCode}
            onClick={() => onApplyVoucher(voucherCode)}
            className="px-6 md:px-12 py-3 bg-[#0075e9c4] md:rounded-full font-semibold whitespace-nowrap hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gunakan Voucher
          </button>
          <input
            type="text"
            className="flex-1 text-center placeholder:text-center px-2 py-3 outline-none"
            placeholder="Gunakan / Masukan Kode Voucher"
            value={voucherCode}
            onChange={(e) => onVoucherChange(e.target.value)}
          />
        </div>
      }
      <div className="flex items-center">
        {isLoading && <LoadingOverlay />}
        {error && <p className="text-red-500">{error.data?.message}</p>}
        {isSuccess && <p className="text-green-500">Voucher applied successfully!</p>}
      </div>
    </div>
  );
}

VoucherInput.propTypes = {
  voucherCode: PropTypes.string.isRequired,
  onVoucherChange: PropTypes.func.isRequired,
  onApplyVoucher: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  isSuccess: PropTypes.bool,
};

VoucherInput.defaultProps = {
  isLoading: false,
  error: null,
  isSuccess: false,
};
