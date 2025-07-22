"use client";
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useLoginUserMutation } from "@/hooks/api/userSliceAPI";
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import LogoGoogle from "@@/logo/logoGoogle/icons-google.svg";

export default function FormLogin({
  setIsError,
  setError,
  setIsSuccess,
}) {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [login, { isLoading, isSuccess, isError, error }] = useLoginUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsError(isError);
    setError(error);
    setIsSuccess(isSuccess);
  }, [isError, error, isSuccess]);

  const toggleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      const token = response.data?.token;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("theme", "dark");
        localStorage.setItem("users_id", response.data.id);
        localStorage.setItem("image_users", response.data.image);
        localStorage.setItem("role", response.data.role);
        if (response.data.creator !== null) {
          localStorage.setItem(
            "image_creators",
            response.data.creator.imageUrl,
          );
          localStorage.setItem("creators_id", response.data.creator.id);
          localStorage.setItem("isCreator", JSON.stringify(true));
        }
        document.cookie = `token=${token}; path=/`;
        setEmail("");
        setPassword("");
        router.push(callbackUrl);
      } else {
        console.error("Token not found in response");
      }
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
      <div className="relative w-full">
        <input
          id="email"
          placeholder="Email"
          className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label
          htmlFor="email"
          className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
        >
          Email
        </label>
      </div>
      <div className="relative flex w-full">
        <input
          id="password"
          placeholder="Password"
          className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
          type={isPasswordVisible ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-2xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]"
      >
        {isLoading ? "Logging in ..." : "Log In"}
      </button>

      <button className="zeinFont flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-500 bg-blue-900 py-2 text-2xl font-bold text-white hover:bg-blue-950 md:rounded-xl">
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
  setError: PropTypes.string.isRequired,
};