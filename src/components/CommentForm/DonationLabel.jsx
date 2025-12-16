import React from "react";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

export default function DonationLabel({ label }) {
    return (
        <div className="rounded-full flex items-center bg-gradient-to-b from-[#156EB7]/30 to-[#96D0FF]/30 justify-center border-2 border-[#175BA6] px-3 py-1 text-white w-max">
            <Icon icon={"solar:crown-bold-duotone"} className="text-[#F07F26] w-5 h-5 mr-1" />
            <p>
                Rp {label.toLocaleString("id-ID")}
            </p>
        </div>
    )
}

DonationLabel.propTypes = {
    label: PropTypes.number.isRequired,
};