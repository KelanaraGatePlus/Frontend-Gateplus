/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import {
  useCreateEmailOTPMutation,
  useVerifyEmailMutation,
} from "@/hooks/api/oneTimePasswordAPI";
import { useAuth } from "@/components/Context/AuthContext";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const { logout } = useAuth();

  const [createEmailOtp, { isLoading, isError, isSuccess, error }] =
    useCreateEmailOTPMutation();
  const [
    verifyEmailOtp,
    {
      isLoading: isVerifying,
      isError: isVerifyingError,
      isSuccess: isVerifyingSuccess,
      error: verifyingError,
    },
  ] = useVerifyEmailMutation();

  // ⏱️ Timer countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // 📩 Cek kapan terakhir OTP dikirim
  useEffect(() => {
    const lastSent = localStorage.getItem("lastOtpSent");
    if (!lastSent) return;

    const elapsed = Math.floor((Date.now() - Number(lastSent)) / 1000);
    if (elapsed < 120) {
      setCooldown(120 - elapsed);
      console.log(`⏳ Masih cooldown ${120 - elapsed} detik`);
    }
  }, []);

  // 📬 Kirim OTP ke email user
  const handleSendOtp = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const jwtToken = urlParams.get("token");
      const result = await createEmailOtp({ jwtToken }).unwrap();
      console.log("✅ OTP Sent:", result);
      localStorage.setItem("lastOtpSent", Date.now().toString()); // simpan waktu kirim
      setCooldown(120); // aktifkan cooldown 2 menit
    } catch (err) {
      console.error("❌ Gagal kirim OTP:", err);
      setCooldown(30); // cooldown pendek jika gagal (opsional)
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0) return;
    await handleSendOtp();
  };

  // ✅ Submit OTP ke backend
  const handleSubmit = async () => {
    if (isVerifying || otp.length < 6) return;

    const urlParams = new URLSearchParams(window.location.search);
    const jwtToken = urlParams.get("token");
    try {
      await verifyEmailOtp({ token: otp, jwtToken: jwtToken }).unwrap();

      logout();

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error("❌ Gagal verifikasi OTP:", err);
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4 md:py-10">
      <main className="flex h-full w-full max-w-lg flex-col rounded-lg bg-[#184A9780] px-6 pt-2 pb-8 shadow-lg backdrop-blur-md">
        {/* Header */}
        <section className="flex flex-col">
          <div className="relative flex h-24 w-fit items-center justify-start">
            <h1 className="zeinFont text-5xl font-black text-white md:text-5xl">
              Input OTP
            </h1>
          </div>

          {/* Status Info */}
          {isSuccess && (
            <p className="montserratFont -mt-7 mb-6 translate-y-2 text-sm font-normal text-[#1DBDF5]">
              We have sent an OTP to your email, please check.
            </p>
          )}
          {isError && (
            <p className="montserratFont -mt-7 mb-6 translate-y-2 text-sm font-normal text-red-500">
              {error?.data?.message ||
                "Failed to send OTP Code, please try again later."}
            </p>
          )}
          {isVerifyingError && (
            <p className="montserratFont mb-4 text-sm font-normal text-red-500">
              {verifyingError?.data?.message || "Invalid or expired OTP code."}
            </p>
          )}
          {isVerifyingSuccess && (
            <p className="montserratFont mb-4 text-sm font-normal text-green-400">
              Email Berhasil diverifikasi! Silahkan Login.
            </p>
          )}
        </section>

        {/* OTP Input */}
        <div className="flex justify-center mb-4">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="number"
            renderInput={(props, index) => (
              <input
                key={index}
                {...props}
                className="mx-2 h-12 w-12 md:h-16 md:w-16 rounded-lg border border-gray-300 bg-white text-center text-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            )}
            skipDefaultStyles
          />
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleSubmit}
          disabled={isVerifying || otp.length < 6}
          className={`zeinFont mt-4 cursor-pointer rounded-lg border py-2 text-xl font-bold text-white transition-all ${isVerifying || otp.length < 6
            ? "border-gray-400 bg-gray-500/50 cursor-not-allowed"
            : "border-[#156EB7] bg-[#156EB7] hover:border-white/70 hover:bg-[#156EB7CC]"
            }`}
        >
          {isVerifying ? "Verifying..." : "Next"}
        </button>

        <button
          onClick={handleResendOtp}
          disabled={cooldown > 0}
          className={`zeinFont mt-2 cursor-pointer rounded-lg border-2 py-2 text-xl font-bold text-white transition-all ${cooldown > 0
            ? "border-gray-400 bg-gray-500/50 cursor-not-allowed"
            : "border-[#156EB7] hover:border-white/70 hover:bg-[#156EB7CC]"
            }`}
        >
          {cooldown > 0
            ? `Resend available in ${cooldown}s`
            : "Didn’t receive any code?"}
        </button>
      </main>

      {/* Loading Overlay */}
      {(isLoading || isVerifying) && (
        <LoadingOverlay
          message={
            isVerifying
              ? "Memverifikasi OTP anda..."
              : "Mengirim OTP ke email anda..."
          }
        />
      )}
    </div>
  );
}
