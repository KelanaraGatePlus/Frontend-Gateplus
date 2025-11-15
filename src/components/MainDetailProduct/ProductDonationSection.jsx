import React, { useState } from "react";
import Link from "next/link";
import { useTipPayment } from "@/hooks/api/paymentAPI";
import SimpleModal from "../Modal/SimpleModal";
import PropTypes from "prop-types";

export default function ProductDonationSection({ creatorId }) {
  const { pay } = useTipPayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);

  const handleModalOpen = (amount) => {
    setAmount(amount);
    setIsModalOpen(true);
  };

  const handleTip = async () => {
    await pay({
      creatorId: creatorId,
      amount: amount
    });

    setIsModalOpen(false);
  };

  return (
    <section className="relative flex w-full flex-col text-white">
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
            onClick={() => handleModalOpen(5000)}
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white hover:cursor-pointer"
          >
            5K
          </button>
          <button
            type="button"
            onClick={() => handleModalOpen(10000)}
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white hover:cursor-pointer"
          >
            10k
          </button>
          <button
            type="button"
            onClick={() => handleModalOpen(25000)}
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white hover:cursor-pointer"
          >
            25k
          </button>
          <button
            type="button"
            onClick={() => handleModalOpen(75000)}
            className="flex-1 rounded-lg bg-[#175BA6] py-2 text-lg font-bold text-white hover:cursor-pointer"
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
        <Link href="/term-and-conditions" className="underline">
          aturan (Syarat & Ketentuan)
        </Link>
        ? Laporkan aja kalau ada yang nggak sesuai ya!{" "}
        <Link href="/feedback" className="underline">
          Laporkan!
        </Link>
      </p>

      <SimpleModal
        title={"Berikan tip kepada creator sebanyak Rp. " + (amount?.toLocaleString() ?? 0) + ",- ?"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleTip}
      />
    </section>
  );
}

ProductDonationSection.propTypes = {
  creatorId: PropTypes.string.isRequired,
};
