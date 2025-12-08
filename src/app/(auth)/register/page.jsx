"use client";
import React, { useState } from "react";
import FormRegister from '@/components/Form/AuthForm/FormRegister/page';
import logo from "@@/logo/logoGate+/logo-header-register.svg";
import Image from "next/image";

export default function RegisterPage() {
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    return (
        <div className="flex min-h-screen min-w-screen items-center justify-center px-4">
            <main className="flex h-full w-full max-w-lg flex-col rounded-lg border-[#1382C9] bg-[#135B8E] px-4 py-6 [box-shadow:0px_4px_70px_rgba(19,130,201,0.5)]">
                <section className="flex flex-col">
                    <div className="relative ml-2 flex h-24 w-fit items-center justify-start">
                        <div className="scale-125">
                            <Image
                                src={logo}
                                alt="logo-gateplus"
                                priority
                                width={128}
                                height={64}
                                className="object-contain"
                                aria-label="logo-gateplus-loginPage"
                            />
                        </div>
                    </div>

                    <div className="-mt-6 mb-3 flex translate-y-2">
                        <p className="montserratFont my-2.5 text-sm font-normal text-[#1DBDF5]">
                            <span>Create an account</span>
                        </p>
                    </div>
                </section>
                <section className="">
                    {isError && (
                        <div className="mb-2 flex items-center space-x-2 rounded-lg border border-red-600 bg-red-800 px-4 py-3 text-xs font-medium text-red-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                                />
                            </svg>
                            <p className="flex flex-wrap">
                                {error?.data?.message || "Failed to Register"}
                            </p>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="mb-2 flex items-center space-x-2 rounded-lg border border-green-600 bg-green-800 px-4 py-3 text-xs font-medium text-green-200">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex h-5 max-h-5 min-h-5 w-5 max-w-5 min-w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <p>Registered Successfully!</p>
                        </div>
                    )}

                    <FormRegister
                        setIsError={setIsError}
                        setError={setError}
                        setIsSuccess={setIsSuccess}
                    />
                </section>
            </main>
        </div>
    );
}