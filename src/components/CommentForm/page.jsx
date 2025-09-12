import React from "react";
import propTypes from "prop-types";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createCommentSchema } from "@/lib/schemas/createCommentSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useCreateCommentMutation } from "@/hooks/api/commentSliceAPI";
import { useGetUserId } from "@/lib/features/useGetUserId";

export default function CommentForm({
  episodeEbookId = null,
  episodeComicsId = null,
  episode_podcastId = null,
  episodeSeriesId = null,
  movieId = null
}) {
  const userId = useGetUserId();
  const [createComment, { isLoading, error }] = useCreateCommentMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCommentSchema),
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data) => {
    const payload = {
      userId,
      message: data.message,
      episodeEbookId,
      episodeComicsId,
      episode_podcastId,
      episodeSeriesId,
      movieId
    };

    try {
      await createComment(payload).unwrap();
      reset();
    } catch (err) {
      console.error("Error creating comment:", err);
    }
  };


  return (
    <section className={`flex w-full flex-col pb-3 text-white`}>
      <div className="flex w-full">
        <form className="flex w-full flex-col gap-2.5" onSubmit={handleSubmit(onSubmit)} >
          <textarea
            name="comment"
            id="comment"
            placeholder="Tell us about you, maxs 150 character."
            className={`${errors.message ? "border-red-500" : "border-[#F5F5F540]"} h-32 w-full rounded-md border p-2 text-sm text-white transition-colors duration-300 placeholder:text-sm placeholder:font-bold placeholder:text-[#979797] bg-[#F5F5F54D]`}
            {...register("message")}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
            required
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#0E5BA8]"} flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-[#F5F5F540] py-2 text-sm font-bold text-white`}
          >
            {isLoading ? "Loading..." : "Kirim Komentar"}
          </button>
          {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
        </form>
      </div>
    </section>
  );
}

CommentForm.propTypes = {
  episodeEbookId: propTypes.string,
  episodeComicsId: propTypes.string,
  episode_podcastId: propTypes.string,
  episodeSeriesId: propTypes.string,
  movieId: propTypes.string,
};