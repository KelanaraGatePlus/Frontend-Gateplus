/* eslint-disable react/react-in-jsx-scope */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRegisterUserMutation } from "../../hooks/api/userSliceAPI";

export default function FormRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [register, { isLoading, isSuccess, isError, error }] =
    useRegisterUserMutation();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await register({ username, email, password }).unwrap();
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (err) {
      console.error("Failed to register: ", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="my-2 flex flex-col gap-2 bg-amber-400"
    >
      <label hidden className="font-mono text-[16px] text-black">
        Username
      </label>
      <input
        className="rounded-md bg-slate-100 p-2 py-1 font-mono text-black placeholder:text-[13px] hover:bg-amber-200"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="Username"
      />
      <label hidden className="font-mono text-[16px] text-black">
        Email
      </label>
      <input
        className="rounded-md bg-slate-100 p-2 py-1 font-mono text-black placeholder:text-[13px] hover:bg-amber-200"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder="Email"
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
      <label hidden className="font-mono text-[16px] text-black">
        Password Confirmation
      </label>
      <input
        className="rounded-md bg-slate-100 p-2 py-1 font-mono text-black placeholder:text-[13px] hover:bg-amber-200"
        name="passwordConfirmation"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Password Confirmation"
      />
      <div className="mx-5 flex flex-row justify-between">
        <div className="flex flex-row px-3 font-mono text-[10px] text-[#1DBDF5]">
          <p>
            Already have an account?
            <Link className="hover:text-blue-500" href="/Login">
              Log In
            </Link>
          </p>
        </div>
      </div>
      <div className="my-5 flex flex-col gap-3 py-5 text-white">
        <button
          className="rounded-md bg-blue-600 p-2 py-1.5 font-mono text-xl hover:bg-blue-700"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
        <button
          className="rounded-md bg-blue-400 p-2 py-1.5 font-mono text-xl hover:bg-blue-500"
          type="button"
        >
          Sign Up with Google
        </button>
      </div>
      {isError && (
        <p className="text-red-500">
          {error?.data?.message || "Failed to register"}
        </p>
      )}
      {isSuccess && <p className="text-green-500">Registration successful!</p>}
    </form>
  );
}
