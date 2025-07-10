/* eslint-disable react/react-in-jsx-scope */
import IconsPriceContent from "@@/icons/upload-content/icons-price.svg";
import IconsUploadFilm from "@@/icons/upload-content/icons-upload-content.svg";
import IconsUploadProcces from "@@/icons/upload-content/icons-upload-procces.svg";
import IconsUploadContentPart from "@@/icons/upload-content/icons-upload-section1.svg";
import { TextareaAutosize } from "@mui/material";
import Image from "next/legacy/image";
import Link from "next/link";

export default function FormUploadContentPage() {
  return (
    <form onSubmit="">
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Judul
        </div>
        <div className="col-span-3">
          <input
            placeholder="Judul Film"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Deskripsi
        </div>
        <div className="col-span-3">
          <TextareaAutosize
            aria-label="maximum height"
            minRows={5}
            maxRows={6}
            placeholder="Sinopsis"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Durasi
        </div>
        <div className="col-span-3">
          <input
            placeholder="00minute"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Genre
        </div>
        <div className="col-span-3">
          <input
            placeholder="Genre"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Rumah Produksi
        </div>
        <div className="col-span-3">
          <input
            placeholder="Place"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Sutradara
        </div>
        <div className="col-span-3">
          <input
            placeholder="Sutradara Name"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Produser
        </div>
        <div className="col-span-3">
          <input
            placeholder="Produser Name"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Penulis
        </div>
        <div className="col-span-3">
          <input
            placeholder="Penulis Name"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Pemain
        </div>
        <div className="col-span-3">
          <input
            placeholder="Full Name"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Tahun Rilis
        </div>
        <div className="col-span-3">
          <input
            placeholder="Years"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Bahasa
        </div>
        <div className="col-span-3">
          <input
            placeholder="Bahasa yang digunakan"
            className="w-full rounded-md border border-gray-500 px-2 py-2 text-white saturate-50 placeholder:text-[#979797] focus-visible:placeholder:invisible"
          />
        </div>
      </section>
      <section className="my-3.5 mt-5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Pembatasan
        </div>
        <div className="col-span-3 flex flex-row">
          <div className="mr-4 flex flex-row">
            <input className="mx-1.5" type="radio" />
            <p className="text-[#F5F5F5]">SU</p>
          </div>
          <div className="mx-4 flex flex-row">
            <input className="mx-1.5" type="radio" />
            <p className="text-[#F5F5F5]">R13+</p>
          </div>
          <div className="mx-4 flex flex-row">
            <input className="mx-1.5" type="radio" />
            <p className="text-[#F5F5F5]">D17+</p>
          </div>
          <div className="mx-4 flex flex-row">
            <input className="mx-1.5" type="radio" />
            <p className="text-[#F5F5F5]">D21+</p>
          </div>
        </div>
      </section>
      <section className="my-3.5 mt-5 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Upload Format Keterangan
        </div>
        <div className="col-span-3">
          <p className="font-light text-[#F5F5F5] italic">
            Upload konten dengan minimum resolusi 1080p Konten video di potong
            dengan kapasitas maksimal 5gb per file nama konten diurutkan dengan
            format (namaFilm-1.mov, namaFilm-2.mov, dst) konten di upload dengan
            format .mov, .mp4
          </p>
        </div>
      </section>
      <section className="my-3.5 mt-10 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Film Upload
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-wrap">
            <Image src={IconsUploadFilm} alt="Icons-Upload-Film" />
            <Image src={IconsUploadProcces} alt="Icons-Upload-Procces" />
            <Image
              src={IconsUploadContentPart}
              alt="Icons-Upload-Content-Part"
            />
            <Image
              src={IconsUploadContentPart}
              alt="Icons-Upload-Content-Part/01"
            />
            <Image
              src={IconsUploadContentPart}
              alt="Icons-Upload-Content-Part/02"
            />
          </div>
          <div>
            <p className="font-light text-white italic">
              maks upload per content 5gb, please make part while uploading and
              naming ascending number
            </p>
          </div>
        </div>
      </section>
      <section className="my-3.5 mt-10 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Trailer Upload
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-wrap">
            <Image src={IconsUploadFilm} alt="Icons-Upload-Film" />
            <Image
              src={IconsUploadProcces}
              alt="Icons-Upload-Procces-Trailler"
            />
            <Image
              src={IconsUploadContentPart}
              alt="Icons-Upload-Trailler-Part"
            />
          </div>
          <div>
            <p className="font-light text-white italic">
              maks upload per content 5gb, please make part while uploading and
              naming ascending number
            </p>
          </div>
        </div>
      </section>
      <section className="my-3.5 mt-10 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Thumbnail
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-wrap">
            <Image src={IconsUploadFilm} alt="Icons-Upload-Film-Thumbnail" />
            <Image
              src={IconsUploadProcces}
              alt="Icons-Upload-Procces-Thumbnail"
            />
            <Image
              src={IconsUploadContentPart}
              alt="Icons-Upload-Content-Part-Thumbnail"
            />
          </div>
          <div>
            <p className="font-light text-white italic">
              Format thumbnail its 2x4 with maks file
            </p>
          </div>
        </div>
      </section>
      <section className="my-3.5 mt-10 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Poster Input
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-wrap">
            <Image src={IconsUploadFilm} alt="icons-upload-001" />
            <Image src={IconsUploadProcces} alt="icons-upload-002" />
            <Image src={IconsUploadContentPart} alt="icons-upload-poster" />
          </div>
          <div>
            <p className="font-light text-white italic">
              Format psoter its 2x4 with maks file
            </p>
          </div>
        </div>
      </section>
      <section className="my-3.5 mt-10 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Banner Input
        </div>
        <div className="col-span-3 flex flex-col">
          <div className="flex flex-wrap">
            <Image src={IconsUploadFilm} alt="icons-upload-001" />
            <Image src={IconsUploadProcces} alt="icons-upload-002" />
            <Image src={IconsUploadContentPart} alt="icons-upload-poster" />
          </div>
          <div>
            <p className="font-light text-white italic">
              Format banner its 2x4 with maks file
            </p>
          </div>
        </div>
      </section>
      <section className="my-3.5 mt-10 grid grid-cols-4">
        <div className="flex items-center px-2 text-xl text-[#979797]">
          Price
        </div>
        <div className="col-span-3 flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-row items-center justify-center gap-5 rounded-md border border-gray-500 bg-[#F5F5F540] py-2">
              <div>
                <Image src={IconsPriceContent} alt="icons-price-content" />
              </div>
              <div>
                <span className="text-lg font-normal text-white">10 rb</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-5 rounded-md border border-gray-500 bg-[#F5F5F540] py-2">
              <div>
                <Image src={IconsPriceContent} alt="icons-price-content" />
              </div>
              <div>
                <span className="text-lg font-normal text-white">20 rb</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-5 rounded-md border border-gray-500 bg-[#F5F5F540] py-2">
              <div>
                <Image src={IconsPriceContent} alt="icons-price-content" />
              </div>
              <div>
                <span className="text-lg font-normal text-white">50 rb</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 rounded-md border border-gray-500 bg-[#F5F5F540] py-2 saturate-25">
            <div>
              <Image src={IconsPriceContent} alt="icons-price-contents" />
            </div>
            <div>
              <span className="text-lg text-white">
                Lihat Simulasi Pendapatan
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-3">
              <input type="radio" />
              <Link href="/TermAndCondition">
                <p className="mb-1 text-balance text-white underline hover:text-blue-500">
                  Terms and Condition
                </p>
              </Link>
            </div>
            <div className="flex flex-row items-center gap-3">
              <input type="radio" />
              <Link href="/Agreement">
                <p className="mb-1 text-balance text-white underline hover:text-blue-500">
                  Agreement
                </p>
              </Link>
            </div>
          </div>
          <div className="flex justify-center rounded-md border border-gray-500 bg-[#0E5BA8] py-2">
            <button className="flex flex-row gap-3">
              <div>
                <Image src={IconsPriceContent} alt="icons-price-content-001" />
              </div>
              <p className="flex items-center justify-center text-lg text-white">
                <span>Upload Content</span>
              </p>
            </button>
          </div>
        </div>
      </section>
    </form>
  );
}
