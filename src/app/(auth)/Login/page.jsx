/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useLoginUserMutation } from "@/hooks/api/userSliceAPI";
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import LogoGoogle from "@@/logo/logoGoogle/icons-google.svg";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import logo from "@@/logo/logoGate+/logo-header-login.svg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [login, { isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();
  const router = useRouter();

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
        router.push("/");
      } else {
        console.error("Token not found in response");
      }
    } catch (err) {
      console.error("Failed to login:", err);
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4 md:py-10">
      <main className="flex h-full w-full max-w-lg flex-col rounded-lg border-[#1382C9] bg-[#166CA5] px-4 py-6 [box-shadow:0px_4px_70px_rgba(19,130,201,0.7)]">
        <section className="flex flex-col">
          <div className="relative ml-2 flex h-24 w-fit items-center justify-start">
            <div className="scale-125">
              <Image
                src={logo}
                alt="logo-gateplus"
                priority
                width={128}
                height={64}
                className="object-contain"
                aria-label="logo-gateplus-loginPage"
              />
            </div>
          </div>

          <div className="-mt-6 mb-2.5 flex translate-y-2">
            <p className="montserratFont my-2 text-sm font-normal text-[#1DBDF5]">
              <span>Welcome back, you've been missed</span>
            </p>
          </div>
        </section>
        <section className="">
          {isError && (
            <div className="mb-2 flex items-center space-x-2 rounded-lg border border-red-600 bg-red-800 px-4 py-3 text-xs font-medium text-red-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="flex h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              <p>
                {error?.data?.error || "An error occurred. Please try again."}
              </p>
            </div>
          )}
          {isSuccess && (
            <div className="mb-2 flex items-center space-x-2 rounded-lg border border-green-600 bg-green-800 px-4 py-3 text-xs font-medium text-green-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="flex h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p>Login Successfully!</p>
            </div>
          )}

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
              <Link href="/Register" className="text-left">
                <span>Create new account</span>
              </Link>
              <Link href="/ForgotPassword" className="text-right">
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
        </section>
      </main>
    </div>
  );
}
