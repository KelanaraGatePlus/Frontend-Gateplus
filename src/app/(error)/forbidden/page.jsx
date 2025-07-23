/* eslint-disable react/react-in-jsx-scope */
import Picture404 from "@@/icons/error-page.svg";
import Image from "next/image";
import Link from "next/link";
import MiniFooter from "@/components/Footer/MiniFooter";

export default function ForbiddenPage() {
  return (
    <div className="montserratFont flex min-h-screen min-w-screen items-center justify-center overflow-clip px-4 md:py-10">
      <main className="-mt-10 flex h-full w-full max-w-lg flex-col gap-4 rounded-lg border border-[#1382C9] bg-[#166CA5] px-4 py-6 [box-shadow:0px_4px_70px_rgba(19,130,201,0.7)] lg:max-w-5xl">
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
          <div className="relative flex h-24 w-fit items-center justify-start">
            <div className="text-white">
              <h1 className="zeinFont text-8xl font-black">403</h1>
            </div>
          </div>

          <div className="-mt-7 mb-2 flex translate-y-2">
            <p className="zeinFont text-2xl font-bold text-white">
              <span>Forbidden</span>
            </p>
          </div>
        </section>
        <section className="mt-4 flex flex-col items-center">
          <div className="-mt-7 mb-2 flex translate-y-2">
            <p className="text-center text-sm font-normal text-white/70 md:text-sm">
              <span>
                Sorry guys, kamu tidak memiliki izin untuk mengakses halaman
                ini.
              </span>
            </p>
          </div>
        </section>
        <section className="flex flex-col items-center gap-2 px-3 text-white lg:flex-row-reverse lg:justify-center">
          <Link
            href="/"
            className="flex rounded-lg border border-[#184A97] bg-[#156EB7] px-4 py-3 text-center text-sm font-semibold [box-shadow:0px_7px_10px_rgba(0,0,0,0.25)]"
          >
            Kembali ke Beranda
          </Link>
        </section>
      </main>

      <div className="absolute bottom-0 md:bottom-2 text-[10px] md:text-sm">
        <MiniFooter />
      </div>
    </div>
  );
}
