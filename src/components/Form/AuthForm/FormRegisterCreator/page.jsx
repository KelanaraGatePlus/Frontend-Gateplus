"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";

/*[--- SCHEMAS & HELPER---]*/
import { registerCreatorSchema } from "@/lib/schemas/registerCreatorSchema";
import { storeCreatorData } from "@/lib/helper/creatorRegistHelper";

/*[--- API HOOKS ---]*/
import { useCheckCreatorAvailabilityQuery, useRegisterCreatorMutation } from "@/hooks/api/creatorSliceAPI";

export default function FormRegisterCreator() {
    const router = useRouter();
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
    
    const [debouncedUsername] = useDebounce(watch("username"), 500);
    const [debouncedEmail] = useDebounce(watch("email"), 500);
    const [debouncedPhone] = useDebounce(watch("phone"), 500);

    const { data: usernameAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "username", value: debouncedUsername },
        { skip: !debouncedUsername }
    );
    const { data: emailAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "email", value: debouncedEmail },
        { skip: !debouncedEmail }
    );
    const { data: phoneAvailable } = useCheckCreatorAvailabilityQuery(
        { type: "email", value: debouncedPhone },
        { skip: !debouncedPhone }
    );

    useEffect(() => {
        if (usernameAvailable && usernameAvailable.exists) {
            setFormError("username", { message: "Username already taken" });
        }
    }, [usernameAvailable]);
    useEffect(() => {
        if (emailAvailable && emailAvailable.exists) {
            setFormError("email", { message: "Email already taken" });
        }
    }, [emailAvailable]);
    useEffect(() => {
        if (phoneAvailable && phoneAvailable.exists) {
            setFormError("phone", { message: "Phone already used" });
        }
    }, [phoneAvailable]);

    const onSubmit = async (data) => {
        try {
            const userId = localStorage.getItem("users_id");
            const payload = {
                ...data,
                userId,
                profileName: data.fullName,
            };

            const response = await registerCreator(payload).unwrap();
            storeCreatorData(response.data.data);
            reset();
            router.push("/");
        } catch (error) {
            console.error("Register Creator failed:", error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-2 flex w-full flex-col gap-2"
        >
            <div className="relative w-full">
                <input
                    type="text"
                    id="fullName"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    placeholder="Nama Lengkap"
                    {...register("fullName")}
                />
                <label
                    htmlFor="fullName"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Nama Lengkap
                </label>
                {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
                )}
            </div>
            <div className="relative w-full">
                <input
                    type="text"
                    id="username"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    placeholder="Username"
                    {...register("username")}
                />
                <label
                    htmlFor="username"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Username
                </label>
                {errors.username && (
                    <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>
                )}
            </div>
            <div className="relative w-full">
                <input
                    id="email"
                    placeholder="Email"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    type="email"
                    {...register("email")}
                />
                <label
                    htmlFor="email"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Email
                </label>
                {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
            </div>
            <div className="relative w-full">
                <input
                    id="phone"
                    placeholder="Phone"
                    className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                    type="number"
                    {...register("phone")}
                />
                <label
                    htmlFor="phone"
                    className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
                >
                    Nomor Telepon
                </label>
                {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                )}
            </div>

            <span className="zeinFont flex justify-between text-xl text-[#1DBDF5]">
                <div>
                    Already registered?{" "}
                    <Link href="/login" className="text-left font-bold">
                        Log in
                    </Link>
                </div>
            </span>
            <button
                disabled={isLoading}
                className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-2xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]"
            >
                {isLoading ? "Registering..." : "Jadi Kreator"}
            </button>
        </form>
    )
}
