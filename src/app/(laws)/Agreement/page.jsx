/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackPage from "@/components/BackPage/page";
import BannerBackground from "@@/Law/banner-background.svg";
import Image from "next/image";

export default function AgreementPage() {
  return (
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
        Persetujuan Kreator Upload Konten
      </h1>
      <main className="mt-4 mb-15 max-w-6xl self-center">
        <section className="montserratFont mt-10 flex max-w-2xl justify-center px-4 xl:max-w-4xl">
          <div className="text-justify text-sm text-white">
            <section className="mb-5">
              <p className="my-0.5 font-bold">
                Persetujuan Unggah Konten Kreator
              </p>
              <p>
                Dengan mengunggah konten ke platform ini, saya sebagai Kreator
                menyatakan bahwa saya telah membaca, memahami, dan menyetujui
                seluruh syarat dan ketentuan berikut:
              </p>
            </section>
            <section>
              <p className="my-1.5 font-bold">1. Kepemilikan dan Hak Cipta</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Saya menjamin bahwa seluruh konten yang saya unggah
                    (termasuk namun tidak terbatas pada video, film, novel,
                    ebook, komik, maupun audio) adalah karya orisinal milik
                    saya sendiri atau saya telah mendapatkan izin legal dari
                    pemegang hak cipta untuk mendistribusikannya di platform
                    ini.
                  </li>
                  <li>
                    Saya bertanggung jawab penuh atas semua bentuk klaim hukum
                    atau sengketa yang mungkin timbul terkait hak cipta,
                    lisensi, atau konten pihak ketiga di dalam karya saya
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">2. Izin Penggunaan Konten</p>
              <div className="mx-3.5">
                <p className="mb-1">
                  Saya memberikan lisensi non-eksklusif kepada platform untuk:
                </p>
                <ul className="ml-5 list-disc">
                  <li>
                    Menayangkan, menyimpan, dan menyebarluaskan konten saya di
                    dalam dan/atau luar platform,
                  </li>
                  <li>
                    Menggunakan konten untuk keperluan promosi, kurasi,
                    rekomendasi pengguna, dan kebutuhan pemasaran lainnya
                  </li>
                  <li>
                    Melakukan monetisasi terhadap konten saya dalam bentuk
                    langganan, pembelian satuan, bundling, iklan, dan metode
                    lainnya yang sah menurut hukum.
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">3. Pendapatan dan Bagi Hasil</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Saya memahami bahwa seluruh pendapatan dari konten yang
                    saya unggah akan dibagi sesuai dengan sistem pembagian
                    hasil (revenue sharing) yang ditentukan oleh platform.
                  </li>
                  <li>
                    Platform akan memotong biaya layanan (platform fee) dari
                    pendapatan bruto sebelum ditransfer ke akun saya sebagai
                    kreator.
                  </li>
                  <li>
                    Pembayaran kepada kreator dilakukan dengan ketentuan
                    minimum saldo dan waktu tunggu penarikan (misalnya 7 hari
                    setelah transaksi final).
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">4. Kewajiban Konten</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    <p>Saya tidak akan mengunggah konten yang mengandung:</p>
                    <ul className="ml-5 list-disc">
                      <li>
                        Unsur pornografi, kekerasan ekstrem, ujaran kebencian,
                        pelecehan, SARA, atau pelanggaran hukum lainnya.
                      </li>
                      <li>
                        Informasi menyesatkan atau palsu yang dapat merugikan
                        pihak lain atau publik.
                      </li>
                    </ul>
                  </li>
                  <li>
                    Platform memiliki hak penuh untuk meninjau,
                    menyembunyikan, menonaktifkan, atau menghapus konten saya
                    tanpa pemberitahuan apabila dianggap melanggar peraturan
                    atau kebijakan platform.
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">5. Tanggung Jawab Hukum</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Saya menyetujui bahwa segala pelanggaran hukum yang timbul
                    dari konten yang saya unggah merupakan tanggung jawab
                    pribadi saya dan saya akan membebaskan platform dari
                    segala bentuk tuntutan hukum atau kerugian yang timbul
                    dari pelanggaran tersebut.
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">6. Data dan Statistik</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Saya mengizinkan platform untuk mengumpulkan data analitik
                    dari konten saya untuk kepentingan pelaporan, peningkatan
                    layanan, dan strategi pengembangan produk.
                  </li>
                  <li>
                    Data ini mencakup jumlah tayangan, interaksi pengguna,
                    hasil pendapatan, dan lainnya.
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">
                7. Penutupan Akun atau Penarikan Konten
              </p>
              <div className="mx-3.5">
                <p className="mb-1">
                  Saya dapat menghapus konten atau menonaktifkan akun saya
                  kapan saja, namun saya memahami bahwa:
                </p>
                <ul className="ml-5 list-disc">
                  <li>
                    Konten yang telah dibeli oleh pengguna tidak dapat dihapus
                    dari akun pengguna,
                  </li>
                  <li>
                    Pendapatan dari konten yang ditarik akan tetap dikalkulasi
                    sesuai periode yang berlaku dan diproses pada waktu
                    penarikan berikutnya.
                  </li>
                </ul>
              </div>
              {/*  */}
              <p className="my-1.5 font-bold">
                8. Penerimaan Syarat dan Ketentuan
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Dengan menekan tombol “Saya Setuju” atau melanjutkan
                    proses unggah konten, saya mengakui bahwa saya telah
                    membaca dan menerima seluruh syarat dan ketentuan di atas.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
