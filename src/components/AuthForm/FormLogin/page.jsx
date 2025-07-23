"use client";

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

/*[--- THIRD PARTY LIBRARIES ---]*/
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/*[--- SCHEMAS & HELPER ---]*/
import { loginSchema } from "@/lib/schemas/loginSchema";
import { storeUserData } from "@/lib/helper/authHelper";

/*[--- API HOOKS ---]*/
import { useLoginUserMutation } from "@/hooks/api/userSliceAPI";

/*[--- UI COMPONENTS ---]*/
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import LogoGoogle from "@@/logo/logoGoogle/icons-google.svg";

export default function FormLogin({ setIsError, setError, setIsSuccess, }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const [login, { isLoading, isSuccess, isError, error }] = useLoginUserMutation();

  useEffect(() => {
    setIsError(isError);
    setError(error);
    setIsSuccess(isSuccess);
  }, [isError, error, isSuccess]);

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      storeUserData(response.data);
      reset();
      router.push(callbackUrl);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const toggleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
      <div className="relative w-full">
        <input
          id="email"
          className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
          type="email"
          autoComplete='off'
          autoFocus={true}
          {...register("email")}
        />
        <label
          htmlFor="email"
          className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
        >
          Email
        </label>
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col w-full">
        <div className="relative flex w-full">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
            placeholder="Password"
            autoComplete="off"
            {...register("password")}
          />
          <label
            htmlFor="password"
            className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
          >
            Password
          </label>
          <div
            className="absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2 cursor-pointer"
            onClick={toggleShowPassword}
          >
            <Image
              src={isPasswordVisible ? IconsEyeOpen : IconsEyeClose}
              alt="Show Password"
              className="object-cover"
            />
          </div>
        </div>
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>
      <span className="zeinFont flex justify-between text-xl text-[#1DBDF5]">
        <Link href="/register" className="text-left">
          <span>Create new account</span>
        </Link>
        <Link href="/forgot-password" className="text-right">
          <span>Forgot Password?</span>
        </Link>
      </span>
      <button
        disabled={isLoading}
        className="zeinFont mt-4 cursor-pointer rounded-lg bg-[#156EB7] py-2 text-2xl font-bold text-white hover:bg-[#156EB7CC]"
      >
        {isLoading ? "Logging in ..." : "Log In"}
      </button>

      <button className="zeinFont flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-900 py-2 text-2xl font-bold text-white hover:bg-blue-950">
        <Image priority src={LogoGoogle} alt="logo-google" />
        <p>
          <span>Sign In with Google</span>
        </p>
      </button>
    </form>
  )
}

FormLogin.propTypes = {
  setIsError: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};