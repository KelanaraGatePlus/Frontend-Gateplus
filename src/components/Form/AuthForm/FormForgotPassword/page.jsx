/* eslint-disable react/react-in-jsx-scope */
"use client";
import { useState } from "react";
import Image from "next/legacy/image";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import useTogglePassword from "@/lib/features/useTogglePassword";
import { forgotPasswordSchema } from "@/lib/schemas/forgotPasswordSchema";
import { useResetPasswordMutation } from "@/hooks/api/userSliceAPI";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FormForgotPassword() {
  const [isConfirmTouched, setIsConfirmTouched] = useState(false);
  const { isVisible: isPasswordVisible, toggle: toggleShowPassword } = useTogglePassword();
  const { isVisible: isConfirmPasswordVisible, toggle: toggleShowConfirmPassword } = useTogglePassword();

  const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const token = new URLSearchParams(window.location.search).get("token");
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Password and Confirm Password do not match");
      }

      await resetPassword({
        resetPasswordToken: token,
        newPassword: data.password,
      }).unwrap();

      // ✅ Langsung redirect kalau sukses
      window.location.href = "/login";
      reset();
    } catch (err) {
      console.error("RESET FAILED:", err);
      alert(
        err?.data?.message ||
        err?.message ||
        "❌ Failed to reset password. Please try again."
      );
    }
  };


  return (
    <section>
      <form
        className="montserratFont flex w-full flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* === Password === */}
        <div className="relative flex w-full">
          <input
            id="password"
            placeholder="Password"
            className={`peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500 ${errors.password ? "border border-[#FB3748B2]" : "border-gray-300"}`}
            type={isPasswordVisible ? "text" : "password"}
            {...register("password")}
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
        {errors.password && (
          <p className="-mt-1 text-xs italic text-[#FB3748]">{errors.password.message}</p>
        )}

        {/* === Confirm Password === */}
        <div className="relative flex w-full">
          <input
            id="confirmPassword"
            placeholder="Confirm Password"
            className={`peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500 ${isConfirmTouched && getValues("confirmPassword") !== getValues("password")
              ? "border-[#FB3748B2]"
              : "border-gray-300"
              }`}
            type={isConfirmPasswordVisible ? "text" : "password"}
            {...register("confirmPassword")}
            onFocus={() => setIsConfirmTouched(true)}
            required
          />
          <label
            htmlFor="confirmPassword"
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

        {isConfirmTouched && getValues("confirmPassword") !== getValues("password") && (
          <p className="-mt-1 text-xs italic text-[#FB3748]">Password not match</p>
        )}

        <span className="zeinFont flex justify-start text-lg font-bold text-[#1DBDF5]">
          Password must include capital and number
        </span>

        <button
          type="submit"
          disabled={isLoading}
          className={`zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-2xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC] ${isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
        >
          {isLoading ? "Processing..." : "Confirm"}
        </button>

        {/* === Error dari Server === */}
        {isError && (
          <p className="mt-2 text-center text-sm italic text-[#FB3748]">
            {error?.data?.message || "Something went wrong, please try again."}
          </p>
        )}

        {/* === Success Feedback === */}
        {isSuccess && (
          <p className="mt-2 text-center text-sm text-green-600">
            Password successfully reset!
          </p>
        )}
      </form>
    </section>
  );
}
