// File: src/components/ReplyCommentForm/ReplyCommentForm.jsx

import React, { forwardRef } from "react";
import propTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReplyCommentMutation } from "@/hooks/api/commentSliceAPI";
import Image from "next/image";
import { replyCommentSchema } from "@/lib/schemas/replyCommentSchema";

const ReplyCommentForm = forwardRef(function ReplyCommentForm(props, ref) {
    const { commentId, imageUrl, profileName, isAuthor, isDark } = props;

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
            reset();
        } catch (err) {
            console.error("Error creating reply:", err);
        }
    };

    return (
        <section className={`flex w-full flex-col pb-3 text-white`}>
            <div
                className={`flex flex-col gap-4 rounded-lg bg-transparent py-4`}
                key={commentId}
            >
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row items-start gap-2">
                        <p className="text-[#1DBDF5] text-xs">reply</p>
                        <figure>
                            <Image
                                priority
                                className="h-10 w-10 rounded-full bg-blue-300 object-cover object-center"
                                src={
                                    imageUrl
                                }
                                alt="logo-usercomment"
                                width={40}
                                height={40}
                            />
                        </figure>

                        <div className="self-center">
                            <h5 className={`text-xs font-medium ${isDark ? "text-white" : "text-black"}`}>
                                {
                                    profileName
                                }{" "}
                                {isAuthor && "(Author)"}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full">
                <form className="flex w-full flex-col gap-2.5" onSubmit={handleSubmit(onSubmit)}>
                    <textarea
                        // [MODIFIKASI 2] Gunakan callback ref untuk menggabungkan keduanya
                        ref={(node) => {
                            rhfRef(node); // Berikan ref ke react-hook-form
                            if (ref) {
                                // Berikan ref ke parent component (untuk .focus())
                                ref.current = node;
                            }
                        }}
                        name="comment"
                        id="comment"
                        placeholder="Tulis balasan Anda..."
                        className={`${errors.message ? "border-red-500" : "border-[#F5F5F540]"} h-32 w-full rounded-md border p-2 text-sm text-white transition-colors duration-300 placeholder:text-sm placeholder:font-bold placeholder:text-[#979797] bg-[#F5F5F54D]`}
                        // [MODIFIKASI 3] Gunakan sisa properti dari 'register' di sini
                        {...rest}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(onSubmit)();
                            }
                        }}
                        required
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#0E5BA8]"} flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-[#F5F5F540] py-2 text-sm font-bold text-white`}
                    >
                        {isLoading ? "Mengirim..." : "Kirim Balasan"}
                    </button>
                    {error && <p className="text-red-500 text-sm mt-1">{error.data?.message || "Gagal mengirim balasan"}</p>}
                </form>
            </div>
        </section>
    );
});

ReplyCommentForm.propTypes = {
    commentId: propTypes.string.isRequired,
    imageUrl: propTypes.string,
    profileName: propTypes.string,
    isAuthor: propTypes.bool,
    isDark: propTypes.bool,
};

export default ReplyCommentForm;