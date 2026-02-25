import React from "react";
import propTypes from "prop-types";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { createCommentSchema } from "@/lib/schemas/createCommentSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useCreateCommentMutation } from "@/hooks/api/commentSliceAPI";
import { useDisplayPayment } from "@/hooks/api/paymentAPI";
import { Icon } from "@iconify/react";
import CommentDonationForm from "./CommentDonationForm";
import DonationLabel from "./DonationLabel";
import TipPaymentModal from "./TipPaymentModal";
import { useGetUserId } from "@/lib/features/useGetUserId";
import Link from "next/link";

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
  const { display } = useDisplayPayment();
  const [tipValue, setTipValue] = React.useState(null);
  const [withTip, setWithTip] = React.useState(false);
  const [showTipPaymentModal, setShowTipPaymentModal] = React.useState(false);

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
      paymentMethod: "bri_va",
    },
  });

  const submitComment = async (data, options = {}) => {
    const { paymentMethod, skipTipModal = false } = options;

    // If there's a tip, always show modal first unless skipped
    if (withTip && Number(tipValue) > 0 && !skipTipModal) {
      setShowTipPaymentModal(true);
      return;
    }

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
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(chosen ? { [chosen.key]: chosen.value } : {}),
    };

    try {
      const result = await createComment(payload).unwrap();

      // Jika ada snapToken/snapUrl di response, tampilkan payment
      if (result?.data?.snapToken || result?.data?.snapUrl) {
        await display(
          {
            snapToken: result.data.snapToken,
            snapUrl: result.data.snapUrl,
            provider: result.data.provider || "midtrans",
            paymentMethod: result.data.paymentMethod || null,
            qrisImageUrl:
              result.data.qrisImageUrl ||
              result.data.qrisUrl ||
              result.data.qrCodeUrl ||
              result.data.qrUrl ||
              null,
          },
          {
            onSuccess: (paymentResult) => {
              console.log("Pembayaran berhasil:", paymentResult);
              reset();
              setTipValue(null);
              setWithTip(false);
              setShowTipPaymentModal(false);
            },
            onPending: (paymentResult) => {
              console.log("Pembayaran pending:", paymentResult);
              alert("Pembayaran masih dalam proses.");
            },
            onError: (paymentError) => {
              console.error("Pembayaran gagal:", paymentError);
              alert("Pembayaran gagal. Silakan coba lagi.");
              setShowTipPaymentModal(false);
            },
            onClose: () => {
              console.log("Payment dialog ditutup");
              // Tetap reset form meskipun user close
              reset();
              setTipValue(null);
              setWithTip(false);
              setShowTipPaymentModal(false);
            },
          }
        );
      } else {
        // Jika tidak ada payment (comment tanpa tip atau tip gratis)
        reset();
        setTipValue(null);
        setWithTip(false);
        setShowTipPaymentModal(false);
      }
    } catch (err) {
      console.error("Error creating comment:", err);
      alert("Gagal mengirim komentar. Silakan coba lagi.");
      setShowTipPaymentModal(false);
    }
  };

  const onSubmit = (data) => submitComment(data);

  const handleTipPaymentConfirm = (paymentMethod) => {
    setShowTipPaymentModal(false);

    setTimeout(() => {
      handleSubmit((data) =>
        submitComment(data, { paymentMethod, skipTipModal: true })
      )();
    }, 0);
  };


  return (
    <section className={`flex w-full flex-col pb-3 text-white`}>
      <div className="flex w-full">
        <form className="flex w-full flex-col gap-2.5" onSubmit={handleSubmit(onSubmit)} >
          <div
            className={`
              ${errors.message ? "border-red-500" : "border-[#F5F5F540]"} 
              flex min-h-[128px] flex-col gap-2 w-full rounded-md border p-3 text-sm text-white transition-all duration-300 bg-[#F5F5F54D]
              focus-within:border-[#2563eb]
            `}
          >
            {withTip && tipValue && (
              <div className="w-fit">
                <DonationLabel label={tipValue} />
              </div>
            )}

            <textarea
              {...register("message")}
              id="comment"
              placeholder="Tell us about you, maxs 150 character."
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
          {userId && <div className={` ${withTip ? "flex" : "grid"} grid-cols-5 gap-2 montserratFont`}>
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#0E5BA8]"} flex w-full ${withTip ? "w-full" : "col-span-3"} cursor-pointer items-center justify-center rounded-md border-2 border-[#F5F5F559] py-2 text-sm font-bold text-white`}
            >
              {isLoading ? "Loading..." : "Kirim Komentar"}
            </button>
            {withReward && (
              <div
                onClick={() => setWithTip(!withTip)}
                disabled={isLoading}
                className={`${isLoading ? "cursor-not-allowed opacity-60 bg-gray-600" : "bg-[#0E5BA8]"} flex ${withTip ? "w-max p-2" : "col-span-2"} gap-1 cursor-pointer items-center justify-center rounded-md border-2 border-[#F5F5F559] py-2 text-sm font-bold text-white`}
              >
                <Icon icon={"solar:crown-bold-duotone"} className="text-[#F07F26] w-6 h-6" />
                {!withTip ? (isLoading ? "Loading..." : "Reward") : null}
              </div>
            )}
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

      {/* Tip Payment Modal */}
      <TipPaymentModal
        isOpen={showTipPaymentModal}
        onClose={() => {
          setShowTipPaymentModal(false);
        }}
        tipAmount={tipValue}
        onConfirm={handleTipPaymentConfirm}
        isLoading={isLoading}
      />
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