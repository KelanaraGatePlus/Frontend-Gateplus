import axios from "axios";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

const safeToast = (
  setShowToast = () => {},
  setToastMessage = () => {},
  setToastType = () => {},
  message = "",
  type = "success",
) => {
  setShowToast(true);
  setToastMessage(message);
  setToastType(type);
};

export const subscribeCreator = async (
  isSubscribed,
  creatorProfileName,
  creatorIdProp,
  totalSubs,
  {
    setShowToast,
    setToastMessage,
    setToastType,
    setIsSubscribed,
    setTotalSubs,
    setIsSubscribing,
  },
) => {
  const creatorName = creatorProfileName || "creator";

  try {
    setIsSubscribing(true);

    const userId = localStorage.getItem("users_id");
    const creatorId = creatorIdProp;

    console.log("STATUS SAAT KLIK:", isSubscribed);

    if (!userId || !creatorId) {
      safeToast(
        setShowToast,
        setToastMessage,
        setToastType,
        "Silakan login atau refresh halaman",
        "failed",
      );
      return;
    }

    if (!isSubscribed) {
      // FOLLOW
      await axios.post(`${BACKEND_URL}/subscribers`, {
        userId,
        creatorId,
      });
      setIsSubscribed(true);
      setTotalSubs(totalSubs + 1);
      safeToast(
        setShowToast,
        setToastMessage,
        setToastType,
        `Berhasil mengikuti ${creatorName}`,
        "success",
      );
    } else {
      // UNFOLLOW
      await axios.delete(`${BACKEND_URL}/subscribers/${creatorId}`, {
        data: { userId },
      });
      setIsSubscribed(false);
      setTotalSubs(Math.max(0, totalSubs - 1));
      safeToast(
        setShowToast,
        setToastMessage,
        setToastType,
        `Berhenti mengikuti ${creatorName}`,
        "success",
      );
    }
  } catch (error) {
    console.error("FOLLOW ERROR:", error);
    const message =
      error?.response?.data?.message ||
      `Gagal mengubah status follow ${creatorName}`;
    safeToast(setShowToast, setToastMessage, setToastType, message, "failed");
  } finally {
    setIsSubscribing(false);
  }
};
