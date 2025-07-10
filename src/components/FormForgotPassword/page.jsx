/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useState } from "react";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import Image from "next/legacy/image";

export default function FormForgotPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const toggleShowPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleShowConfirmPassword = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <section className="">
      <form onSubmit={""} className="montserratFont flex w-full flex-col gap-2">
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
          <div className="-mt-1 text-xs text-[#FB3748] italic">
            <p>Password not match</p>
          </div>
        )}
        <span className="zeinFont flex justify-start text-lg font-bold text-[#1DBDF5]">
          Password must be include Capital and Number
        </span>
        <button
          // disabled={isLoading}
          className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-2xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]"
        >
          Confirm
        </button>
      </form>
    </section>
  );
}
