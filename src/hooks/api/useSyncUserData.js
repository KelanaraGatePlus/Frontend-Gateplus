"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/hooks/api/userSliceAPI";
import { storeUserData } from "@/lib/helper/authHelper";
import { calculateAge } from "@/hooks/helper/age";
import getMinAge from "@/lib/helper/minAge";

export default function useSyncUserData(seriesAgeRestriction = null) {
  const router = useRouter();
  const { data, isSuccess, isLoading, isError, error } = useGetMeQuery();

  const [userAge, setUserAge] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const [showUnderAgeModal, setShowUnderAgeModal] = useState(false);
  const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [underAgeConfirmed, setUnderAgeConfirmed] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (isError && error?.status === 401) {
      setShowUnderAgeModal(false);
      setShowCompleteProfileModal(false);
      setIsReady(true);
      return;
    }

    if (!isSuccess || !data?.Session) return;

    const session = data.Session;

    // cache user
    storeUserData({
      ...session,
      dateOfBirth: session.dateOfBirth || null,
    });

    // set umur
    if (session.dateOfBirth) {
      const age = Number(calculateAge(session.dateOfBirth));
      setUserAge(isNaN(age) ? null : age);
    } else {
      setUserAge(null);
    }

    setIsReady(true);

    // === BAGIAN KHUSUS DETAIL PAGE ===
    if (!seriesAgeRestriction) return;

    const minAge = getMinAge(seriesAgeRestriction);

    // SU / R13
    if (minAge === null) return;

    if (!session.dateOfBirth) {
      setShowCompleteProfileModal(true);
      return;
    }

    if (userAge < minAge && !underAgeConfirmed) {
      setShowUnderAgeModal(true);
    } else {
      setShowUnderAgeModal(false);
    }
  }, [isLoading, isSuccess, isError, error, data, seriesAgeRestriction, underAgeConfirmed]);

  const goToProfile = () => {
    setShowCompleteProfileModal(false);
    router.push("/user/settings");
  };

  const continueDespiteUnderAge = () => {
    setShowUnderAgeModal(false);
    setUnderAgeConfirmed(true);
  };

  return {
    // blur
    userAge,
    isReady,

    // detail
    showUnderAgeModal,
    setShowUnderAgeModal,
    showCompleteProfileModal,
    setShowCompleteProfileModal,
    goToProfile,
    continueDespiteUnderAge,
  };
}
