/* eslint-disable react/react-in-jsx-scope */
import BackPage from "@/components/BackPage/page";
import BannerBackground from "@@/Law/banner-background.svg";
import Image from "next/image";
import Link from "next/link";

export default function TermOfServicePage() {
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
        Syarat dan Ketentuan Layanan Gate+
      </h1>
      <main className="mt-15 mb-15 max-w-6xl self-center">
        <section className="montserratFont flex max-w-2xl justify-center px-4 xl:max-w-4xl">
          <div className="text-left text-sm font-light text-white">
            <section>
              <p className="my-0.5 font-bold">
                Persetujuan Unggah Konten Kreator
              </p>
              <p>
                Dokumen ini menjelaskan ketentuan hukum yang mengikat antara
                Pengguna (“Anda”) dan PT Gate Plus Digital (selanjutnya
                disebut “Kami”, “Gate+”) dalam hal penggunaan layanan
                streaming video, audio, komik, novel, dan ebook yang
                disediakan melalui situs web dan/atau aplikasi resmi kami
                (“Platform”).
              </p>
              <p>
                Dengan mendaftar, mengakses, atau menggunakan Platform, Anda
                dianggap telah membaca, memahami, dan menyetujui seluruh isi
                dari Syarat dan Ketentuan ini.
              </p>
            </section>
            <section>
              <p className="mt-2 mb-1 font-semibold">1. Ketentuan Umum</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Pengguna harus berusia minimal 13 tahun, atau memiliki
                    izin dari orang tua/wali.
                  </li>
                  <li>
                    Dengan mendaftar akun, Anda menyatakan bahwa semua
                    informasi yang Anda berikan adalah benar dan dapat
                    dipertanggungjawabkan.
                  </li>
                  <li>
                    Gate+ berhak menolak pendaftaran atau menghapus akun atas
                    pelanggaran terhadap ketentuan ini.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                2. Hak dan Kewajiban Pengguna
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Pengguna memiliki hak untuk mengakses konten yang tersedia
                    sesuai dengan hak akses masing-masing (gratis/berbayar)
                  </li>
                  <li>
                    Pengguna dilarang menyalin, mereproduksi, atau
                    menyebarluaskan konten di luar platform tanpa izin
                    tertulis dari Gate+ atau pemilik konten.
                  </li>
                  <li>
                    Pengguna bertanggung jawab penuh atas keamanan akun dan
                    aktivitas yang terjadi di dalamnya.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                3. Penggunaan Layanan untuk Kreator
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Pengguna dapat mendaftar sebagai Kreator setelah memiliki
                    akun User dan mengisi form pendaftaran Kreator secara
                    lengkap dan valid.
                  </li>
                  <li>
                    Kreator berhak mengunggah karya asli yang tidak melanggar
                    hak cipta dan tidak mengandung unsur SARA, pornografi,
                    kekerasan ekstrem, atau pelanggaran hukum lainnya.
                  </li>
                  <li>
                    Gate+ berhak meninjau dan menurunkan konten yang dianggap
                    melanggar hukum atau kebijakan internal platform.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">4. Sistem Pembayaran</p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Pembayaran dilakukan melalui mitra pembayaran resmi kami
                    (contoh: Midtrans).
                  </li>
                  <li>
                    Untuk konten berbayar, pengguna akan dikenakan tarif
                    sesuai harga konten, termasuk PPN jika berlaku.
                  </li>
                  <li>
                    Fee platform akan secara otomatis dipotong dari pendapatan
                    kreator sebelum penarikan saldo dilakukan.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                5. Donasi dan Apresiasi
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Pengguna dapat memberikan donasi/saweran kepada kreator
                    melalui fitur yang disediakan.
                  </li>
                  <li>
                    Gate+ tidak bertanggung jawab atas hasil donasi yang
                    diberikan secara sukarela oleh pengguna.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                6. Penarikan Saldo Kreator
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Penarikan saldo hanya dapat dilakukan jika saldo telah
                    memenuhi batas minimum dan berusia minimal 7 hari sejak
                    transaksi terjadi.
                  </li>
                  <li>
                    Gate+ berhak menahan dana sementara jika ditemukan
                    indikasi pelanggaran atau penipuan.
                  </li>
                  <li>
                    Pendapatan kreator mungkin dikenakan pajak sesuai dengan
                    ketentuan perundang-undangan yang berlaku.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                7. Penghentian dan Penangguhan Akun
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Gate+ berhak menangguhkan atau menghentikan akun pengguna
                    secara permanen jika ditemukan pelanggaran terhadap
                    kebijakan ini.
                  </li>
                  <li>
                    Gate+ dapat menghapus konten tanpa pemberitahuan jika
                    terbukti melanggar hukum atau hak kekayaan intelektual.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                8. Batasan dan Tanggung Jawab
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Gate+ tidak bertanggung jawab atas kehilangan data,
                    gangguan layanan, atau kerugian akibat penggunaan
                    platform.
                  </li>
                  <li>
                    Kami tidak menjamin bahwa semua konten akan selalu
                    tersedia atau bebas dari kesalahan teknis.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                9. Perubahan Layanan dan Ketentuan
              </p>
              <div className="mx-3.5">
                <ul className="ml-5 list-disc">
                  <li>
                    Gate+ berhak mengubah, menambah, atau menghentikan fitur
                    layanan kapan saja
                  </li>
                  <li>
                    Perubahan pada Syarat dan Ketentuan akan diumumkan secara
                    resmi, dan pengguna dianggap menyetujui perubahan jika
                    tetap menggunakan layanan setelahnya.
                  </li>
                </ul>
              </div>

              <p className="mt-2 mb-1 font-semibold">
                10. Hukum yang Berlaku
              </p>
              <p className="ml-5">
                Syarat dan Ketentuan ini diatur berdasarkan hukum Republik
                Indonesia. Setiap perselisihan akan diselesaikan secara
                musyawarah, dan jika tidak tercapai, maka akan diselesaikan di
                Pengadilan Negeri [Kota Domisili].
              </p>

              <p className="mt-4 text-left text-base font-semibold">
                11. Kontak Kami
              </p>
              <p className="ml-5">
                Jika Anda memiliki pertanyaan terkait Syarat dan Ketentuan
                ini, Anda dapat menghubungi kami:
              </p>
              <ul className="my-1 ml-5 flex flex-col gap-1">
                <li className="flex gap-2">
                  <div>📧</div>
                  <Link href="mailto:gateplusid@gmail.com">
                    Email: @gateplus.com
                  </Link>
                </li>
                <li className="flex gap-4">
                  <div>📍</div>
                  <div>Alamat Kantor: [Alamat Resmi Perusahaan]</div>
                </li>
                <li className="flex gap-2">
                  <div>🌐</div>
                  <div>
                    Website:{" "}
                    <Link href="https://www.gateplusid.com">
                      https://www.gateplusid.com
                    </Link>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
