/* eslint-disable react/react-in-jsx-scope */
import logoUsersComment from "@@/AvatarIcons/avatar-face-2.jpg";
import logoHome from "@@/icons/logoHome.svg";
import logoSearch from "@@/logo/logoSearch/nav-search.svg";
import logoLonceng from "@@/logo/logoSosmed/lonceng_fix.svg";
import Image from "next/legacy/image";
import Link from "next/link";

export default function NavbarLogin() {
  return (
    <div>
      <nav className="border-1 border-b-gray-700 bg-green-900 saturate-50">
        <section className="my-3.5 grid grid-cols-3">
          <div className="mx-5 w-1/3 place-items-start">
            <div className="flex justify-center">
              <Image src={logoHome} alt="logo-gate+" priority />
            </div>
          </div>
          <div className="grid grid-cols-5 content-center gap-2 rounded-4xl bg-[#0395BC80] px-5 text-white saturate-150 sm:max-h-screen">
            <div className="">
              <div className="mt-1 flex justify-center rounded-full bg-linear-to-t from-[#0E5BA8] to-[#0395BC] p-2 font-mono font-semibold">
                <Link href="/">Home</Link>
              </div>
            </div>
            <div className="">
              <div className="mt-1 flex justify-center rounded-full from-[#0E5BA8] to-[#0395BC] p-2 font-mono font-semibold hover:bg-linear-to-t">
                Category
              </div>
            </div>
            <div className="">
              <div className="mt-1 flex justify-center rounded-full from-[#0E5BA8] to-[#0395BC] p-2 font-mono font-semibold hover:bg-linear-to-t">
                Ticket
              </div>
            </div>
            <div className="">
              <div className="mt-1 flex justify-center rounded-full from-[#0E5BA8] to-[#0395BC] p-2 font-mono font-semibold hover:bg-linear-to-t">
                Realease
              </div>
            </div>
            <div className="flex-cols flex items-center justify-center gap-1 rounded-3xl bg-blue-300">
              <div className="font-mono font-semibold text-white">Search</div>
              <div className="">
                <Image
                  height={15}
                  src={logoSearch}
                  alt="logo-search"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="mx-10 flex flex-row justify-end gap-5">
            <div className="place-items-end content-center">
              <Image
                priority
                height={30}
                width={27}
                src={logoLonceng}
                alt="logo-lonceng"
              />
            </div>
            <div className="">
              <div className="flex translate-x-1.5 translate-y-1.5 items-center justify-center font-mono font-semibold">
                <Image
                  priority
                  height={40}
                  width={40}
                  alt="logo-comment"
                  className="flex place-content-center rounded-full bg-blue-700 saturate-100"
                  src={logoUsersComment}
                />
              </div>
            </div>
          </div>
        </section>
      </nav>
    </div>
  );
}
