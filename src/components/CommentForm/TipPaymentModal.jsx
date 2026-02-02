import React from "react";
import PropTypes from "prop-types";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";
import PaymentSummary from "@/components/Payment/PaymentSummary";

export default function TipPaymentModal({
  isOpen,
  onClose,
  tipAmount,
  onConfirm,
  isLoading,
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState(null);

  const subtotal = Number(tipAmount) || 0;

  const handleConfirm = () => {
    if (!selectedPaymentMethod) {
      alert("❌ Silakan pilih metode pembayaran.");
      return;
    }
    onConfirm(selectedPaymentMethod);
  };

  const handleClose = () => {
    setSelectedPaymentMethod(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#515151] shadow-2xl shadow-black/80 w-[95%] md:w-auto md:min-w-2xl xl:min-w-3xl max-h-[90vh] overflow-y-auto text-xs md:text-[16px] rounded-lg montserratFont text-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#2222224D] hover:bg-[#333] transition text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        <div className="px-8 pt-4 pb-10 flex flex-col gap-8">
          <h1 className="zeinFont font-black text-xl md:text-3xl text-center">
            Konfirmasi Reward
          </h1>

          {/* Tip Amount Display */}
          <div className="flex flex-col gap-2 md:px-8">
            <div className="bg-[#2222224D] p-4 rounded-md">
              <p className="font-bold">Sawerkuy! Kasih reward biar kreator hepi</p>
            </div>
            <div className="text-center">
              <p className="text-lg md:text-2xl font-bold text-white">
                Rp {subtotal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Pemilihan metode pembayaran */}
          <div className="flex flex-col gap-2 md:px-8">
            <PaymentMethodSelector
              selectedPaymentMethod={selectedPaymentMethod}
              onMethodChange={setSelectedPaymentMethod}
              showError={!selectedPaymentMethod}
            />
          </div>
        </div>

        {/* Payment Summary */}
        <PaymentSummary
          price={subtotal}
          selectedTip={0}
          totalDiscount={0}
          selectedPaymentMethod={selectedPaymentMethod}
          title="Rincian"
        />

          <div className="flex gap-2 py-4 px-2">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg bg-[#686868] py-3 font-semibold hover:cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedPaymentMethod || isLoading}
              className={`flex-1 rounded-lg py-3 font-semibold ${selectedPaymentMethod && !isLoading
                  ? "bg-[#0076E9CC] hover:bg-[#005bb5] hover:cursor-pointer"
                  : "bg-[#686868] hover:cursor-not-allowed opacity-50"
                }`}
            >
              {isLoading ? "Processing..." : "Kirim Reward"}
            </button>
          </div>
        </div>
      </div>
  );
}

TipPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  tipAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onConfirm: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

TipPaymentModal.defaultProps = {
  tipAmount: 0,
  isLoading: false,
};
