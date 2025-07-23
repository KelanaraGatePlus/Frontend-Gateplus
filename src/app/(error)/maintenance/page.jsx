import React from "react";
import Image from "next/image";
import MaintenancePictures from "@@/icons/maintenance-picture.svg";
import logo from "../../../../public/images/logo/logoGate+/logo-header-login.svg";
import MiniFooter from "@/components/Footer/MiniFooter";

export default function MaintenancePage() {
  return (
    <div className="montserratFont relative flex min-h-screen min-w-screen justify-center overflow-clip px-4 md:py-2">
      <main className="flex h-full w-full max-w-lg flex-col px-4 md:-mt-10 md:self-center lg:max-w-5xl">
        <div className="flex h-24 w-fit items-center justify-center self-center">
          <div className="">
            <Image
              priority
              src={logo}
              alt="logo-gateplus"
              width={104}
              height={52}
              className="object-contain"
              aria-label="logo-gateplus-loginPage"
            />
          </div>
        </div>
        <section className="mb-2 flex w-full flex-col items-center lg:mb-3">
          <div className="relative flex h-[300px] w-[280px] items-stretch justify-center md:h-[350px] md:w-[350px]">
            <Image
              priority
              src={MaintenancePictures}
              alt="icons 404"
              className="object-cover object-center"
              fill
            />
          </div>
        </section>
        <section className="flex flex-col items-center">
          <div className="relative flex w-fit items-center justify-start">
            <div className="text-white">
              <h1 className="zeinFont text-center text-3xl leading-none font-black">
                GatePlus Sedang dalam Pemeliharaan
              </h1>
            </div>
          </div>
        </section>

        <section className="mt-3 flex flex-col items-center">
          <div className="flex text-sm">
            <p className="text-center text-sm font-normal text-white/70 md:text-sm">
              <span>Kami sedang melakukan perbaikan sistem dan layanan.</span>
              <br />
              <span>Mohon tunggu sebentar ya...</span>
            </p>
          </div>
        </section>
      </main>

      <div className="absolute bottom-0 text-[12px] md:text-sm">
        <MiniFooter />
      </div>
    </div>
  );
}
