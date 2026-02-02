import React from "react";
import PropTypes from "prop-types";

export default function TipSelector({ selectedTip, onTipChange, tipOptions = [5000, 10000, 15000, 20000] }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="bg-[#2222224D] p-4 rounded-md">
        <p>
          <b>Sawerkuy!</b> kasih tip biar kreator hepi
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {tipOptions.map((amount) => {
          const isSelected = selectedTip === amount;
          return (
            <button
              key={amount}
              onClick={() => onTipChange(prev => (prev === amount ? null : amount))}
              className={`py-4 rounded-md font-semibold transition hover:cursor-pointer ${
                isSelected
                  ? "bg-[#1A207480]"
                  : "bg-[#0075E9C4] hover:bg-[#0075e9]"
              }`}
            >
              Rp {amount.toLocaleString("id-ID")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

TipSelector.propTypes = {
  selectedTip: PropTypes.number,
  onTipChange: PropTypes.func.isRequired,
  tipOptions: PropTypes.arrayOf(PropTypes.number),
};
