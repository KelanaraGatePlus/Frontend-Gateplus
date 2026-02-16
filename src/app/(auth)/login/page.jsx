"use client";
import React, { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import logo from "@@/logo/logoGate+/logo-header-login.svg";
import FormLogin from "@/components/Form/AuthForm/FormLogin/page";
import AccountStatusModal from "@/components/Modal/AccountStatusModal";
import Link from "next/link";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // ✅ STATE UNTUK ACCOUNT STATUS (SUSPENDED / BANNED)
    const [accountStatus, setAccountStatus] = useState(null);

    // ✅ CHECK URL PARAMS FOR SUSPEND/BAN STATUS FROM OAUTH CALLBACK
    useEffect(() => {
        const status = searchParams.get("status");
        const reason = searchParams.get("reason");
        const until = searchParams.get("until");

        console.log("🔍 URL Params:", { status, reason, until });

        if (status === "banned") {
            console.log("🚫 Setting BANNED modal");
            setAccountStatus({
                type: "BANNED",
                reason: decodeURIComponent(reason || "Pelanggaran terhadap kebijakan platform."),
            });
        } else if (status === "suspended") {
            console.log("⏸️ Setting SUSPENDED modal");
            setAccountStatus({
                type: "SUSPENDED",
                reason: decodeURIComponent(reason || "Pelanggaran terhadap kebijakan komunitas."),
                suspendedUntil: until,
            });
        }
    }, [searchParams]);

    // Debug accountStatus changes
    useEffect(() => {
        if (accountStatus) {
            console.log("✅ Account Status State Updated:", accountStatus);
        }
    }, [accountStatus]);

    // === AUTO DISMISS ALERT AFTER 1 MINUTE ===
    useEffect(() => {
        let timer;

        if (isError || isSuccess || forgotPasswordSuccess) {
            timer = setTimeout(() => {
                setIsError(false);
                setIsSuccess(false);
                setForgotPasswordSuccess(false);
                setErrorMessage("");
                setError(null);
            }, 60000);
        }

        return () => clearTimeout(timer);
    }, [isError, isSuccess, forgotPasswordSuccess]);

    return (
        <>
            <div className="flex min-h-screen min-w-screen items-center justify-center px-4">
                <main className="flex h-full w-full max-w-lg flex-col rounded-lg border-[#1382C9] bg-[#135B8E] px-4 py-6 [box-shadow:0px_4px_70px_rgba(19,130,201,0.5)]">
                    <Link href="/" className="flex flex-col">
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

                        <div className="-mt-6 mb-2.5 flex translate-y-2">
                            <p className="montserratFont my-2 text-sm font-normal text-[#1DBDF5]">
                                Welcome back, you&apos;ve been missed
                            </p>
                        </div>
                    </Link>

                    <section>
                        {/* ERROR ALERT */}
                        {isError && (
                            <div className="mb-2 flex items-center space-x-2 rounded-lg border border-red-600 bg-red-800 px-4 py-3 text-xs font-medium text-red-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                                <p>
                                    {errorMessage ||
                                        error?.data?.error ||
                                        "An error occurred. Please try again."}
                                </p>
                            </div>
                        )}

                        {/* SUCCESS LOGIN */}
                        {isSuccess && (
                            <div className="mb-2 flex items-center space-x-2 rounded-lg border border-green-600 bg-green-800 px-4 py-3 text-xs font-medium text-green-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                                <p>Login Berhasil!</p>
                            </div>
                        )}

                        {/* FORGOT PASSWORD SUCCESS */}
                        {forgotPasswordSuccess && (
                            <div className="mb-2 flex items-center space-x-2 rounded-lg border border-green-600 bg-green-800 px-4 py-3 text-xs font-medium text-green-200">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
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
                                <p>
                                    Permintaan perubahan password telah dikirim ke email Anda.
                                </p>
                            </div>
                        )}

                        {/* FORM LOGIN */}
                        <FormLogin
                            setIsError={setIsError}
                            setError={setError}
                            setIsSuccess={setIsSuccess}
                            setForgotPasswordSuccess={setForgotPasswordSuccess}
                            setErrorMessage={setErrorMessage}
                            setAccountStatus={setAccountStatus}
                        />
                    </section>
                </main>
            </div>

            {/* ✅ PROFESSIONAL MODAL */}
            {accountStatus && (
                <AccountStatusModal
                    type={accountStatus.type}
                    reason={accountStatus.reason}
                    suspendedUntil={accountStatus.suspendedUntil}
                    onClose={() => {
                        console.log("🔄 Closing modal and cleaning URL");
                        setAccountStatus(null);
                        // ✅ CLEAN URL PARAMS
                        router.replace("/login");
                    }}
                />
            )}
        </>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}