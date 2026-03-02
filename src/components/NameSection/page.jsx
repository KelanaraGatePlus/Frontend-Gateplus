import React from "react";
import PropTypes from "prop-types";
import VerifiedCreatorBadge from "@/components/VerifiedCreatorBadge/page";

export default function NameSection({
  name,
  username,
  isVerified = false,
  showUsername = false,
  fallbackName = "Nama Profile Belum di atur",
  containerClassName = "w-full text-white",
  nameClassName = "zeinFont mt-2 text-[28px] font-semibold whitespace-normal wrap-break-word lg:text-3xl",
  usernameWrapperClassName = "mt-1 text-[12px] text-gray-300 lg:text-base",
  usernameClassName = "whitespace-normal break-all",
  badgeClassName = "ml-1",
  badgeIconClassName = "h-5 w-5",
  showTooltip = true,
  tooltipText = "Verified Creator",
  nameElement = "h1",
}) {
  const NameTag = nameElement;

  return (
    <div className={containerClassName}>
      <NameTag className={nameClassName}>
        {name || fallbackName}
        <VerifiedCreatorBadge
          isVerified={isVerified}
          className={badgeClassName}
          iconClassName={badgeIconClassName}
          showTooltip={showTooltip}
          tooltipText={tooltipText}
        />
      </NameTag>

      {showUsername && (
        <div className={usernameWrapperClassName}>
          <p className={usernameClassName}>@{username}</p>
        </div>
      )}
    </div>
  );
}

NameSection.propTypes = {
  name: PropTypes.string,
  username: PropTypes.string,
  isVerified: PropTypes.bool,
  showUsername: PropTypes.bool,
  fallbackName: PropTypes.string,
  containerClassName: PropTypes.string,
  nameClassName: PropTypes.string,
  usernameWrapperClassName: PropTypes.string,
  usernameClassName: PropTypes.string,
  badgeClassName: PropTypes.string,
  badgeIconClassName: PropTypes.string,
  showTooltip: PropTypes.bool,
  tooltipText: PropTypes.string,
  nameElement: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "p", "span"]),
};
