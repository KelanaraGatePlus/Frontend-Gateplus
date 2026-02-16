import React from "react";
import PropTypes from "prop-types";
import DonationLabel from "../CommentForm/DonationLabel";
import { CommentBody } from "./CommentBody";
import { CommentHeader } from "./CommentHeader";

export const CommentItem = ({
    commentId,
    user,
    isAuthor,
    createdAt,
    donationAmount,
    isDark,
    message,
    onReply,
    repliedToName,
    isIndented = false,
    currentUserId, // ⬅️ TAMBAHKAN
}) => (
    <div className={`flex flex-col gap-4 rounded-lg bg-transparent py-4 ${isIndented ? "ml-8" : ""}`}>
        <CommentHeader
            user={user}
            isAuthor={isAuthor}
            createdAt={createdAt}
            isDark={isDark}
            commentId={commentId}
            message={message}
            onReply={onReply}
            currentUserId={currentUserId} // ⬅️ TAMBAHKAN
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
    commentId: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string.isRequired, // ⬅️ PASTIKAN ADA
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
    currentUserId: PropTypes.string, // ⬅️ TAMBAHKAN
};