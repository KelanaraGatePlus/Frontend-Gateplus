/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackPage from "@/components/BackPage/page";
import Footer from "@/components/Footer/page";
import Navbar from "@/components/Navbar/page";
import BannerBackground from "@@/Law/banner-background.svg";
import Image from "next/image";
import Link from "next/link";

export default function TermAndConditionPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      <Navbar />
      <div className="mt-16 flex flex-col md:mt-[100px]">
        {/* banner */}
        <div className="absolute -z-10 h-42 w-full overflow-hidden bg-[#1297DC] lg:h-48">
          <Image
            priority
            src={BannerBackground}
            alt="poster-ebook-laut-bercerita"
            className="h-full w-full object-cover object-center"
          />
        </div>

        {/* Back menu */}
        <BackPage />

        <h1 className="zeinFont flex h-20 items-center justify-center px-10 text-center text-4xl font-extrabold text-white lg:h-32 xl:-mt-5 xl:text-5xl">
          Syarat dan Ketentuan Penggunaan Layanan
        </h1>
        <main className="mt-15 mb-15 max-w-6xl self-center">
          <section className="montserratFont flex max-w-2xl justify-center px-4 xl:max-w-4xl">
            <div className="text-left text-sm font-light text-white">
              <section>
                <p className="mb-2 text-[10px] text-gray-500 italic md:text-sm">
                  Terakhir diperbarui: 1 Mei 2025
                </p>
                <p>
                  Syarat dan Ketentuan ini mengatur hak dan kewajiban Kreator
                  dalam menggunakan layanan Gate+ untuk mengunggah,
                  mendistribusikan, dan memperoleh pendapatan dari karya digital
                  mereka. Dengan membuat akun kreator dan mengunggah konten di
                  platform Gate+, Anda menyatakan telah membaca, memahami, dan
                  menyetujui seluruh syarat dan ketentuan berikut:
                </p>
              </section>
              <section>
                <p className="mt-2 mb-1 font-semibold">1. Ketentuan Umum</p>
                <div className="mx-3.5">
                  <ul className="ml-5 list-disc">
                    <li>
                      Kreator wajib terlebih dahulu terdaftar sebagai pengguna
                      (user) pada platform Gate+ sebelum mengajukan diri sebagai
                      kreator.
                    </li>
                    <li>
                      Kreator wajib melengkapi data diri dan profil kreator
                      secara benar dan dapat dipertanggungjawabkan. Kreator
                      bertanggung jawab penuh atas akun dan aktivitas unggahan
                      konten mereka.
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">2. Jenis Konten</p>
                <div className="mx-3.5">
                  <ul className="ml-5 list-disc">
                    <li>
                      <p>
                        Kreator dapat mengunggah jenis konten berupa video
                        film/series, audio, novel/ebook, dan komik.
                      </p>
                      <ul className="ml-5 list-disc">
                        <li>
                          Konten dapat berupa konten gratis atau konten
                          berbayar.
                        </li>
                        <li>
                          Semua konten harus memenuhi standar kualitas, format,
                          dan batas ukuran file yang ditentukan oleh Gate+.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">
                  3. Hak Cipta dan Lisensi
                </p>
                <div className="mx-3.5">
                  <ul className="ml-5 list-disc">
                    <li>
                      <p>Kreator menjamin bahwa konten yang diunggah:</p>
                      <ul className="ml-5 list-disc">
                        <li>Merupakan karya orisinal milik kreator, atau</li>
                        <li>
                          Kreator memiliki hak lisensi dan distribusi yang sah
                          untuk konten tersebut.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <p>
                        Kreator memberikan lisensi non-eksklusif kepada Gate+
                        untuk:
                      </p>
                      <ul className="ml-5 list-disc">
                        <li>Menampilkan konten di platform,</li>
                        <li>Mendistrbusikan secara digital,</li>
                        <li>
                          Menggunakan konten untuk keperluan promosi platform.
                        </li>
                      </ul>
                    </li>
                    <li>
                      Gate+ tidak berhak memperjualbelikan atau mengalihkan
                      kepemilikan konten tanpa persetujuan tertulis dari
                      kreator.
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">
                  4. Monetisasi dan Pembayaran
                </p>
                <div className="mx-3.5">
                  <ul className="ml-5 list-disc">
                    <li>
                      <p>Kreator dapat memperoleh penghasilan dari:</p>
                      <ul className="ml-5 list-disc">
                        <li>Penjualan konten berbayar,</li>
                        <li>Donasi dari pengguna,</li>
                        <li>
                          Program monetisasi tertentu yang disediakan Gate+
                        </li>
                      </ul>
                    </li>
                    <li>
                      Gate+ akan memotong biaya administrasi/platform sesuai
                      persentase yang telah ditetapkan sebelum mentransfer
                      penghasilan ke kreator.
                    </li>
                    <li>
                      Penarikan saldo hanya dapat dilakukan setelah melewati
                      masa tunggu (hold) 7 hari dan mencapai batas minimum saldo
                      yang ditentukan.
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">
                  5. Ketentuan Pelarangan
                </p>
                <div className="mx-3.5">
                  <p>Kreator tidak diperkenankan mengunggah konten yang:</p>
                  <ul className="ml-5 list-disc">
                    <li>
                      Mengandung unsur kekerasan, pornografi, SARA, ujaran
                      kebencian, atau pelanggaran hukum lainnya
                    </li>
                    <li>
                      Melanggar hak cipta atau hak kekayaan intelektual pihak
                      lain.
                    </li>
                    <li>
                      Mengandung iklan atau promosi luar tanpa persetujuan
                      Gate+.
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">
                  6. Moderasi dan Penghapusan Konten
                </p>
                <div className="mx-3.5">
                  <ul className="ml-5 list-disc">
                    <li>
                      <p>
                        Gate+ memiliki hak untuk meninjau, menyembunyikan, atau
                        menghapus konten yang melanggar ketentuan ini tanpa
                        pemberitahuan sebelumnya.
                      </p>
                      <ul className="ml-5 list-disc">
                        <li>
                          Kreator bertanggung jawab penuh atas konsekuensi hukum
                          dari konten yang diunggah.
                        </li>
                        <li>
                          Konten yang dilaporkan oleh pengguna akan melalui
                          proses investigasi sesuai sistem pelaporan Gate+.
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">
                  7. Penangguhan dan Penghentian Akun
                </p>
                <p className="mx-3.5">
                  Gate+ berhak menangguhkan atau menghentikan akun kreator
                  apabila:
                </p>
                <div className="mx-3.5">
                  <ul className="ml-5 list-disc">
                    <li>
                      Terjadi pelanggaran berat terhadap kebijakan platform,
                    </li>
                    <li>
                      Terbukti memanipulasi sistem, penipuan, atau pelanggaran
                      hukum lainnya.
                    </li>
                  </ul>
                </div>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">8. Perubahan Syarat</p>
                <p className="mx-3.5">
                  Gate+ berhak memperbaharui syarat dan ketentuan ini
                  sewaktu-waktu. Kreator akan menerima notifikasi saat perubahan
                  diberlakukan.
                </p>
                {/*  */}
                <p className="mt-2 mb-1 font-semibold">9. Hukum yang berlaku</p>
                <p className="mx-3.5">
                  Syarat dan Ketentuan ini tunduk pada hukum Negara Republik
                  Indonesia. Segala sengketa akan diselesaikan melalui jalur
                  hukum yang berlaku.
                </p>

                {/*  */}
                <p className="mt-2 mb-1 font-semibold">10. Kontak</p>
                <p className="mx-3.5">
                  Jika Anda memiliki pertanyaan terkait ketentuan ini, silakan
                  hubungi:
                </p>
                <ul className="my-1 ml-5 flex flex-col gap-2">
                  <li className="flex gap-2">
                    <div>📧</div>
                    <Link href="mailto:gateplusid@gmail.com">
                      Email: @gateplus.com
                    </Link>
                  </li>
                  <li className="flex gap-2">
                    <div>📞</div>
                    <div>
                      Telepon
                      <Link href="tel:081234567890">
                        Telepon: [Nomor Kontak Resmi Gate+]
                      </Link>
                    </div>
                  </li>
                </ul>
              </section>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
