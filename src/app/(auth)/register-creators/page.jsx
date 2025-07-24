"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

/*[--- UI COMPONENTS ---]*/
import FormRegisterCreator from "@/components/AuthForm/FormRegisterCreator/page";
import IconsSignupCreators from "@@/icons/hands holding gold trophy cup.svg";
import LogoGatePlus from "@@/logo/logoGate+/logo-header-register.svg";

export default function RegisterCreatorsPage() {
  const content = {
    title: "Gabung sebagai Kreator dan Nikmati Akses Creator Gate Plus!",
    description:
      "Menjadi kreator di platform kami memberi Anda akses eksklusif untuk mengunggah konten, mengelola karya, serta memperoleh pendapatan dari penggemar dan audiens. Dapatkan fitur tambahan seperti analitik konten, dukungan prioritas, dan kesempatan untuk mendapatkan lebih banyak exposure di platform.",
    subtitle: "Tunggu apa lagi?",
    subtitleDescription:
      "Daftar sebagai kreator sekarang dan mulai berbagi karya Anda dengan dunia! 🎬🎤📚"
  }
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
              {content.title}
            </p>
            <p className="montserratFont text-justify text-sm font-light text-white">
              {content.description}
            </p>
          </div>
          <div className="mx-5 mb-2 hidden h-full flex-col items-start justify-center gap-1 lg:flex">
            <p className="zeinFont text-left text-3xl font-semibold text-white">
              {content.subtitle}
            </p>
            <p className="montserratFont text-justify text-sm font-normal text-white">
              {content.subtitleDescription}
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
            <FormRegisterCreator />
          </section>
        </section>
        {/*  */}
        <section className="flex h-full w-full max-w-lg flex-col gap-4 lg:hidden">
          <div className="mx-2 mt-3.5 flex h-full flex-col items-center justify-center gap-1">
            <p className="zeinFont mb-1.5 text-left text-3xl font-semibold text-white">
              {content.title}
            </p>
            <p className="montserratFont text-left text-sm font-light text-white">
              {content.description}
            </p>
          </div>
          <div className="mx-2 flex h-full flex-col items-start justify-center gap-1">
            <p className="zeinFont mb-1.5 text-left text-3xl font-semibold text-white">
              {content.subtitle}
            </p>
            <p className="montserratFont text-left text-sm font-normal text-white">
              {content.subtitleDescription}
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
