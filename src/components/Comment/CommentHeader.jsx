import React, { useState } from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "@/lib/timeFormatter";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import { CommentMenu } from "./CommentMenu";
import ReportCommentModal from "./ReportCommentModal";
import { useDeleteCommentMutation } from "@/hooks/api/commentSliceAPI";

export const CommentHeader = ({
    user,
    isAuthor,
    createdAt,
    isDark,
    commentId,
    message,
    onReply,
    currentUserId,
}) => {

    const [showReportModal, setShowReportModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [infoType, setInfoType] = useState("success"); // success | error | info

    const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

    const isOwner = currentUserId && currentUserId === user.id;

    console.log('DEBUG DELETE BUTTON:', {
        currentUserId,
        commentUserId: user.id,
        isOwner,
        commentId,
        userObject: user
    });

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
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-2">
                    <figure>
                        <Image
                            priority
                            className="h-10 w-10 rounded-full bg-blue-300 object-cover object-center"
                            src={user.imageUrl || DEFAULT_AVATAR}
                            alt="logo-usercomment"
                            width={40}
                            height={40}
                        />
                    </figure>

                    <div>
                        <h5 className={`text-xs font-medium ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                            {user.profileName || user.username}{" "}
                            {isAuthor && "(Author)"}
                        </h5>
                        <p className={`text-[10px] font-normal ${isDark ? "text-white/50" : "text-[#1A1A1A]/50"}`}>
                            {formatDateTime(createdAt)}
                        </p>
                    </div>
                </div>

                <CommentMenu
                    onReport={() => setShowReportModal(true)}
                    onReply={onReply}
                    onCopy={handleCopy}
                    onDelete={() => setShowConfirmDelete(true)}
                    showDelete={isOwner}
                    isDark={isDark}
                />
            </div>

            {/* REPORT MODAL */}
            <ReportCommentModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                commentId={commentId}
                isDark={isDark}
            />

            {/* CONFIRM DELETE MODAL */}
            {showConfirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className={`w-[90%] max-w-md rounded-xl p-6 shadow-xl ${isDark ? "bg-[#1F2937] text-white" : "bg-white text-black"
                        }`}>
                        <h2 className="text-lg font-semibold mb-3">
                            Konfirmasi Hapus
                        </h2>

                        <p className="text-sm mb-6">
                            Apakah Anda yakin ingin menghapus komentar ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmDelete(false)}
                                className={`px-4 py-2 rounded-lg text-sm border transition ${isDark
                                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                                disabled={isDeleting}
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* INFO MODAL */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className={`w-[90%] max-w-sm rounded-xl p-6 shadow-xl ${isDark ? "bg-[#1F2937] text-white" : "bg-white text-black"
                        }`}>
                        <h2 className={`text-lg font-semibold mb-3 ${infoType === "error" ? "text-red-500" : "text-green-500"
                            }`}>
                            {infoType === "error" ? "Terjadi Kesalahan" : "Berhasil"}
                        </h2>

                        <p className="text-sm mb-6">
                            {infoMessage}
                        </p>

                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
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
    commentId: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    onReply: PropTypes.func,
    currentUserId: PropTypes.string,
};
