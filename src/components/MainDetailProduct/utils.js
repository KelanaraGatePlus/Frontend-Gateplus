import axios from "axios";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export const showFeatureUnavailableToast = ({
  setShowToast,
  setToastMessage,
  setToastType,
}) => {
  setShowToast(true);
  setToastMessage("Fitur ini belum tersedia");
  setToastType("failed");
};

export const subscribeCreator = async (
  isSubscribed,
  creatorProfileName,
  creatorId,
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
  if (isSubscribed) {
    setShowToast(true);
    setToastMessage(
      `Untuk saat ini belum bisa Unsubscribe Creator ${creatorProfileName}`,
    );
    setToastType("failed");
    return;
  }

  try {
    setIsSubscribing(true);
    const userId = localStorage.getItem("users_id");
    if (!userId) {
      setShowToast(true);
      setToastMessage("Silakan Login Terlebih Dahulu");
      setToastType("failed");
      return;
    }

    const requestBody = {
      userId,
      creatorId,
    };

    const response = await axios.post(
      `${BACKEND_URL}/subscribers`,
      requestBody,
    );

    setTotalSubs(totalSubs + 1);
    setIsSubscribed(true);
    console.log(response.data);
  } catch (error) {
    console.error(error);
    setShowToast(true);
    setToastMessage("Gagal subscribe ke creator.");
    setToastType("failed");
  } finally {
    setIsSubscribing(false);
  }
};
