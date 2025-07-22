import React from "react";
import emptyWorkCreator from "@@/icons/empty-work-creator.svg";
import Image from "next/image";

export default function WorkInProgress() {
  return (
    <div className="mt-15 flex flex-col md:mt-24">
      <div className="col-span-full flex w-full flex-col items-center">
        {/* Image */}
        <div className="relative h-[280px] w-[230px] md:h-[400px] md:w-[330px]">
          <Image
            src={emptyWorkCreator}
            alt="belum ada karya"
            fill
            priority
            className="object-cover object-center"
          />
        </div>
        {/* Text */}
        <div className="flex flex-col items-center p-4 text-white">
          <h3 className="zeinFont text-center text-3xl font-bold">
            Konten Lagi On Progress!
          </h3>
          <p className="montserratFont text-center text-sm">
            Sedang disiapin nih, cek lagi nanti buat yang seru-seru!
          </p>
        </div>
      </div>      
    </div>
  );
}
