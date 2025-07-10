/* eslint-disable react/react-in-jsx-scope */
import logoHome from "@@/icons/logoHome.svg";
import logoFacebook from "@@/logo/logoSosmed/facebook.svg";
import logoInstagram from "@@/logo/logoSosmed/instagram.svg";
import logoGooglePlay from "@@/logo/logoSosmed/platform_google_play.svg";
import logoAppleStore from "@@/logo/logoSosmed/platform_iOs.svg";
import logoTikTok from "@@/logo/logoSosmed/tiktok.svg";
import logoTwitter from "@@/logo/logoSosmed/twitter.svg";
import Link from "next/link";
import Image from "next/legacy/image";
export default function Footer() {
  return (
    <footer className="flex flex-col font-semibold text-white">
      <section className="flex flex-col gap-2 px-2 md:mx-5 md:mb-5.5 md:grid md:grid-rows-2 md:gap-0">
        <div className="flex flex-col gap-2 md:mt-12 md:grid md:h-1/2 md:grid-cols-3 md:gap-4">
          <div className="flex flex-col justify-start rounded-md bg-[#10ADF0] px-2 py-2 md:flex-row md:items-center md:px-0">
            <p className="font-bold md:mx-7">JOIN OUR NEWSLATTER</p>
            <p className="text-sm font-light md:hidden">
              Subscribe news latter to get any update our platform
            </p>
          </div>
          <div className="hidden items-center justify-center rounded-md bg-[#10ADF0] px-2 text-center md:flex">
            <p className="text-sm font-light">
              Subscribe news latter to get any update our platform
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-[#10ADF0] px-2 py-2 md:py-1">
            <div className="flex-5">
              <input
                className="w-full rounded-full border border-white px-3 py-1.5 placeholder:px-2 md:h-full md:py-1"
                type="email"
                placeholder="Email Address"
              />
            </div>
            <div className="flex-2">
              <button className="h-full w-full rounded-full bg-[#156EB7] py-1.5 md:py-1">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:grid md:grid-cols-4 md:gap-4">
          <div className="hidden rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] md:block">
            <div className="mx-7 my-2 flex flex-col gap-2">
              <div className="mt-3 text-sm font-bold">Contact</div>
              <div className="text-sm font-bold">+622-150955747</div>
              <div className="text-sm font-bold">Gateplusid@gmail.com</div>
              <div className="text-sm font-bold">
                XL Axiata Tower, 10th Floor Jl. H. R. Rasuna Said X5 Kav. 11-12
                Kuningan Tim. Kecamatan Setiabudi DKI Jakarta 12950
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] px-4 py-2 md:col-span-2 md:grid md:grid-rows-2 md:gap-0 md:p-0">
            <div className="flex content-center items-center justify-center">
              <Link href={"/"}>
                <Image priority alt="logo-footer" src={logoHome} />
              </Link>
            </div>
            <div className="flex justify-center gap-5 px-4 text-sm sm:text-base md:grid md:grid-cols-4 md:content-center md:items-center md:justify-center md:gap-2 md:p-0">
              <div className="flex justify-center">
                <Link href="/">Home</Link>
              </div>
              <div className="flex justify-center">
                <Link href="/Ebook">Category</Link>
              </div>
              <div className="flex justify-center">
                <Link href="/Tickets">Tickets</Link>
              </div>
              <div className="flex justify-center">
                <Link href="/ReleaseSoon">Release Soon</Link>
              </div>
            </div>
          </div>

          <div className="hidden grid-rows-3 rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] md:grid">
            <div className="flex items-center text-right text-xl font-semibold md:mx-3 md:justify-center lg:mx-5 lg:justify-end">
              Social Media
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Link
                href="https://www.instagram.com/kelanarastudio/"
                target="_blank"
              >
                <div className="flex justify-center">
                  <Image
                    priority
                    className="aspect-auto"
                    height={30}
                    width={30}
                    alt="instagram"
                    src={logoInstagram}
                  />
                </div>
              </Link>
              <Link
                href="https://www.tiktok.com/@kelanara.studio/"
                target="_blank"
              >
                <div className="flex justify-center">
                  <Image
                    priority
                    className="aspect-auto"
                    height={30}
                    width={30}
                    alt="tikTok"
                    src={logoTikTok}
                  />
                </div>
              </Link>
              <Link
                href="https://twitter.com/KelanaraStudio/status/1793580264687575395"
                target="_blank"
                className="pt-1"
              >
                <div className="flex justify-center">
                  <Image
                    priority
                    className="aspect-auto"
                    height={20}
                    width={21}
                    alt="twitter"
                    src={logoTwitter}
                  />
                </div>
              </Link>
              <Link
                href="https://www.facebook.com/profile.php?id=61565976179011"
                target="_blank"
                className="pt-1"
              >
                <div className="flex justify-center">
                  <Image
                    priority
                    className="aspect-auto"
                    height={20}
                    width={20}
                    alt="facebook"
                    src={logoFacebook}
                  />
                </div>
              </Link>
            </div>

            <div className="mx-5 mb-2.5 grid grid-cols-2 items-center gap-2">
              <div className="flex justify-center">
                <Image alt="logo-googlePlay" src={logoGooglePlay} />
              </div>
              <div className="flex justify-center">
                <Image priority alt="logoAppleStore" src={logoAppleStore} />
              </div>
            </div>
          </div>

          {/* Social media & contact for mobile */}
          <div className="flex justify-between gap-4 rounded-md bg-linear-to-t from-[#04475E] to-[#10ADF0] px-4 py-2 md:hidden">
            <div className="flex flex-col items-start gap-1">
              <h4>Contact</h4>
              <p className="text-sm font-light">+622-150955747</p>
              <p className="text-sm font-light">Gateplusid@gmail.com</p>
              <p className="text-sm font-light">
                XL Axiata Tower, 10th Floor Jl. H. R. Rasuna Said X5 Kav. 11-12
                Kuningan Tim. Kecamatan Setiabudi DKI Jakarta 12950
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <h4 className="flex flex-1">Social Media</h4>
              <div className="flex flex-1 items-center justify-between gap-4">
                <Link href={"https://www.instagram.com/kelanarastudio/"}>
                  <div className="flex justify-center">
                    <Image
                      priority
                      className="aspect-auto"
                      height={30}
                      width={30}
                      alt="instagram"
                      src={logoInstagram}
                    />
                  </div>
                </Link>
                <Link href={"https://www.tiktok.com/@kelanara.studio/"}>
                  <div className="flex justify-center">
                    <Image
                      priority
                      className="aspect-auto"
                      height={30}
                      width={30}
                      alt="tikTok"
                      src={logoTikTok}
                    />
                  </div>
                </Link>
                <Link
                  href={
                    "https://twitter.com/KelanaraStudio/status/1793580264687575395"
                  }
                >
                  <div className="flex justify-center">
                    <Image
                      priority
                      className="aspect-auto"
                      height={20}
                      width={21}
                      alt="twitter"
                      src={logoTwitter}
                    />
                  </div>
                </Link>
                <Link
                  href={
                    "https://www.facebook.com/profile.php?id=61565976179011"
                  }
                >
                  <div className="flex justify-center">
                    <Image
                      priority
                      className="aspect-auto"
                      height={20}
                      width={20}
                      alt="facebook"
                      src={logoFacebook}
                    />
                  </div>
                </Link>
              </div>

              <div className="flex h-full flex-2 gap-2">
                <div className="flex justify-center">
                  <Image alt="logo-googlePlay" src={logoGooglePlay} />
                </div>
                <div className="flex justify-center">
                  <Image priority alt="logoAppleStore" src={logoAppleStore} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-5 mt-8 mb-4 flex flex-col gap-2 md:mt-0 md:block">
        <div className="-mb-1 flex justify-center md:hidden">© 2025 GATE+</div>
        <div className="flex flex-row justify-center gap-2">
          <div className="hidden text-sm md:flex">© 2025 GATE+</div>
          <p className="hidden md:flex">|</p>
          <div className="text-center text-sm text-blue-700 underline md:text-base">
            <Link href="/PrivacyPolicy">Privacy policy</Link>
          </div>
          <p>|</p>
          <div className="text-center text-sm text-blue-700 underline md:text-base">
            <Link href="/TermOfService">Terms of services</Link>
          </div>
          <p>|</p>
          <div className="text-center text-sm text-blue-700 underline md:text-base">
            <Link href="/FAQ">Help Center</Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
