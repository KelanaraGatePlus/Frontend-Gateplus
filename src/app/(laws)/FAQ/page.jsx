import Footer from "@/components/Footer/MainFooter";
import Navbar from "@/components/Navbar/page";
import iconArrow from "@@/icons/icon-arrow.svg";
import iconEmail from "@@/icons/icons-email.svg";
import iconSupport from "@@/icons/icons-support.svg";
import Image from "next/legacy/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/* eslint-disable react/react-in-jsx-scope */
export default function PageFAQ() {
  return (
    <div className="flex h-screen max-h-fit w-full flex-col">
      <Navbar />
      <main className="mt-24 mb-10 flex w-full gap-6 px-10 md:mt-32 lg:gap-3">
        <section className="w-full flex-3 px-5 text-white">
          <div className="mb-5 rounded-2xl border border-white text-white">
            <input
              type="search"
              placeholder="Masukan kata kunci Pencarian"
              className="w-full rounded-full py-1.5 ps-6 pe-3 placeholder:text-gray-400"
            />
          </div>

          <div className="my-5">
            <p className="mb-3 font-semibold text-gray-400">Pendaftaran</p>
            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="my-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Bagaimana saya bisa mendaftar ?
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="my-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Bagaimana saya menonaktifkan akun ?
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="my-5">
            <p className="mb-3 font-semibold text-gray-400">
              Subscription & Payment
            </p>
            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="my-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Apakah subscribers bisa memberikan Tip?
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="my-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Ada berapa metode pembayaran yang didukung?
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="my-5">
            <p className="mb-3 font-semibold text-gray-400">Kreator</p>
            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="my-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Apa itu Kreator ?
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="y-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Cara menjadi Kreator
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
          <div className="my-5">
            <p className="mb-3 font-semibold text-gray-400">Kreator</p>
            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="my-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Apa itu Kreator ?
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="y-2 rounded-md border border-white">
                    <AccordionTrigger className="px-2 font-semibold text-balance">
                      Cara menjadi Kreator
                    </AccordionTrigger>
                    <AccordionContent className="text-white">
                      <div className="mx-5">
                        <p className="mb-2 text-[8px]">
                          Diubah pada: Wed, 1 Mar, 2025 pada 5:50 PM
                        </p>
                        <p className="text-xl font-extralight">
                          Payment gateway adalah sistem teknologi yang
                          memfasilitasi transaksi pembayaran online,
                          menghubungkan pembeli dengan penjual dan lembaga
                          keuangan, memastikan keamanan dan kemudahan dalam
                          bertransaksi.
                        </p>
                      </div>
                      <div className="mx-3 mt-3 flex flex-row gap-4 text-[9px]">
                        <p>Apakah jawaban ini bermanfaat ?</p>
                        <p className="text-blue-400">Ya</p>
                        <p className="text-blue-400">Tidak</p>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex justify-center font-normal text-white">
              Pertanyaan dan feedback bisa dikirimkan melalui kontak dibawah ini
            </p>
            <button className="flex w-full flex-row content-center justify-center rounded-md border border-[#156EB7] py-2 font-semibold">
              <div>
                <Image alt="icons-support" height={20} src={iconSupport} />
              </div>
              <div className="mx-2 my-1 items-center">Hubungi Kami</div>
            </button>
            <button className="flex w-full flex-row content-center justify-center rounded-md border border-[#156EB7] py-2 font-semibold">
              <div>
                <Image alt="icons-support" height={20} src={iconEmail} />
              </div>
              <div className="mx-2 my-1 items-center">Email Kami</div>
            </button>
          </div>
        </section>

        <section className="hidden w-full flex-1 md:flex">
          <div className="h-fit w-full rounded-md bg-[#013544]">
            <div className="mx-5 flex flex-col">
              <p className="mt-2 flex justify-center font-semibold text-white">
                List FAQ sering di Klik
              </p>
              <div className="flex flex-row justify-between py-3 text-white">
                <div className="">Pendaftaran Akun</div>
                <div className="">
                  <Image src={iconArrow} alt="icons-arrow" priority />
                </div>
              </div>
              <div className="flex flex-row justify-between py-3 text-white">
                <div className="">Pembayaran</div>
                <div className="">
                  <Image src={iconArrow} alt="icons-arrow" priority />
                </div>
              </div>
              <div className="flex flex-row justify-between py-3 text-white">
                <div className="">Subscribers</div>
                <div className="">
                  <Image src={iconArrow} alt="icons-arrow" priority />
                </div>
              </div>
              <div className="flex flex-row justify-between py-3 text-white">
                <div className="">Kreator</div>
                <div className="">
                  <Image src={iconArrow} alt="icons-arrow" priority />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
