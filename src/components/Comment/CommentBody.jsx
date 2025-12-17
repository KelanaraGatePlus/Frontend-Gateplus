import React from "react";
import PropTypes from "prop-types";
export const CommentBody = ({ message, isDark, onReply, repliedToName }) => {
    const messageColor = repliedToName ? "text-[#979797]" : (isDark ? "text-white" : "text-[#1A1A1A]");

    return (
        <div className={`flex flex-col p-2 rounded-md gap-4 ${isDark ? "bg-[#515151] text-white" : "bg-[#C6C6C6] text-[#1A1A1A]"}`}>
            {repliedToName && (
                <p className={`text-xs ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                    Reply <span className="text-[#1DBDF5]">{repliedToName}</span>
                </p>
            )}

            <div className="mb-2 flex">
                <p className={`text-base font-semibold ${messageColor}`}>
                    {message}
                </p>
            </div>

            {onReply && (
                <div>
                    <div className="flex justify-start gap-4">
                        <button
                            onClick={onReply}
                            className="text-sm font-medium text-[#1DBDF5] hover:cursor-pointer"
                        >
                            Balas
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

CommentBody.propTypes = {
    message: PropTypes.string.isRequired,
    isDark: PropTypes.bool,
    onReply: PropTypes.func,
    repliedToName: PropTypes.string,
};