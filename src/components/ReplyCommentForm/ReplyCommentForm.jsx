// File: src/components/ReplyCommentForm/ReplyCommentForm.jsx

import React, { forwardRef } from "react";
import propTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReplyCommentMutation } from "@/hooks/api/commentSliceAPI";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { replyCommentSchema } from "@/lib/schemas/replyCommentSchema";

const ReplyCommentForm = forwardRef(function ReplyCommentForm(props, ref) {
    const { commentId, onCloseModal } = props;

    const [createReplyComment, { isLoading, error }] = useReplyCommentMutation();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(replyCommentSchema),
        mode: "onChange",
        defaultValues: {
            message: "",
        },
    });

    // [MODIFIKASI 1] Pisahkan 'ref' dari properti 'register' lainnya
    const { ref: rhfRef, ...rest } = register("message");

    const onSubmit = async (data) => {
        const payload = {
            message: data.message,
            commentId
        };

        try {
            await createReplyComment(payload).unwrap();
            onCloseModal(); 
            reset();
        } catch (err) {
            console.error("Error creating reply:", err);
        }
    };

    return (
        <section key={commentId} className={`flex w-full flex-col pb-3 text-white`}>
            <div className="flex w-full">
                <form
                    className="flex w-full flex-col gap-2.5 rounded-xl border border-[#F5F5F5]/10 bg-[#393939] p-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div
                        className={`${errors.message ? "border-red-500" : "border-[#F5F5F540]"} flex min-h-[128px] w-full flex-col gap-2 rounded-md border bg-[#F5F5F50D] p-3 text-sm text-white transition-all duration-300 focus-within:border-[#2563eb]`}
                    >
                        <textarea
                            // [MODIFIKASI 2] Gunakan callback ref untuk menggabungkan keduanya
                            ref={(node) => {
                                rhfRef(node); // Berikan ref ke react-hook-form
                                if (typeof ref === "function") {
                                    ref(node);
                                } else if (ref) {
                                    // Berikan ref ke parent component (untuk .focus())
                                    ref.current = node;
                                }
                            }}
                            name="comment"
                            id="reply-comment"
                            placeholder="Tulis balasan anda... (maksimal 150 karakter)"
                            rows={1}
                            className="montserratFont h-auto w-full flex-1 resize-none border-none bg-transparent p-0 text-white outline-none placeholder:text-[#979797] focus:ring-0"
                            // [MODIFIKASI 3] Gunakan sisa properti dari 'register' di sini
                            {...rest}
                            onInput={(e) => {
                                const target = e.target;
                                target.style.height = "auto";
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(onSubmit)();
                                }
                            }}
                            required
                        />
                    </div>
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                    <div className="w-full flex justify-end gap-2">
                        <button
                            onClick={onCloseModal}
                            disabled={isLoading}
                            className={`${isLoading ? "cursor-not-allowed bg-gray-600 opacity-60" : "bg-red-600"} flex w-max cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold text-white shadow-md`}
                        >
                            <Icon width={16} height={16} icon={"akar-icons:cross"} />
                            {isLoading ? "Loading..." : "Tutup"}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`${isLoading ? "cursor-not-allowed bg-gray-600 opacity-60" : "bg-[#156EB7]"} flex w-max cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold text-white shadow-md`}
                        >
                            <Icon width={16} height={16} icon={"lucide:send"} />
                            {isLoading ? "Loading..." : "Kirim Balasan"}
                        </button>
                    </div>
                    {error && <p className="mt-1 text-sm text-red-500">{error.data?.message || "Gagal mengirim balasan"}</p>}
                </form>
            </div>
        </section>
    );
});

ReplyCommentForm.propTypes = {
    commentId: propTypes.string.isRequired,
    onClose: propTypes.func.isRequired,
};

export default ReplyCommentForm;