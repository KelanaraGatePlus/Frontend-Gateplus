"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ReCAPTCHA from "react-google-recaptcha";

/*[--- THIRD PARTY LIBRARIES ---]*/
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "use-debounce";

/*[--- SCHEMAS ---]*/
import { registerSchema } from "@/lib/schemas/registerSchema";

/*[--- API HOOKS & FEATURES ---]*/
import { useCheckUserAvailabilityQuery, useLoginUserMutation, useRegisterUserMutation } from "@/hooks/api/userSliceAPI";
import useTogglePassword from "@/lib/features/useTogglePassword";

/*[--- UI COMPONENTS ---]*/
import IconsEyeClose from "@@/icons/icons-eyes-close.svg";
import IconsEyeOpen from "@@/icons/icons-eyes-open.svg";
import LogoGoogle from "@@/logo/logoGoogle/icons-google.svg";

export default function FormRegister({ setIsError, setError, setIsSuccess }) {
  const router = useRouter();
  const { isVisible: isPasswordVisible, toggle: toggleShowPassword } = useTogglePassword();
  const { isVisible: isConfirmPasswordVisible, toggle: toggleShowConfirmPassword } = useTogglePassword();
  const [registerUser, { isLoading, isSuccess, isError, error }] = useRegisterUserMutation();
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [captchaToken, setCaptchaToken] = useState(null);

  // eslint-disable-next-line no-undef
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const {
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onBlur",
  });

  const [debouncedUsername] = useDebounce(watch("username"), 500);
  const [debouncedEmail] = useDebounce(watch("email"), 500);

  const { data: userAvailable } = useCheckUserAvailabilityQuery(
    { type: "username", value: debouncedUsername },
    { skip: !debouncedUsername }
  );

  const { data: emailAvailable } = useCheckUserAvailabilityQuery(
    { type: "email", value: debouncedEmail },
    { skip: !debouncedEmail }
  );

  useEffect(() => {
    setIsError(isError);
    setError(error);
    setIsSuccess(isSuccess);
  }, [isError, error, isSuccess]);

  useEffect(() => {
    if (userAvailable?.exists) {
      setFormError("username", { message: "Username already taken" });
    }
  }, [userAvailable]);

  useEffect(() => {
    if (emailAvailable?.exists) {
      setFormError("email", { message: "Email already taken" });
    }
  }, [emailAvailable]);

  const onSubmit = async (data) => {
    if (!captchaToken) {
      setFormError("root", { message: "Please complete the reCAPTCHA." });
      return;
    }

    try {
      // kirim captchaToken ke backend
      const payload = { ...data, captchaToken };

      await registerUser(payload).unwrap();

      const loginResponse = await loginUser(data).unwrap();
      if (loginResponse?.data?.token) {
        router.push(`/otp?token=${loginResponse.data.token}`);
        return;
      }
      reset();
    } catch (err) {
      console.error("Register failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-2">
      <div className="relative w-full">
        <input
          type="text"
          id="username"
          {...register("username")}
          className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
          placeholder="Username"
        />
        <label htmlFor="username" className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500">
          Username
        </label>
        {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
      </div>

      <div className="relative w-full">
        <input
          type="email"
          id="email"
          {...register("email")}
          className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
          placeholder="Email"
        />
        <label htmlFor="email" className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500">
          Email
        </label>
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col">
        <div className="relative flex w-full">
          <input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            {...register("password")}
            placeholder="Password"
            className="peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500"
          />
          <label htmlFor="password" className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500">
            Password
          </label>
          <div className="absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2 cursor-pointer" onClick={toggleShowPassword}>
            <Image src={isPasswordVisible ? IconsEyeOpen : IconsEyeClose} alt="Show Password" className="object-cover" />
          </div>
        </div>
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col">
        <div className="relative flex w-full">
          <input
            id="confirmPassword"
            type={isConfirmPasswordVisible ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Confirm Password"
            className={`peer montserratFont w-full rounded-lg bg-white px-3 pt-6 pb-2 text-sm font-normal placeholder-transparent focus:outline-blue-500`}
          />
          <label htmlFor="confirmPassword" className="absolute top-2 left-3 text-xs text-gray-500 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-blue-500">
            Confirm Password
          </label>
          <div className="absolute top-1/2 right-3 h-6 w-6 -translate-y-1/2 cursor-pointer" onClick={toggleShowConfirmPassword}>
            <Image src={isConfirmPasswordVisible ? IconsEyeOpen : IconsEyeClose} alt="Show Confirm Password" className="object-cover" />
          </div>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
      </div>

      <span className="zeinFont flex justify-between text-xl text-[#1DBDF5]">
        <div>
          Already registered? <Link href="/login" className="text-left font-bold">Log in</Link>
        </div>
      </span>

      <ReCAPTCHA
        sitekey={recaptchaSiteKey}
        onChange={(token) => setCaptchaToken(token)}
        onExpired={() => setCaptchaToken(null)}
        className="my-2"
      />

      {
        errors.root && <p className="text-xs text-red-500">{errors.root.message}</p>
      }

      <button disabled={isLoading || isLoginLoading} className="zeinFont mt-4 cursor-pointer rounded-lg border border-[#156EB7] bg-[#156EB7] py-2 text-2xl font-bold text-white hover:border-white/70 hover:bg-[#156EB7CC]">
        {isLoading || isLoginLoading ? "Registering..." : "Sign Up"}
      </button>

      <button type="button" className="zeinFont flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-blue-500 bg-blue-900 py-2 text-2xl font-bold text-white hover:bg-blue-950 md:rounded-xl">
        <Image src={LogoGoogle} alt="Logo-Google" />
        <p>Sign Up with Google</p>
      </button>
    </form>
  );
}

FormRegister.propTypes = {
  setIsError: PropTypes.func.isRequired,
  setIsSuccess: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
