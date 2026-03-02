import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import VerifiedCreatorIcon from "@@/AdditionalImages/verifiedCreator2.png";

export default function VerifiedCreatorBadge({
  isVerified,
  className = "",
  iconClassName = "h-5 w-5",
  showTooltip = true,
  tooltipText = "Verified Creator",
}) {
  if (!isVerified) return null;

  return (
    <span className={`relative inline-flex items-center align-middle group ${className}`}>
      <Image
        src={VerifiedCreatorIcon}
        alt="verified-creator"
        className={`inline-block ${iconClassName}`}
      />
      {showTooltip && (
        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {tooltipText}
        </span>
      )}
    </span>
  );
}

VerifiedCreatorBadge.propTypes = {
  isVerified: PropTypes.bool,
  className: PropTypes.string,
  iconClassName: PropTypes.string,
  showTooltip: PropTypes.bool,
  tooltipText: PropTypes.string,
};
