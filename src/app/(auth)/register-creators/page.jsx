/* eslint-disable react/react-in-jsx-scope */
"use client";

import IconsSignupCreators from "@@/icons/hands holding gold trophy cup.svg";
import LogoGatePlus from "@@/logo/logoGate+/logo-header-register.svg";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterCreatorsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const userId = localStorage.getItem("users_id");
      const response = await axios.post(
        `https://backend-gateplus-api.my.id/creator`,
        {
          userId: userId,
          profileName: fullName,
          username: username,
          email: email,
          phone: phone,
        },
      );
      localStorage.setItem("creators_id", response.data.data.data.id);
      localStorage.setItem("isCreator", JSON.stringify(true));
      localStorage.setItem("role", response.data.data.data.role);
      setFullName("");
      setUsername("");
      setEmail("");
      setPhone("");
      setIsLoading(false);
      router.push(`/`);
    } catch (error) {
      setIsLoading(false);
      console.error("Error during post request:", error);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center px-3 md:py-10">
      <main className="flex h-full w-full flex-col items-center justify-center gap-4 px-0 py-6 lg:flex-row">
        <br />
        <section className="mt-64 flex w-full max-w-lg flex-col px-4 py-6 lg:-mt-12">
          <div className="flex h-full justify-center">
            <Image
              priority
              src={IconsSignupCreators}
              alt="icons-signup-creators-page"
            />
          </div>
          <div className="mx-5 mt-3.5 mb-2 hidden h-full flex-col items-center justify-center gap-1 lg:flex">
            <p className="zeinFont text-left text-3xl font-semibold text-white">
              Gabung sebagai Kreator dan Nikmati Akses Creator Gate Plus!
            </p>
            <p className="montserratFont text-justify text-sm font-light text-white">
              Menjadi kreator di platform kami memberi Anda akses eksklusif
              untuk mengunggah konten, mengelola karya, serta memperoleh
              pendapatan dari penggemar dan audiens. Dapatkan fitur tambahan
              seperti analitik konten, dukungan prioritas, dan kesempatan untuk
              mendapatkan lebih banyak exposure di platform.
            </p>
          </div>
          <div className="mx-5 mb-2 hidden h-full flex-col items-start justify-center gap-1 lg:flex">
            <p className="zeinFont text-left text-3xl font-semibold text-white">
              Tunggu apa lagi?
            </p>
            <p className="montserratFont text-justify text-sm font-normal text-white">
              Daftar sebagai kreator sekarang dan mulai berbagi karya Anda
              dengan dunia! 🎬🎤📚
            </p>
          </div>
        </section>
        {/*  */}
        <section className="-mt-40 flex h-fit w-full max-w-lg flex-col rounded-lg bg-[#184A9780] px-4 py-6 backdrop-blur lg:mt-0">
          <section className="flex flex-col">
            <div className="relative ml-2 flex h-24 w-fit items-center justify-start">
              <Link href={"/"}>
                <div className="scale-125">
                  <Image
                    src={LogoGatePlus}
                    alt="logo-gateplus"
                    priority
                    width={128}
                    height={64}
                    className="object-contain"
                    aria-label="logo-gateplus-loginPage"
                  />
                </div>
              </Link>
            </div>

            <div className="-mt-6 mb-4 flex translate-y-2">
              <p className="montserratFont my-2.5 text-sm font-normal text-[#1DBDF5] md:text-sm">
                <span>Jadi Kreator di Gate+</span>
              </p>
            </div>
          </section>
          <section className="">
            <form
              onSubmit={handleSubmit}
              className="mt-2 flex w-full flex-col gap-2"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                  placeholder="Username"
                />
                <label
                  htmlFor="fullName"
                  className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
                >
                  Nama Lengkap
                </label>
              </div>
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
              <div className="relative w-full">
                <input
                  id="phone"
                  placeholder="Phone"
                  className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <label
                  htmlFor="phone"
                  className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500"
                >
                  Nomor Telepon
                </label>
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
          </section>
        </section>
        {/*  */}
        <section className="flex h-full w-full max-w-lg flex-col gap-4 lg:hidden">
          <div className="mx-2 mt-3.5 flex h-full flex-col items-center justify-center gap-1">
            <p className="zeinFont mb-1.5 text-left text-3xl font-semibold text-white">
              Gabung sebagai Kreator dan Nikmati Akses Creator Gate Plus!
            </p>
            <p className="montserratFont text-left text-sm font-light text-white">
              Menjadi kreator di platform kami memberi Anda akses eksklusif
              untuk mengunggah konten, mengelola karya, serta memperoleh
              pendapatan dari penggemar dan audiens. Dapatkan fitur tambahan
              seperti analitik konten, dukungan prioritas, dan kesempatan untuk
              mendapatkan lebih banyak exposure di platform.
            </p>
          </div>
          <div className="mx-2 flex h-full flex-col items-start justify-center gap-1">
            <p className="zeinFont mb-1.5 text-left text-3xl font-semibold text-white">
              Tunggu apa lagi?
            </p>
            <p className="montserratFont text-left text-sm font-normal text-white">
              Daftar sebagai kreator sekarang dan mulai berbagi karya Anda
              dengan dunia! 🎬🎤📚
            </p>
          </div>
          <div className="block h-10 w-full bg-transparent text-transparent lg:hidden">
            {"GatePlus"}
          </div>
        </section>
      </main>
    </div>
  );
}
