import React from "react";
import PropTypes from "prop-types";
import DonationLabel from "../CommentForm/DonationLabel";
import { CommentBody } from "./CommentBody";
import { CommentHeader } from "./CommentHeader";

export const CommentItem = ({
    user,
    isAuthor,
    createdAt,
    donationAmount,
    isDark,
    message,
    onReply,
    repliedToName,
    isIndented = false,
}) => (
    <div className={`flex flex-col gap-4 rounded-lg bg-transparent py-4 ${isIndented ? "ml-8" : ""}`}>
        <CommentHeader
            user={user}
            isAuthor={isAuthor}
            createdAt={createdAt}
            isDark={isDark}
        />

        {donationAmount && (
            <DonationLabel label={donationAmount} />
        )}

        <CommentBody
            message={message}
            isDark={isDark}
            onReply={onReply}
            repliedToName={repliedToName}
        />
    </div>
);

CommentItem.propTypes = {
    user: PropTypes.shape({
        profileName: PropTypes.string,
        username: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
    }).isRequired,
    isAuthor: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
    donationAmount: PropTypes.number,
    isDark: PropTypes.bool,
    message: PropTypes.string.isRequired,
    onReply: PropTypes.func,
    repliedToName: PropTypes.string,
    isIndented: PropTypes.bool,
};
