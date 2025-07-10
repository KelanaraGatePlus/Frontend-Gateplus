/* eslint-disable react/react-in-jsx-scope */
import IconsArrowLeft from "@@/icons/icons-dashboard/icons-arrow-left.svg";
import Image from "next/legacy/image";
import Link from "next/link";

export default function BackPreviousPage() {
  return (
    <div className="mx-2.5 mb-2 flex flex-row items-center justify-start gap-2 text-2xl font-bold text-white">
      <Link className="flex items-center" href="/">
        <Image priority src={IconsArrowLeft} alt="icons-arrow-left h-6 w-6" />
      </Link>
      <div className="flex items-center">
        <span>Upload eBook</span>
      </div>
    </div>
  );
}
