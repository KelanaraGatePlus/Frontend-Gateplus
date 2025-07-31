/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import emptyWorkCreator from "@@/icons/empty-work-creator.svg";
import { BACKEND_URL } from "@/lib/constants/backendUrl";

export default function FilteredEbookContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");

  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEbooks = async () => {
      if (!filter) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${BACKEND_URL}/category/filter?tittle=${encodeURIComponent(filter)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setEbooks(res.data.data.data[0].seriesEbook || []);
      } catch (err) {
        console.error("Gagal fetch ebook:", err);
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, [filter]);

  return (
    <section className="w-full transition-all duration-300 ease-out">
      <div className="my-2 flex h-fit justify-between text-white md:mx-5 lg:-mb-4">
        <span className="text-lg font-bold md:mb-5 md:text-[24px]">
          Hasil untuk kategori: {filter}
        </span>
      </div>

      <div className="flex flex-wrap justify-items-center gap-2 p-0 md:mx-5">
        {!loading && ebooks.length > 0 ? (
          ebooks.map((ebook) => (
            <Link key={ebook.id} href={`/ebooks/detail/${ebook.id}`}>
              <div className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-transparent text-center transition duration-300 hover:scale-105 hover:border-blue-600">
                <div className="absolute bottom-0 left-0 z-10 w-full bg-[#0395BCB2]/80 py-2 text-xs font-bold text-white md:text-sm">
                  Lihat Karya
                </div>

                <div className="relative h-[180px] w-[120px] sm:h-[200px] sm:w-[140px] md:h-[300px] md:w-[210px]">
                  <Image
                    priority
                    src={ebook.coverImageUrl}
                    alt={ebook.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </Link>
          ))
        ) : !loading ? (
          <div className="col-span-full flex w-full flex-col items-center">
            <div className="relative h-[280px] w-[230px] md:h-[225px] md:w-[180px]">
              <Image
                src={emptyWorkCreator}
                alt="belum ada karya"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="flex flex-col items-center p-4 text-white">
              <h3 className="zeinFont text-center text-2xl font-bold">
                Konten Lagi On Progress!
              </h3>
              <p className="montserratFont text-center text-xs">
                Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
              </p>
            </div>
          </div>
        ) : (
          <div className="text-white">Loading...</div>
        )}
      </div>
    </section>
  );
}
