import React from "react";
import Link from "next/link";

export default function MiniFooter() {
  return (
    <section className="mx-5 mb-6 flex flex-col items-center gap-2 md:mt-0 md:block lg:mb-2">
      <div className="flex self-auto text-white md:hidden">© 2025 GATE+</div>
      <div className="flex flex-row justify-center gap-2 text-white">
        <div className="hidden md:flex">© 2025 GATE+</div>
        <p className="hidden md:flex">|</p>
        <div className="text-center text-blue-700 underline">
          <Link href="/PrivacyPolicy">Privacy policy</Link>
        </div>
        <p>|</p>
        <div className="text-center text-blue-700 underline">
          <Link href="/TermOfService">Terms of services</Link>
        </div>
        <p>|</p>
        <div className="text-center text-blue-700 underline">
          <Link href="/FAQ">Help Center</Link>
        </div>
      </div>
    </section>
  );
}
