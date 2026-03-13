import React from "react";
import PropTypes from "prop-types";
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
    <div className={`flex flex-col gap-4 rounded-lg px-4 py-4`}>
        <CommentHeader
            user={user}
            isAuthor={isAuthor}
            createdAt={createdAt}
            isDark={isDark}
            message={message}
            donationAmount={donationAmount}
        />

        <CommentBody
            message={message}
            isDark={isDark}
            onReply={onReply}
            repliedToName={repliedToName}
            commentId={commentId}
            user={user}
            currentUserId={currentUserId}
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