import React from "react";
import Link from "next/link";

export default function ProductDonationSection() {
  return (
    <section className="relative flex w-screen flex-col px-4 py-5 text-white md:px-15">
      <div className="w-full rounded-xl bg-[#2f2f2f] p-4 text-white">
        <h3 className="mb-2 text-xl font-bold lg:text-2xl">Sawerkuy!</h3>
        <p className="mb-2 text-justify text-sm lg:text-base">
          Karya ini bisa dinikmati secara gratis, tapi kalau kamu mau, kasih
          &quot;sawer&quot; ke kreator. Dengan donasi, kamu udah bantu kreator
          supaya terus bisa berkarya, kayak hero di dunia anime!
        </p>
        <p className="mb-4 text-justify text-sm lg:text-base">
          Karya ini GRATIS! Tapi kamu boleh kok kasih tip biar kreator hepi 🥰
        </p>

        <div className="mb-2 grid grid-cols-4 gap-2">
          <button
            type="button"
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
          >
            5K
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
          >
            10k
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
          >
            25k
          </button>
          <button
            type="button"
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white"
          >
            75k
          </button>
        </div>
        <button
          type="submit"
          className="w-full flex-1 rounded-lg bg-[#175BA6] py-3 text-lg font-bold text-white lg:py-2"
        >
          Masukan Nominal Sendiri
        </button>
      </div>

      <p className="mt-6 text-center text-base">
        Gimana nih? Apakah konten ini melanggar{" "}
        <Link href="#" className="underline">
          aturan (Syarat & Ketentuan)
        </Link>
        ? Laporkan aja kalau ada yang nggak sesuai ya!{" "}
        <Link href="#" className="underline">
          Laporkan!
        </Link>
      </p>
    </section>
  );
}
