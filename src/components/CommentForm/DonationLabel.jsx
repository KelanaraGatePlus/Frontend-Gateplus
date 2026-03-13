import React from "react";
// import { Icon } from "@iconify/react";
import PropTypes from "prop-types";
import { Coins } from "lucide-react";

export default function DonationLabel({ label }) {
    // Determine colors based on donation amount
    // const getColors = (amount) => {
    //     if (amount >= 100000) {
    //         return {
    //             borderColor: '#F07F26',
    //             iconColor: '#F07F26',
    //             bgFrom: '#F07F26',
    //             bgTo: '#FFD8BA'
    //         };
    //     } else if (amount >= 50000) {
    //         return {
    //             borderColor: '#5856D6',
    //             iconColor: '#5856D6',
    //             bgFrom: '#5856D6',
    //             bgTo: '#B4B3FF'
    //         };
    //     } else if (amount >= 15000) {
    //         return {
    //             borderColor: '#AF52DE',
    //             iconColor: '#AF52DE',
    //             bgFrom: '#AF52DE',
    //             bgTo: '#EDC8FF'
    //         };
    //     } else {
    //         return {
    //             borderColor: '#156EB7',
    //             iconColor: '#156EB7',
    //             bgFrom: '#156EB7',
    //             bgTo: '#96D0FF'
    //         };
    //     }
    // };

    // const colors = getColors(label);

    return (
        <div
            className={`rounded-full flex text-xs items-center justify-center bg-[#F07F261A] border-2 px-3 py-1 border-[#C9610E] text-[#F07F26] w-max gap-1`}
        >
            <Coins
                size={12}
            />
            <p>
                Rp {label.toLocaleString("id-ID")}
            </p>
        </div>
    )
}

DonationLabel.propTypes = {
    label: PropTypes.number.isRequired,
};