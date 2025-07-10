/* eslint-disable react/react-in-jsx-scope */
import Footer from "@/components/Footer/page";
import NavbarLogin from "@/components/NavbarLogin/page";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import Image from "next/legacy/image";

export default function DetailPaymentPage() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavbarLogin />
      <p className="mx-2 my-3 mb-15 flex flex-row items-center justify-start gap-2 text-2xl font-semibold text-white">
        <Image src={IconsArrowLeft} alt="icons-arrow-left" />
        <span>Detail Pembayaran</span>
      </p>
      <main className="top-0 right-0 bottom-0 left-0 mt-auto mb-auto flex flex-col sm:mb-auto md:mb-auto">
        <section className="flex flex-col items-center justify-center gap-5">
          <div className="my-5 flex w-1/2 flex-col items-center justify-center rounded-md bg-white py-10">
            <div className="flex w-3/4 justify-between">
              <div className="text-2xl font-semibold">Pendapatan</div>
              <div className="text-lg font-medium">
                No. Validasi : 00001100320250001
              </div>
            </div>
            <div className="my-5 mb-5 flex w-3/4 justify-between">
              <div className="text-lg font-medium text-[#393939]">
                <span>Pendapatan :</span>
              </div>
              <div>
                <span className="text-nowrap text-[#393939]">
                  Rp. 5.000.000
                </span>
              </div>
            </div>

            <div className="my-2.5 flex w-3/4 justify-between">
              <div className="text-lg font-normal text-[#393939]">
                <span>Total Pendapatan yang dihasilkan : </span>
              </div>
              <div>
                <span className="text-nowrap text-[#393939]">
                  Rp. 5.000.000
                </span>
              </div>
            </div>
            <div className="my-2.5 flex w-3/4 justify-between">
              <div className="text-lg font-normal text-[#393939]">
                <span>Total Potongan Pajak : </span>
              </div>
              <div>
                <span className="text-nowrap text-[#393939]">-Rp.5000</span>
              </div>
            </div>
            <div className="my-2.5 flex w-3/4 justify-between">
              <div className="text-lg font-normal text-[#393939]">
                <span>Komisi yang Dibayarkan : </span>
              </div>
              <div>
                <span className="text-nowrap text-[#393939]">
                  Rp. 5.000.000
                </span>
              </div>
            </div>

            <div className="flex w-3/4 justify-between rounded-md bg-[#0881AB] px-2 py-2">
              <div className="text-2xl font-bold text-white">
                <span>Pendapatan :</span>
              </div>
              <div className="text-2xl font-bold text-white">
                <span>Rp. 4.580.900</span>
              </div>
            </div>
          </div>
          <div className="my-5 flex w-1/2 flex-col items-center rounded-md bg-white py-10">
            <div className="flex w-3/4 justify-between">
              <div className="text-2xl font-semibold">Total Pembayaran</div>
              <div className="text-lg font-normal">
                Referensi ID : 00001100320250001
              </div>
            </div>

            <div className="my-5 flex w-3/4 justify-between rounded-md bg-[#0881AB] px-2 py-2">
              <div className="text-2xl font-bold text-white">
                <span>Dibayarkan :</span>
              </div>
              <div className="text-2xl font-bold text-white">
                <span>Rp. 4.580.900</span>
              </div>
            </div>
            <div className="my-2 flex w-3/4 flex-row gap-2 text-lg font-medium text-[#393939]">
              <span>Metode Pembayaran :</span>
              <span>Bank BCA</span>
            </div>
            <div className="my-2 flex w-3/4 flex-row gap-2 text-lg font-medium text-[#393939]">
              <span>Metode Pembayaran :</span>
              <span>Waktu Penyelesaian Pembayaran : 12-03-2025 16:00:00</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
