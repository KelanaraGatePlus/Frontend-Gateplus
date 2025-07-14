import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";

export default function ButtonSubmit({
    onClick,
    type = "button",
    icon,
    label,
    isLoading = false,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className="mt-1 flex w-full cursor-pointer justify-center gap-2 rounded-lg border border-[#F5F5F559] bg-[#0E5BA8] py-2 font-bold text-white lg:mt-8 lg:w-10/12 lg:self-end montserratFont"
        >
            {icon && (
                <span className="flex">
                    <Image
                        src={icon}
                        alt="icon-button"
                        width={16}
                        height={16}
                        className="aspect-auto"
                        priority
                    />
                </span>
            )}
            <p>{isLoading ? "Loading..." : label}</p>
        </button>
    );
}

ButtonSubmit.propTypes = {
    onClick: PropTypes.func,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    icon: PropTypes.any,
    label: PropTypes.string.isRequired,
    isLoading: PropTypes.bool,
};
