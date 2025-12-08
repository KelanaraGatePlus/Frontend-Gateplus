import Link from "next/link";

/* eslint-disable react/react-in-jsx-scope */
export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4">
      <main className="flex h-full w-full max-w-lg flex-col rounded-lg bg-[#184A9780] px-4 pt-0 pb-6">
        <section className="flex flex-col">
          <div className="relative flex h-24 w-fit items-center justify-start">
            <div className="text-white">
              <h1 className="zeinFont text-5xl font-black">Check Email</h1>
            </div>
          </div>

          <div className="-mt-7 mb-6 flex translate-y-2">
            <p className="montserratFont text-sm font-normal text-[#1DBDF5]">
              <span>
                We have sent confirmation link to your email, please follow
                email instruction to verify your account
              </span>
            </p>
          </div>
        </section>
        <div className="flex w-full flex-col gap-2">
          <Link
            href="/login"
            className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-center text-2xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]"
          >
            Log in
          </Link>
        </div>
      </main>
    </div>
  );
}
