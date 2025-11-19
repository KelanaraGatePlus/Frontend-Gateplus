"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

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

/*[--- RECAPTCHA ---]*/
import ReCAPTCHA from "react-google-recaptcha";

export default function FormRegisterCreator() {
    const router = useRouter();
    const { refreshUser } = useAuth();
    const [registerCreator, { isLoading }] = useRegisterCreatorMutation();

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
    const [debouncedEmail] = useDebounce(watch("email"), 500);
    const [debouncedPhone] = useDebounce(watch("phone"), 500);

    /* Captcha state */
    const [captchaToken, setCaptchaToken] = React.useState(null);

    /* Check availability */
    const { data: usernameAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "username", value: debouncedUsername },
        { skip: !debouncedUsername }
    );

    const { data: emailAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "email", value: debouncedEmail },
        { skip: !debouncedEmail }
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
        if (emailAvailable?.exists) {
            setFormError("email", { message: "Email already taken" });
        }
    }, [emailAvailable]);

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
            const userId = localStorage.getItem("users_id");

            const payload = {
                ...data,
                userId,
                profileName: data.fullName,
                captchaToken,
            };

            const response = await registerCreator(payload).unwrap();

            storeCreatorData(response.data.data);
            refreshUser();
            reset();
            router.push("/");
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
            {/* FULL NAME */}
            <div className="relative w-full">
                <input
                    type="text"
                    id="fullName"
                    {...register("fullName")}
                    placeholder="Nama Lengkap"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
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
                    placeholder="Username"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                />
                <label
                    htmlFor="username"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 
                    peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Username
                </label>
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
            </div>

            {/* EMAIL */}
            <div className="relative w-full">
                <input
                    type="email"
                    id="email"
                    {...register("email")}
                    placeholder="Email"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                />
                <label
                    htmlFor="email"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all 
                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base 
                    peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 
                    peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Email
                </label>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            {/* PHONE */}
            <div className="relative w-full">
                <input
                    type="number"
                    id="phone"
                    {...register("phone")}
                    placeholder="Nomor Telepon"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
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
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
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
