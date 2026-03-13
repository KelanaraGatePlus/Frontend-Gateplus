import React, { useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { CommentMenu } from "./CommentMenu";
import ReportCommentModal from "./ReportCommentModal";
import { useDeleteCommentMutation } from "@/hooks/api/commentSliceAPI";

export const CommentBody = ({ message, isDark, onReply, repliedToName, commentId, user, currentUserId }) => {
    const messageColor = repliedToName ? "text-[#979797]" : (isDark ? "text-white" : "text-[#1A1A1A]");
    const [showReportModal, setShowReportModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [infoType, setInfoType] = useState("success");

    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();
    const isOwner = currentUserId && currentUserId === user?.id;

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setInfoType("success");
        setInfoMessage("Komentar berhasil disalin!");
        setShowInfoModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteComment(commentId).unwrap();
            setShowConfirmDelete(false);
            setInfoType("success");
            setInfoMessage("Komentar berhasil dihapus!");
            setShowInfoModal(true);
        } catch (error) {
            console.error("Error deleting comment:", error);
            setShowConfirmDelete(false);
            setInfoType("error");
            setInfoMessage(
                "Gagal menghapus komentar: " +
                (error?.data?.message || error.message)
            );
            setShowInfoModal(true);
        }
    };

    return (
        <>
            <div className={`flex flex-col rounded-md gap-4 ${isDark ? "bg-[#393939] text-white" : "bg-[#C6C6C6] text-[#1A1A1A]"}`}>
                <div className="flex items-center justify-between">
                    {onReply ? (
                        <div className="flex items-center gap-1">
                            <Icon
                                icon="iconamoon:comment-light"
                                width={16}
                                height={16}
                            />
                            <button
                                onClick={onReply}
                                className="text-sm font-medium text-[#C6C6C6] hover:cursor-pointer"
                            >
                                Balas
                            </button>
                        </div>
                    ) : <div />}

                    <CommentMenu
                        onReport={() => setShowReportModal(true)}
                        onReply={onReply || (() => {})}
                        onCopy={handleCopy}
                        onDelete={() => setShowConfirmDelete(true)}
                        showDelete={isOwner}
                        isDark={isDark}
                    />
                </div>
            </div>

            <ReportCommentModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                commentId={commentId}
                isDark={isDark}
            />

            {showConfirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className={`w-[90%] max-w-md rounded-xl p-6 shadow-xl ${isDark ? "bg-[#1F2937] text-white" : "bg-white text-black"}`}>
                        <h2 className="mb-3 text-lg font-semibold">Konfirmasi Hapus</h2>

                        <p className="mb-6 text-sm">
                            Apakah Anda yakin ingin menghapus komentar ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className={`rounded-lg border px-4 py-2 text-sm transition ${isDark
                                    ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                                disabled={isDeleting}
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className={`w-[90%] max-w-sm rounded-xl p-6 shadow-xl ${isDark ? "bg-[#1F2937] text-white" : "bg-white text-black"}`}>
                        <h2 className={`mb-3 text-lg font-semibold ${infoType === "error" ? "text-red-500" : "text-green-500"}`}>
                            {infoType === "error" ? "Terjadi Kesalahan" : "Berhasil"}
                        </h2>

                        <p className="mb-6 text-sm">{infoMessage}</p>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

CommentBody.propTypes = {
    message: PropTypes.string.isRequired,
    isDark: PropTypes.bool,
    onReply: PropTypes.func,
    repliedToName: PropTypes.string,
    commentId: PropTypes.string.isRequired,
    user: PropTypes.shape({
        id: PropTypes.string,
    }).isRequired,
    currentUserId: PropTypes.string,
};