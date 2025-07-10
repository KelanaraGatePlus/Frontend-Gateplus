import axios from "axios";

export const showFeatureUnavailableToast = ({
  setShowToast,
  setToastMessage,
  setToastType,
}) => {
  setShowToast(true);
  setToastMessage("Fitur ini belum tersedia");
  setToastType("failed");
};

export const saveProduct = async (
  isSaved,
  title,
  id,
  fieldKey,
  { setShowToast, setToastMessage, setToastType, setIsSaved },
) => {
  if (isSaved) {
    setShowToast(true);
    setToastMessage(`Untuk saat ini belum bisa Unsave ${title}`);
    setToastType("failed");
    return;
  }

  try {
    setIsSaved(true);
    const userId = localStorage.getItem("users_id");
    if (!userId) {
      setShowToast(true);
      setToastMessage("Silakan Login Terlebih Dahulu");
      setToastType("failed");
      return;
    }

    const requestBody = {
      userId: userId,
      [fieldKey]: id,
    };

    const response = await axios.post(
      `https://backend-gateplus-api.my.id/save`,
      requestBody,
    );

    console.log(response.data);
    setShowToast(true);
    setToastMessage(`Berhasil Save ${title}`);
    setToastType("success");
  } catch (error) {
    setIsSaved(false);
    console.error(error);
    setShowToast(true);
    setToastMessage("Gagal menyimpan data.");
    setToastType("failed");
  }
};

export const likeProduct = async (
  isLiked,
  title,
  id,
  fieldKey,
  totalLike,
  { setShowToast, setToastMessage, setToastType, setIsLiked, setTotalLike },
) => {
  const totalLikeLocal = totalLike;
  if (isLiked) {
    setShowToast(true);
    setShowToast(true);
    setToastMessage(
      `Untuk saat ini belum dapat melakukakan Unlike Ebook "${title}"`,
    );
    setToastType("failed");
    return null;
  }
  try {
    setIsLiked(true);
    const userId = localStorage.getItem("users_id");
    if (!userId) {
      setShowToast(true);
      setToastMessage("Silakan Login Terlebih Dahulu");
      setToastType("failed");
      return;
    }

    const requestBody = {
      userId: userId,
      [fieldKey]: id,
    };

    const response = await axios.post(
      `https://backend-gateplus-api.my.id/like`,
      requestBody,
    );
    setTotalLike(totalLikeLocal + 1);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
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
      `https://backend-gateplus-api.my.id/subscribers`,
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
