import React from "react";
import propTypes from "prop-types";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createCommentSchema } from "@/lib/schemas/createCommentSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useCreateCommentMutation } from "@/hooks/api/commentSliceAPI";
import { Icon } from "@iconify/react";
import CommentDonationForm from "./CommentDonationForm";
import DonationLabel from "./DonationLabel";
import { useGetUserId } from "@/lib/features/useGetUserId";
import Link from "next/link";

const COIN_ARRIVED_EVENT = "gateplus:coin-arrived";

export default function CommentForm({
  contentType,
  episodeEbookId = null,
  episodeComicsId = null,
  podcastId = null,
  episodeSeriesId = null,
  episodePodcastId = null,
  movieId = null,
  educationId = null,
  withReward = true,
}) {
  const userId = useGetUserId();
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const [tipValue, setTipValue] = React.useState(null);
  const [withTip, setWithTip] = React.useState(false);

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
      contentType: contentType || "",
      tipAmount: tipValue || null,
    },
  });

  const submitComment = async (data) => {

    // Determine which id to send based on contentType or available ids
    const typeKeyMap = {
      ebook: { key: "episodeEbookId", value: episodeEbookId },
      comic: { key: "episodeComicsId", value: episodeComicsId },
      podcast: { key: "podcastId", value: podcastId },
      series: { key: "episodeSeriesId", value: episodeSeriesId },
      movie: { key: "movieId", value: movieId },
      episodePodcast: { key: "episode_podcastId", value: episodePodcastId },
      education: { key: "educationId", value: educationId },
    };

    // Fallback detection when contentType not provided
    let chosen = null;
    const normalizedType = typeof contentType === "string" ? contentType.toLowerCase() : undefined;
    if (normalizedType && typeKeyMap[normalizedType]) {
      chosen = typeKeyMap[normalizedType];
    } else {
      const candidates = [
        { key: "episodeEbookId", value: episodeEbookId },
        { key: "episodeComicsId", value: episodeComicsId },
        { key: "podcastId", value: podcastId },
        { key: "episodeSeriesId", value: episodeSeriesId },
        { key: "movieId", value: movieId },
        { key: "episode_podcastId", value: episodePodcastId },
        { key: "educationId", value: educationId },
      ];
      chosen = candidates.find((c) => c.value != null) || null;
    }

    const payload = {
      message: data.message,
      contentType,
      ...(withTip && Number(tipValue) > 0 ? { tipAmount: Number(tipValue) } : {}),
      ...(chosen ? { [chosen.key]: chosen.value } : {}),
    };

    try {
      const result = await createComment(payload).unwrap();

      const paymentData = result?.data || {};
      const paymentType = String(paymentData?.paymentType || "").toUpperCase();
      const balanceAfterTransaction = Number(paymentData?.balanceAfterTransaction);
      const amount = Number(paymentData?.amount);

      if (
        typeof window !== "undefined" &&
        paymentType === "COIN" &&
        Number.isFinite(balanceAfterTransaction)
      ) {
        window.dispatchEvent(
          new CustomEvent(COIN_ARRIVED_EVENT, {
            detail: {
              addedCoins: Number.isFinite(amount) && amount > 0 ? -Math.abs(amount) : 0,
              targetBalance: balanceAfterTransaction,
            },
          })
        );
      }

      reset();
      setTipValue(null);
      setWithTip(false);
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("Gagal mengirim komentar. Silakan coba lagi.");
    }
  };

  const onSubmit = (data) => submitComment(data);


  return (
    <section className={`flex w-full flex-col pb-3 text-white`}>
      <div className="flex w-full">
        <form className="flex w-full flex-col gap-2.5 p-4 bg-[#393939] border border-[#F5F5F5]/10 rounded-xl" onSubmit={handleSubmit(onSubmit)} >
          {withTip && tipValue && (
            <div className="w-fit">
              <DonationLabel label={tipValue} />
            </div>
          )}
          <div
            className={`
              ${errors.message ? "border-red-500" : "border-[#F5F5F540]"} 
              flex min-h-[128px] flex-col gap-2 w-full rounded-md border p-3 text-sm text-white transition-all duration-300 bg-[#F5F5F50D]
              focus-within:border-[#2563eb]
            `}
          >
            <textarea
              {...register("message")}
              id="comment"
              placeholder="Tulis komentar anda... (maksimal 150 karakter)"
              rows={1}
              className="w-full flex-1 montserratFont bg-transparent outline-none border-none resize-none p-0 placeholder:text-[#979797] focus:ring-0 overflow-hidden"
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
          {withTip && (
            <CommentDonationForm
              setValue={setTipValue}
              initialValue={tipValue ?? null}
              name="comment-donation"
            />
          )}
          {userId && <div className={` ${withTip ? "flex" : "flex flex-row"} justify-end gap-2 montserratFont`}>
            {withReward && (
              <div
                onClick={() => setWithTip(!withTip)}
                disabled={isLoading}
                className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#C9610E]"} flex ${withTip ? "w-max p-2" : "col-span-2"} gap-1 cursor-pointer items-center justify-center rounded-md py-2.5 px-4 text-sm font-bold text-white shadow-md`}
              >
                <Icon icon={"solar:crown-bold-duotone"} className="text-[#F5F5F5] w-6 h-6" />
                {!withTip ? (isLoading ? "Loading..." : "Reward") : null}
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#156EB7]"} flex gap-2 w-max py-2.5 px-4 ${withTip ? "w-full" : "col-span-3"} cursor-pointer items-center justify-center rounded-md py-2 text-sm font-bold text-white shadow-md`}
            >
              <Icon
                width={16}
                height={16}
                icon={'lucide:send'}
              />
              {isLoading ? "Loading..." : "Kirim Komentar"}
            </button>
          </div>}
          {!userId && (
            <div className={` ${withTip ? "flex" : "grid"} grid-cols-1 gap-2 montserratFont`}>
              <Link
                href={'/login'}
                disabled={isLoading}
                className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#0E5BA8]"} flex w-full ${withTip ? "w-full" : "col-span-3"} cursor-pointer items-center justify-center rounded-md border-2 border-[#F5F5F559] py-2 text-sm font-bold text-white`}
              >
                Silahkan mendaftar untuk mulai mengirim komentar
              </Link>
            </div>
          )}
          {errors.message?.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </form>
      </div>
    </section>
  );
}

CommentForm.propTypes = {
  contentType: propTypes.oneOf(["EBOOK", "COMIC", "PODCAST", "SERIES", "MOVIE", "EPISODE_PODCAST", "EDUCATION"]).isRequired,
  episodeEbookId: propTypes.string,
  episodeComicsId: propTypes.string,
  podcastId: propTypes.string,
  episodeSeriesId: propTypes.string,
  movieId: propTypes.string,
  episodePodcastId: propTypes.string,
  educationId: propTypes.string,
  withReward: propTypes.bool,
};