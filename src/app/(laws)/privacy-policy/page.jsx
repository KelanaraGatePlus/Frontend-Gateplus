/* eslint-disable react/react-in-jsx-scope */
"use client";
import BackButton from "@/components/BackButton/page";
import BannerBackground from "@@/Law/banner-background.svg";
import Image from "next/image";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="mt-16 flex flex-col md:mt-[100px]">
      {/* banner */}
      <div className="absolute -z-10 h-42 w-full overflow-hidden bg-[#1297DC] lg:h-48">
        <Image
          priority
          src={BannerBackground}
          alt="banner-privacy-policy"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Back menu */}
      <BackButton />

      <h1 className="zeinFont flex h-20 items-center justify-center px-10 text-center text-4xl font-extrabold text-white lg:h-32 xl:-mt-5 xl:text-5xl">
        Privacy Policy Gate+
      </h1>

      <main className="mt-10 mb-15 max-w-6xl self-center">
        <section className="montserratFont flex max-w-2xl justify-center px-4 xl:max-w-4xl">
          <div className="text-left text-sm font-light text-white">
            <section>
              <p className="mb-2 text-[10px] text-gray-500 italic md:text-sm">
                Terakhir diperbarui: 1 Mei 2025
              </p>

              {/* 1. Pengumpulan Informasi Pribadi */}
              <p className="text-left text-base font-semibold">
                1. Pengumpulan Informasi Pribadi
              </p>
              <p className="mx-3.5">
                Kami mengumpulkan informasi pribadi yang secara sukarela
                diberikan oleh Pengguna, termasuk namun tidak terbatas pada:
              </p>

              <div className="mx-4 my-2">
                <p className="font-semibold">a. Data Identitas</p>
                <ul className="ml-5 list-inside list-disc">
                  <li>Nama lengkap</li>
                  <li>Alamat surat elektronik (email)</li>
                  <li>Nomor telepon</li>
                  <li>Tanggal lahir (jika diperlukan)</li>
                </ul>
              </div>

              <div className="mx-4 my-2">
                <p className="font-semibold">b. Data Akun</p>
                <ul className="ml-5 list-inside list-disc">
                  <li>Nama pengguna (username)</li>
                  <li>Kata sandi yang disimpan secara terenkripsi</li>
                  <li>Foto profil dan konten yang diunggah</li>
                </ul>
              </div>

              <div className="mx-4 my-2">
                <p className="font-semibold">
                  c. Data Kreator (jika berlaku)
                </p>
                <ul className="ml-5 list-inside list-disc">
                  <li>Deskripsi profil kreator</li>
                  <li>Kategori konten</li>
                  <li>Informasi pembayaran</li>
                </ul>
              </div>

              <div className="mx-4 my-2">
                <p className="font-semibold">d. Data Transaksi</p>
                <ul className="ml-5 list-inside list-disc">
                  <li>Rincian pembelian dan donasi</li>
                  <li>Nominal dan metode pembayaran</li>
                  <li>Tanggal dan waktu transaksi</li>
                </ul>
              </div>

              <div className="mx-4 my-2">
                <p className="font-semibold">e. Data Teknis Otomatis</p>
                <ul className="ml-5 list-inside list-disc">
                  <li>Alamat IP</li>
                  <li>Jenis perangkat, sistem operasi, dan browser</li>
                  <li>Lokasi geografis (jika diaktifkan)</li>
                  <li>Cookie dan pelacak aktivitas digital lainnya</li>
                </ul>
              </div>

              {/* 2. Penggunaan Informasi Pribadi */}
              <p className="mt-4 text-left text-base font-semibold">
                2. Penggunaan Informasi Pribadi
              </p>
              <p className="ml-5">
                Data yang dikumpulkan akan digunakan untuk tujuan berikut:
              </p>
              <ul className="my-1 ml-10 list-disc">
                <li>
                  Memberikan akses dan pengalaman pengguna terhadap layanan
                  streaming
                </li>
                <li>Memfasilitasi transaksi dan pembayaran</li>
                <li>Mengelola akun dan preferensi Pengguna</li>
                <li>Menyediakan layanan dukungan pelanggan</li>
                <li>
                  Melakukan analisis untuk pengembangan produk dan layanan
                </li>
                <li>
                  Mengirimkan pemberitahuan terkait akun atau promosi yang
                  relevan
                </li>
              </ul>

              {/* 3. Pengungkapan kepada Pihak Ketiga */}
              <p className="mt-4 text-left text-base font-semibold">
                3. Pengungkapan kepada Pihak Ketiga
              </p>
              <p className="ml-5">
                Informasi pribadi dapat diungkapkan kepada:
              </p>
              <ul className="my-1 ml-10 list-disc">
                <li>
                  Penyedia layanan pembayaran (misalnya Midtrans) untuk
                  pemrosesan transaksi
                </li>
                <li>Mitra layanan teknis dan infrastruktur digital</li>
                <li>
                  Otoritas hukum atau lembaga penegak hukum sesuai ketentuan
                  perundang-undangan yang berlaku
                </li>
                <li>
                  Kami tidak akan menjual atau menyewakan informasi pribadi
                  kepada pihak ketiga tanpa persetujuan Pengguna, kecuali
                  sebagaimana diwajibkan oleh hukum.
                </li>
              </ul>

              {/* 4. Penyimpanan dan Keamanan Data */}
              <p className="mt-4 text-left text-base font-semibold">
                4. Penyimpanan dan Keamanan Data
              </p>
              <p className="ml-5">
                Kami menyimpan informasi pribadi di infrastruktur digital yang
                dikelola secara aman dan menerapkan tindakan perlindungan data
                sesuai standar industri, termasuk:
              </p>
              <ul className="my-1 ml-10 list-disc">
                <li>Enkripsi data</li>
                <li>Firewall dan kontrol akses terbatas</li>
                <li>Pemantauan sistem secara berkala</li>
              </ul>

              {/* 5. Hak-Hak Subjek Data */}
              <p className="mt-4 text-left text-base font-semibold">
                5. Hak-Hak Subjek Data
              </p>
              <p className="ml-5">Pengguna Berhak Untuk:</p>
              <ul className="my-1 ml-10 list-disc">
                <li>Mengakses dan memperbarui data pribadi</li>
                <li>Menarik persetujuan atas pemrosesan data</li>
                <li>Menghapus akun dan meminta penghapusan data</li>
                <li>Menolak atau menghapus cookie dari perangkat</li>
              </ul>

              {/* 6. Privasi Anak-Anak */}
              <p className="mt-4 text-left text-base font-semibold">
                6. Privasi Anak-Anak
              </p>
              <p className="ml-5">
                Layanan kami tidak ditujukan untuk individu berusia di bawah
                13 tahun. Kami tidak secara sengaja mengumpulkan data dari
                anak-anak di bawah usia tersebut. Jika kami mengetahui bahwa
                kami telah mengumpulkan data anak-anak tanpa izin orang tua
                atau wali yang sah, data tersebut akan segera kami hapus.
              </p>

              {/* 7. Transfer Data Internasional */}
              <p className="mt-4 text-left text-base font-semibold">
                7. Transfer Data Internasional
              </p>
              <p className="ml-5">
                Pengguna memahami dan menyetujui bahwa data pribadi dapat
                dipindahkan dan/atau disimpan di luar yurisdiksi negara
                domisili Pengguna, tergantung lokasi server dan mitra layanan
                kami.
              </p>

              {/* 8. Perubahan Kebijakan Privasi */}
              <p className="mt-4 text-left text-base font-semibold">
                8. Perubahan Kebijakan Privasi
              </p>
              <p className="ml-5">
                Kami berhak untuk mengubah Kebijakan ini sewaktu-waktu guna
                menyesuaikan dengan ketentuan hukum yang berlaku atau
                kebutuhan operasional kami. Setiap perubahan akan diumumkan
                secara resmi di Platform dan berlaku sejak tanggal yang
                ditentukan.
              </p>

              {/* 9. Informasi Kontak */}
              <p className="mt-4 text-left text-base font-semibold">
                9. Informasi Kontak
              </p>
              <p className="ml-5">
                Apabila Anda memiliki pertanyaan atau permintaan terkait
                Kebijakan Privasi ini, silakan hubungi kami melalui:
              </p>
              <ul className="my-1 ml-5 flex flex-col gap-2">
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
