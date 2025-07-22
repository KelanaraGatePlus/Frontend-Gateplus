import FormForgotPassword from "@/components/FormForgotPassword/page";

/* eslint-disable react/react-in-jsx-scope */
export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen min-w-screen items-center justify-center px-4 md:py-10">
      <main className="flex h-full w-full max-w-lg flex-col rounded-lg bg-[#184A9780] px-6 pt-2 pb-8">
        <section className="flex flex-col">
          <div className="relative flex h-24 w-fit items-center justify-start">
            <div className="text-white">
              <h1 className="zeinFont text-4xl font-black md:text-5xl">
                Forgot Password
              </h1>
            </div>
          </div>

          <div className="-mt-7 mb-6 flex translate-y-2">
            <p className="montserratFont text-sm font-normal text-[#1DBDF5] md:text-sm">
              <span>We have sent OTP Code to Your mail, please check</span>
            </p>
          </div>
        </section>
        <FormForgotPassword />
      </main>
    </div>
  );
}
