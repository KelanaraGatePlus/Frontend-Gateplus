/* eslint-disable react/react-in-jsx-scope */
"use client";

import { useLoginUserMutation } from "@/hooks/api/userSliceAPI";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { getSession } from "next-auth/react";

export default function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isSuccess, isError, error }] =
    useLoginUserMutation();

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      console.log(session);
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login({ email, password }).unwrap();
      localStorage.setItem("token", user.data.token);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (err) {
      console.error("Failed to login: ", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-h-max max-w-max flex-col gap-3 px-12"
    >
      <label hidden className="font-mono text-[16px] text-black">
        Email
      </label>
      <input
        className="rounded-md bg-slate-100 p-2 py-1 font-mono text-black placeholder:text-[13px] hover:bg-amber-200"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Username or Email"
      />
      <label hidden className="font-mono text-[16px] text-black">
        Password
      </label>
      <input
        className="rounded-md bg-slate-100 p-2 py-1 font-mono text-black placeholder:text-[13px] hover:bg-amber-200"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <div className="my-1 flex flex-row justify-between">
        <div className="mr-3 font-mono text-[10px] text-[#1DBDF5] hover:text-blue-500">
          <Link href="/Register">Create a new account</Link>
        </div>
        <div className="font-mono text-[10px] text-[#1DBDF5] hover:text-blue-500">
          <Link href="/ForgotPassword">Forgot Password?</Link>
        </div>
      </div>
      <div className="my-5 flex flex-col gap-5 text-white">
        <button
          className="rounded-md bg-blue-600 p-2 py-1.5 font-mono text-xl hover:bg-blue-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
        <button
          className="rounded-md bg-blue-400 p-2 py-1.5 font-mono text-xl hover:bg-blue-500"
          type="button"
        >
          Sign In with Google
        </button>
        {isError && (
          <div className="font-mono text-[10px] text-red-500">
            {error.message}
          </div>
        )}
        {isSuccess && (
          <div className="font-mono text-[10px] text-green-500">
            Login successful!
          </div>
        )}
      </div>
    </form>
  );
}
