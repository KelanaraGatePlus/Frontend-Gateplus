import React, { useState, useEffect } from 'react';
import axios from "axios";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- HOOKS IMPORT ---]*/
import { useGetCreatorDetailQuery } from "@/hooks/api/creatorSliceAPI";

/*[--- UTILITY IMPORT ---]*/
import { imageDefaultValue } from "@/lib/constants/imageDefaultValue";

/*[--- COMPONENT IMPORT ---]*/
import PersonalInformationSection from "./PersonalInformation/page";
import Toast from "@/components/Toast/page";
import ProfileCardLoading from "@/components/Profile/ProfileCard/ProfileCardLoading";

export default function ProfileCard({ creatorId, setBannerImageUrl, setIsLoading }) {
    const [isOwnProfile, setIsOwnProfile] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [totalSubs, setTotalSubs] = useState(0);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [userId, setUserId] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserId = localStorage.getItem("users_id");
            setUserId(storedUserId);
            setReady(true);
        }
    }, []);

    const skip = !creatorId || !userId;
    const { data, isLoading } = useGetCreatorDetailQuery({ creatorId, userId }, { skip });
    const creatorData = data?.data?.data || {};

    useEffect(() => {
        if (!isLoading) {
            setBannerImageUrl(creatorData.bannerImageUrl);
            setTotalSubs(creatorData.totalSubscribers);
            const storedCreatorId = localStorage.getItem("creators_id");
            setIsOwnProfile(storedCreatorId === creatorData.id);
        }
        setIsLoading(isLoading);
    }, [creatorData, isLoading]);


    const handleToggleSubscribe = async () => {
        if (isSubscribed) {
            setShowToast(true);
            return null;
        }
        try {
            setIsSubscribing(true);
            const userId = localStorage.getItem("users_id");
            const creatorId = creatorData.id;
            console.log(userId);
            console.log(creatorId);
            const response = await axios.post(
                `http://localhost:3000/subscribers`,
                {
                    userId: userId,
                    creatorId: creatorId,
                },
            );
            setTotalSubs(totalSubs + 1);
            console.log(response.data);
            setIsSubscribed(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubscribing(false);
        }
    };

    if (!ready || isLoading) {
        return <ProfileCardLoading />;
    }

    return (
        <>
            <div className="relative mt-1 flex h-fit w-full flex-col items-center justify-center overflow-hidden rounded-xl bg-[#FFFFFF1A] p-4 transition-all duration-300 ease-out md:max-w-[300px] md:min-w-[300px]">
                <section className="absolute top-0 mb-2 h-36 w-full overflow-hidden md:hidden md:h-32 lg:w-full">
                    {creatorData.bannerImageUrl && creatorData.bannerImageUrl !== "null" ? (
                        <Image
                            priority
                            src={creatorData.bannerImageUrl}
                            alt="banner-creator"
                            fill
                            className="object-cover object-center"
                        />
                    ) : (
                        <Image
                            priority
                            src={imageDefaultValue.creator.bannerImageUrl}
                            alt="banner-creator"
                            fill
                            className="object-cover object-top"
                        />
                    )}
                </section>

                {/* Profile */}
                <div className="z-0 mt-8 mb-2 h-32 w-32 shrink-0 rounded-full shadow-2xl transition-all duration-300 ease-out md:mt-2 md:h-36 md:w-36">
                    {creatorData.imageUrl && creatorData.imageUrl !== "null" ? (
                        <Image
                            priority
                            className="h-full w-full rounded-full bg-[#2e2e2e] object-cover"
                            src={creatorData.imageUrl}
                            width={128}
                            height={128}
                            alt="logo-usercomment"
                        />
                    ) : (
                        <Image
                            priority
                            className="h-full w-full rounded-full bg-[#2e2e2e] object-cover"
                            src={imageDefaultValue.creator.imageUrl}
                            width={128}
                            height={128}
                            alt="logo-defaultuser"
                        />
                    )}
                </div>

                {/* personal information */}
                <PersonalInformationSection
                    data={creatorData}
                    totalSubsribers={totalSubs}
                    isOwnProfile={isOwnProfile}
                    isSubscribed={isSubscribed}
                    isSubsribing={isSubscribing}
                    handleToggleSubscribe={handleToggleSubscribe}
                />
            </div>
            {showToast && (
                <Toast
                    message={`Untuk saat ini belum bisa Unsubscribe Creator (${creatorData.profileName})`}
                    type="failed"
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    )
}

ProfileCard.propTypes = {
    creatorId: PropTypes.string.isRequired,
    setBannerImageUrl: PropTypes.func.isRequired,
    setIsLoading: PropTypes.func.isRequired,
};