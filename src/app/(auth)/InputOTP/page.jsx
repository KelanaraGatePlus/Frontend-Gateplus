/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useRef, useState } from "react";

export default function OTPInput() {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value) && value !== "") return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4 md:py-10">
      <main className="flex h-full w-full max-w-lg flex-col rounded-lg bg-[#184A9780] px-6 pt-2 pb-8">
        <section className="flex flex-col">
          <div className="relative flex h-24 w-fit items-center justify-start">
            <div className="text-white">
              <h1 className="zeinFont text-5xl font-black md:text-5xl">
                Input OTP
              </h1>
            </div>
          </div>

          <div className="-mt-7 mb-6 flex translate-y-2">
            <p className="montserratFont text-sm font-normal text-[#1DBDF5]">
              <span>We have sent OTP Code to Your mail, please check</span>
            </p>
          </div>
        </section>

        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="flex h-12 w-12 flex-1 rounded-lg border border-gray-300 bg-white text-center text-lg font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none md:h-18 md:text-3xl"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* button */}
        <button className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]">
          Next
        </button>
        <button className="zeinFont mt-2 cursor-pointer rounded-lg border-2 border-[#156EB7] bg-transparent py-2 text-xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]">
          Didn&apos;t rechives any code
        </button>
      </main>
    </div>
  );
}
