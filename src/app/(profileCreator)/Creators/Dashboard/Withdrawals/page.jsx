/* eslint-disable react/react-in-jsx-scope */
import Footer from "@/components/Footer/page";
import NavbarLogin from "@/components/NavbarLogin/page";
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import { Dropdown, DropdownItem } from "flowbite-react";
import Image from "next/legacy/image";

export default function WithdrawPage() {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavbarLogin />
      <main className="mx-5 flex flex-col gap-10 sm:mb-50 md:mb-70 lg:mb-90 xl:mb-100">
        <section className="my-8 flex flex-row items-center gap-3">
          <Image
            src={IconsArrowLeft}
            width={38}
            height={38}
            alt="icons-arrow-left"
          />
          <p className="text-2xl font-semibold text-white">
            Informasi Penarikan detail bank penarikan
          </p>
        </section>
        <section className="my-8 grid grid-cols-2 gap-6.5">
          <div className="my-3 flex flex-col">
            <div className="my-2 mt-5 text-2xl font-bold text-white">
              Penarikan Saldo
            </div>
            <div className="my-5 grid grid-cols-3 items-center">
              <div className="text-lg text-[#979797]">Nominal</div>
              <div className="col-span-2 w-full">
                <input
                  placeholder="Rp.000"
                  className="w-full rounded-lg border border-white px-2 py-1.5 text-white placeholder:text-[#979797]"
                />
              </div>
            </div>
            <div className="my-5 grid grid-cols-3 items-center">
              <div className="text-lg text-[#979797]">Saldo Dapat Ditarik</div>
              <div className="col-span-2 w-full">
                <input
                  placeholder="Rp.1.000.000"
                  className="w-full rounded-lg border border-white px-2 py-1.5 text-white placeholder:text-[#979797]"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-flow-row">
            <div className="my-3 mb-5 text-xl font-bold text-white">
              <span>Informasi Bank</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-[#979797]">Nama Bank</div>
              <div className="col-span-2 grid grid-cols-2 rounded-lg border border-gray-500">
                <div className="mx-2 flex justify-start">
                  <input
                    className="py-2 text-white placeholder:text-[#979797]"
                    placeholder="Bank"
                    disabled
                  />
                </div>
                <div className="mx-2 flex justify-end">
                  <Dropdown inline>
                    <DropdownItem>Mandiri</DropdownItem>
                    <DropdownItem>BRI</DropdownItem>
                    <DropdownItem>BCA</DropdownItem>
                    <DropdownItem>BNI</DropdownItem>
                    <DropdownItem>CIMB Niaga</DropdownItem>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className="my-2 grid grid-cols-3 gap-2">
              <div className="text-[#979797]">Nama Lengkap Rekening</div>
              <div className="col-span-2">
                <input
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-gray-500 px-2 py-2 text-white placeholder:text-[#979797]"
                />
              </div>
            </div>
            <div className="my-2 grid grid-cols-3 gap-2">
              <div className="text-[#979797]">Nomor Rekening Bank</div>
              <div className="col-span-2">
                <input
                  type="number"
                  placeholder="0001909-009980-00000"
                  className="w-full rounded-lg border border-gray-500 px-2 py-2 text-white placeholder:text-[#979797]"
                />
              </div>
            </div>
            <div className="mx-2 my-2 font-medium">
              <span className="font-medium text-white">
                Mohon isi data ini dengan valid. Kesalahan transfer akibat salah
                data bukan menjadi tanggung jawab Gate Plus. Gate Plus
                mengambil, 90% biaya platform.
              </span>
            </div>
            <div className="my-3 flex justify-center rounded-lg bg-[#0E5BA8]">
              <button className="px-2 py-2 font-medium text-white">
                Konfirmasi Perubahan Email
              </button>
            </div>
          </div>
        </section>
        <section className="my-8 grid grid-cols-6">
          <div className="flex flex-col">
            <div className="my-5 flex justify-center">
              <span className="text-[#979797]">Periode Validasi</span>
            </div>
            <div className="my-2 flex justify-center">
              <span className="text-white">10-03-2025 18:00</span>
            </div>
            <div className="my-2 flex justify-center">
              <span className="text-white">10-03-2025 18:00</span>
            </div>
            <div className="my-2 flex justify-center">
              <span className="text-white">10-03-2025 18:00</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="my-5 flex justify-center">
              <span className="text-[#979797]">
                Total Komisi yang Dibayarkam(Rp)
              </span>
            </div>
            <div className="my-2 flex justify-center text-white">5.000.000</div>
            <div className="my-2 flex justify-center text-white">5.000.000</div>
            <div className="my-2 flex justify-center text-white">5.000.000</div>
          </div>
          <div className="flex flex-col">
            <div className="my-5 flex justify-center">
              <span className="text-[#979797]">Metode Pembayaran</span>
            </div>
            <div className="my-2 flex justify-center text-white">Mandiri</div>
            <div className="my-2 flex justify-center text-white">BCA</div>
            <div className="my-2 flex justify-center text-white">BRI</div>
          </div>
          <div className="flex flex-col">
            <div className="my-5 flex justify-center">
              <span className="text-[#979797]">Status Pembayaran</span>
            </div>
            <div className="my-2 flex justify-center">
              <span className="flex w-fit rounded-lg bg-green-400 px-2.5 py-0.5 text-sm text-white">
                Sudah Dibayar
              </span>
            </div>
            <div className="my-2 flex justify-center">
              <span className="flex w-fit rounded-lg bg-yellow-400 px-2.5 py-0.5 text-sm text-white">
                Diproses
              </span>
            </div>
            <div className="my-2 flex justify-center">
              <span className="flex w-fit rounded-lg bg-red-400 px-2.5 py-0.5 text-sm text-white">
                Gagal
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="my-5 flex justify-center">
              <span className="text-[#979797]">Waktu Pembayaran</span>
            </div>
            <div>
              <span className="my-2 flex justify-center text-white">
                12-03-2025
              </span>
            </div>
            <div>
              <span className="my-2 flex justify-center text-white">
                12-03-2025
              </span>
            </div>
            <div>
              <span className="my-2 flex justify-center text-white">
                12-03-2025
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="my-5 flex justify-center">
              <span className="text-[#979797]">Aksi</span>
            </div>
            <div className="text-blue-400">
              <span className="my-2 flex justify-center">Lihat Rincian</span>
            </div>
            <div className="text-blue-400">
              <span className="my-2 flex justify-center">Lihat Rincian</span>
            </div>
            <div className="text-blue-400">
              <span className="my-2 flex justify-center">Lihat Rincian</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
