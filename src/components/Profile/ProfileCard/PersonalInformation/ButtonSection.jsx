import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/lib/constants/backendUrl';

export default function ButtonSection({
    profileFor,
    isOwnProfile,
    isSubscribed,
    isSubscribing,
    handleToggleSubscribe,
    isLinkedWithGoogle = false
}) {
    const [id, setId] = useState("");
    useEffect(() => {
        // Ambil id dari localStorage atau sessionStorage
        const userId = localStorage.getItem("users_id") || sessionStorage.getItem("users_id");
        setId(userId);
    }, []);

    const handleLinkGoogle = () => {
        const url = `${BACKEND_URL}/auth/link/google?id=${id}`;
        // Redirect ke backend (tanpa header)
        window.location.href = url;
    };

    return isOwnProfile ? (
        <div className='flex w-full flex-col gap-2'>
            <button className="mt-1 rounded-lg bg-[#0E5BA8] py-2 font-bold text-white hover:bg-[#0E5BA8]/80" >
                <Link href={profileFor === "creator" ? "/creator/settings" : "/user/settings"}>
                    <p>Edit Profile</p>
                </Link>
            </button>
            <button disabled={isLinkedWithGoogle} onClick={handleLinkGoogle} className={`mt-1 rounded-lg ${isLinkedWithGoogle ? "bg-transparent" : "bg-[#0E5BA8] hover:bg-[#0E5BA8]/80"} py-2 font-bold text-white `} >
                <p>{isLinkedWithGoogle ? "Linked With Google Account" : "Link With Google Account"}</p>
            </button>
        </div>
    ) : (
        profileFor === "creator" ? (
            <button
                className={`mt-1 rounded-lg py-2 font-bold text-white ${isSubscribed ? "bg-gray-500 hover:bg-gray-500/80" : "bg-[#0E5BA8] hover:bg-[#0E5BA8]/80"} cursor-pointer`}
                onClick={handleToggleSubscribe}
            >
                {isSubscribing ? (
                    <div className="flex">
                        <svg
                            aria-hidden="true"
                            className="dark:text-white-600 mr-2 h-6 w-6 animate-spin fill-white text-gray-200"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <p className="flex">Subscribing...</p>
                    </div>
                ) : isSubscribed ? (
                    "Following"
                ) : (
                    "Follow Now"
                )}
            </button>
        ) : null
    )
}

ButtonSection.propTypes = {
    profileFor: PropTypes.oneOf(['creator', 'user']).isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubscribing: PropTypes.bool.isRequired,
    handleToggleSubscribe: PropTypes.func.isRequired,
    isLinkedWithGoogle: PropTypes.bool
}
