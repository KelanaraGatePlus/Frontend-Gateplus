/* eslint-disable react/react-in-jsx-scope */
import Picture404 from "@@/icons/error-page.svg";
import Image from "next/image";
import Link from "next/link";
import MiniFooter from "@/components/Footer/MiniFooter";

export default function FeedbackSuccessPage() {
  return (
    <div className="montserratFont relative flex min-h-screen flex-col items-center justify-center overflow-clip px-4 md:py-10">
      <main className="mt-6 flex h-full w-full max-w-lg flex-col gap-4 rounded-lg border border-[#1382C9] bg-[#166CA5] px-4 py-10 [box-shadow:0px_4px_70px_rgba(19,130,201,0.7)] md:mt-0 md:px-10 lg:max-w-3xl">
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
          <div className="-mt-3 mb-2 flex translate-y-2">
            <p className="zeinFont text-center text-3xl leading-none font-bold text-white">
              <span>Terima Kasih atas Laporan/Masukan Kamu</span>
            </p>
          </div>
        </section>
        <section className="mt-4 flex flex-col items-center">
          <div className="-mt-7 mb-2 flex translate-y-2">
            <p className="flex max-w-lg flex-col gap-4 text-center text-sm font-normal text-white/70 md:text-sm">
              <span>
                Kami telah menerima informasi yang kamu kirimkan. Tim kami akan
                meninjau laporanmu dan, jika diperlukan, menghubungi kamu untuk
                informasi lebih lanjut.
              </span>
              <span>
                Kami menghargai partisipasimu dalam membantu meningkatkan
                kualitas layanan GatePlus.
              </span>
              <span>Tunggu untuk versi lebih baiknya.</span>
            </p>
          </div>
        </section>
        <section className="flex flex-col items-center gap-2 px-3 text-white md:mt-5 lg:flex-row-reverse lg:justify-center">
          <Link
            href="/"
            className="flex rounded-lg border border-[#184A97] bg-[#156EB7] px-8 py-3 text-center text-base font-semibold [box-shadow:0px_7px_10px_rgba(0,0,0,0.25)]"
          >
            Kembali ke Beranda
          </Link>
        </section>
      </main>

      <div className="bottom-0 mt-10 text-[10px] md:absolute md:text-sm">
        <MiniFooter />
      </div>
    </div>
  );
}
