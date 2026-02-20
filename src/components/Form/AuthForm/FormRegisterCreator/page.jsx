"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PropTypes from "prop-types";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";

/*[--- SCHEMAS & HELPERS ---]*/
import { registerCreatorSchema } from "@/lib/schemas/registerCreatorSchema";
import { storeCreatorData } from "@/lib/helper/creatorRegistHelper";

/*[--- API HOOKS ---]*/
import {
    useCheckCreatorAvailabilityQuery,
    useRegisterCreatorMutation,
} from "@/hooks/api/creatorSliceAPI";
import { useAuth } from "@/components/Context/AuthContext";

/*[--- ICONS ---]*/
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";

/*[--- RECAPTCHA ---]*/
import ReCAPTCHA from "react-google-recaptcha";

export default function FormRegisterCreator({
    profilePictureUrl,
    profilePicturePreview,
    selectedIconUrl,
    onProfilePictureClick,
}) {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [registerCreator, { isLoading }] = useRegisterCreatorMutation();
    // eslint-disable-next-line no-undef
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const {
        register,
        handleSubmit,
        watch,
        setError: setFormError,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(registerCreatorSchema),
        mode: "onChange",
        reValidateMode: "onBlur",
    });

    /* Debounce fields */
    const [debouncedUsername] = useDebounce(watch("username"), 500);
    const [debouncedPhone] = useDebounce(watch("phone"), 500);

    /* Captcha state */
    const [captchaToken, setCaptchaToken] = React.useState(null);

    /* Check availability */
    const { data: usernameAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "username", value: debouncedUsername },
        { skip: !debouncedUsername }
    );

    const { data: phoneAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "phone", value: debouncedPhone },
        { skip: !debouncedPhone }
    );

    /* Set errors dynamically */
    useEffect(() => {
        if (usernameAvailable?.exists) {
            setFormError("username", { message: "Username already taken" });
        }
    }, [usernameAvailable]);

    useEffect(() => {
        if (phoneAvailable?.exists) {
            setFormError("phone", { message: "Phone already used" });
        }
    }, [phoneAvailable]);

    /* Submit form */
    const onSubmit = async (data) => {
        if (!captchaToken) {
            setFormError("root", { message: "Please complete the reCAPTCHA." });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("fullName", data.fullName);
            formData.append("username", data.username);
            formData.append("phone", data.phone);
            formData.append("captchaToken", captchaToken);

            // Add profile picture if selected
            if (profilePictureUrl) {
                formData.append("imageUrl", profilePictureUrl);
            } else if (selectedIconUrl) {
                formData.append("iconUrl", selectedIconUrl);
            }

            const response = await registerCreator(formData).unwrap();

            storeCreatorData(response.data.data);
            refreshUser();
            reset();
            router.back();
        } catch (error) {
            console.error("Register Creator failed:", error);

            // 🔥 Tampilkan error dari server
            if (error?.data?.message) {
                setFormError("root", { message: error.data.message });
            } else if (error?.message) {
                setFormError("root", { message: error.message });
            } else {
                setFormError("root", {
                    message: "Terjadi kesalahan pada server. Coba lagi nanti.",
                });
            }
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex w-full flex-col gap-2">
            {/* PROFILE PICTURE */}
            <div className="relative w-full flex justify-center mb-4">
                <label className="relative h-24 w-24 cursor-pointer"
                    onClick={onProfilePictureClick}>
                    <div className="group relative h-24 w-24 cursor-pointer overflow-hidden rounded-full">
                        {profilePictureUrl && profilePictureUrl !== "null" && profilePictureUrl !== "" && profilePicturePreview === null ? (
                            <Image
                                src={profilePictureUrl}
                                alt="profile"
                                fill
                                className="h-full w-full rounded-full bg-white object-cover"
                            />
                        ) : (
                            <Image
                                src={profilePicturePreview || logoUsersComment}
                                alt="profile"
                                fill
                                className="h-full w-full rounded-full bg-white object-cover"
                            />
                        )}
                        <div className="absolute right-0 bottom-0 left-0 flex h-[28%] items-center justify-center bg-black/40">
                            <Image
                                src={IconsCameraAdd}
                                alt="camera icon"
                                width={16}
                                height={16}
                                className="scale-110 object-contain"
                            />
                        </div>
                    </div>
                </label>
            </div>

            {/* FULL NAME */}
            <div className="relative w-full">
                <input
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                    placeholder="Nama Lengkap"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    onKeyPress={(e) => {
                        const char = e.key;
                        // Only allow letters and spaces
                        if (!/^[a-zA-Z\s]$/.test(char)) {
                            e.preventDefault();
                        }
                    }}
                />
                <label
                    htmlFor="fullName"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all 
                        peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                        peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 
                        peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Nama Lengkap
                </label>
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            {/* USERNAME */}
            <div className="relative w-full">
                <input
                    type="text"
                    id="username"
                    {...register("username")}
                    placeholder="Creator Name"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    onKeyPress={(e) => {
                        const char = e.key;
                        // Only allow letters and numbers
                        if (!/^[a-zA-Z0-9]$/.test(char)) {
                            e.preventDefault();
                        }
                    }}
                />
                <label
                    htmlFor="username"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 
                    peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Creator Name
                </label>
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
            </div>

            {/* PHONE */}
            <div className="relative w-full">
                <input
                    type="number"
                    id="phone"
                    min="0"
                    inputMode="numeric"
                    {...register("phone")}
                    placeholder="Nomor Telepon"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    onKeyDown={(e) => {
                        if (['-', '+', 'e', 'E'].includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                />
                <label
                    htmlFor="phone"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 
                    peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Nomor Telepon
                </label>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            {/* RECAPTCHA */}
            <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
                className="my-2"
            />

            {errors.root && <p className="text-xs text-red-500">{errors.root.message}</p>}

            {/* SUBMIT BUTTON */}
            <button
                disabled={isLoading}
                className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] 
                bg-[#156EB7] py-2 text-2xl font-bold text-white 
                hover:border-white/70 hover:bg-[#156EB7CC]"
            >
                {isLoading ? "Registering..." : "Jadi Kreator"}
            </button>
        </form>
    );
}

FormRegisterCreator.propTypes = {
    profilePictureUrl: PropTypes.string,
    profilePicturePreview: PropTypes.string,
    selectedIconUrl: PropTypes.string,
    onProfilePictureClick: PropTypes.func,
};
