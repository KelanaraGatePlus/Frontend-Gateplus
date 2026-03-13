import React from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "@/lib/timeFormatter";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import DonationLabel from "../CommentForm/DonationLabel";

export const CommentHeader = ({
    user,
    isAuthor,
    createdAt,
    isDark,
    message,
    donationAmount
}) => {

    return (
        <div className="flex flex-row items-center justify-between">
            <div className="grid grid-cols-[28px_1fr] gap-2">
                <figure className="h-7 w-7">
                    <Image
                        priority
                        className="h-full w-full rounded-full object-cover"
                        src={user.imageUrl || DEFAULT_AVATAR}
                        alt="logo-usercomment"
                        width={40}
                        height={40}
                    />
                </figure>

                <div>
                    <h5 className={`text-xs font-medium ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                        {user.profileName || user.username} {isAuthor && "(Author)"}
                    </h5>
                    <p className={`text-[10px] ${isDark ? "text-white/50" : "text-[#1A1A1A]/50"}`}>
                        {formatDateTime(createdAt)}
                    </p>

                    <div>{message}</div>
                </div>
            </div>

            {donationAmount && (
                <DonationLabel label={donationAmount} />
            )}
        </div>
    );
};

CommentHeader.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        profileName: PropTypes.string,
        username: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
    }).isRequired,
    isAuthor: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
    isDark: PropTypes.bool,
    message: PropTypes.string.isRequired,
    donationAmount: PropTypes.number,
};
