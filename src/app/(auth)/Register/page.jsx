/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useRegisterUserMutation } from "@/hooks/api/userSliceAPI";
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import logo from "@@/logo/logoGate+/logo-header-register.svg";
import LogoGoogle from "@@/logo/logoGoogle/icons-google.svg";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Toast from "@/components/Toast/page";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastType("failed");
      setShowToast(true);
      return;
    }

    try {
      await register({ username, email, password }).unwrap();
      console.log("Registration successful");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/Login");
    } catch (err) {
      console.error("Failed to register:", err);
    }
  };

  const toggleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleShowConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="flex h-screen min-w-screen items-center justify-center px-4 md:py-10">
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

          <div className="-mt-6 mb-3 flex translate-y-2">
            <p className="montserratFont my-2.5 text-sm font-normal text-[#1DBDF5]">
              <span>Create an account</span>
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
              <p className="flex flex-wrap">
                {error?.data?.message || "Failed to Register"}
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
              <p>Registered Successfully!</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2">
            <div className="relative w-full">
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                placeholder="Username"
              />
              <label
                htmlFor="username"
                className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Username
              </label>
            </div>
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
            <div className="relative flex w-full">
              <input
                id="confirm-password"
                placeholder="Confirm Password"
                className={`peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500 ${
                  isConfirmTouched && confirmPassword !== password
                    ? "border-[#FB3748B2] focus:ring-2 focus:ring-[#FB3748B2]"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                }`}
                type={isConfirmPasswordVisible ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsConfirmTouched(true)}
                required
              />
              <label
                htmlFor="confirm-password"
                className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
              >
                Confirm Password
              </label>
              <div
                className="absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2 cursor-pointer"
                onClick={toggleShowConfirmPassword}
              >
                <Image
                  src={isConfirmPasswordVisible ? IconsEyeOpen : IconsEyeClose}
                  alt="Show Password"
                  className="object-cover"
                />
              </div>
            </div>
            {isConfirmTouched && confirmPassword !== password && (
              <div className="montserratFont -mt-1 text-xs font-bold text-[#FB3748]">
                <p>Password not match</p>
              </div>
            )}
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
              {isLoading ? "Registering..." : "Sign Up"}
            </button>
            <button
              type="button"
              className="zeinFont flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-900 py-2 text-2xl font-bold text-white hover:bg-blue-950 md:rounded-xl"
            >
              <Image src={LogoGoogle} alt="Logo-Google" />
              <p>Sign Up with Google</p>
            </button>
          </form>
        </section>
      </main>
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
