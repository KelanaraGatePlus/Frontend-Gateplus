/* eslint-disable react/react-in-jsx-scope */
import Picture404 from "@@/icons/error-page.svg";
import Image from "next/image";
import Link from "next/link";
import MiniFooter from "@/components/Footer/MiniFooter";

export default function SessionExpiredPage() {
  return (
    <div className="montserratFont relative flex min-h-screen min-w-screen flex-col items-center justify-center overflow-clip px-4 md:py-10">
      <main className="z-10 flex h-full w-full max-w-lg flex-col gap-4 rounded-lg border border-[#1382C9] bg-[#166CA5] px-4 py-10 [box-shadow:0px_4px_70px_rgba(19,130,201,0.7)] lg:max-w-5xl">
        <section className="-mt-4 flex flex-col items-center">
          <div className="relative flex h-[200px] w-[550px] items-stretch justify-center">
            <Image
              priority
              src={Picture404}
              alt="icons 404"
              className="object-contain object-center"
              fill
            />
          </div>
        </section>
        <section className="flex flex-col items-center">
          <div className="-mt-3 flex translate-y-2">
            <p className="zeinFont text-3xl font-bold text-white">
              <span>Session Expired</span>
            </p>
          </div>
        </section>
        <section className="mt-4 flex flex-col items-center">
          <div className="-mt-7 mb-2 flex translate-y-2 justify-center">
            <p className="max-w-2/3 text-center text-sm font-normal text-white/70 md:text-sm">
              <span>Sesi pengguna telah berakhir dan harus login kembali.</span>
            </p>
          </div>
        </section>
        <section className="flex flex-col items-center gap-2 px-3 text-white lg:flex-row-reverse lg:justify-center">
          <Link
            href="/login"
            className="flex rounded-lg border border-[#184A97] bg-[#156EB7] px-8 py-2 text-center text-base font-semibold [box-shadow:0px_7px_10px_rgba(0,0,0,0.25)]"
          >
            Login
          </Link>
        </section>
      </main>

      <div className="absolute bottom-0 text-[10px] md:text-sm">
        <MiniFooter />
      </div>
    </div>
  );
}
