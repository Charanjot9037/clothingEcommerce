"use client";
import { useState } from "react";
import Link from "next/link";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Divider from "../elements/Divider";

export default function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      alert("Account created successfully!");
    } else {
      alert(data.message);
    }
  };

  
  return (
  <div className="min-h-screen flex bg-gray-50">

    {/* LEFT PANEL (same as login) */}
    <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] shrink-0 relative overflow-hidden bg-gray-950">

      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 border border-white/5" />
      <div className="absolute bottom-20 -left-14 w-56 h-56 rounded-full bg-emerald-400/5 border border-emerald-400/10" />

      <div className="flex items-center gap-2 relative z-10">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
          <span className="text-base font-extrabold text-gray-950">U</span>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Urban.CO</span>
      </div>

      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-white/80 tracking-wide">
            Join thousands of shoppers
          </span>
        </div>

        <h2 className="text-5xl font-extrabold text-white leading-none tracking-tighter mb-5">
          CREATE YOUR<br />
          ACCOUNT &<br />
          <span className="text-gray-300">START SHOPPING</span>
        </h2>

        <p className="text-sm text-white/40 leading-relaxed max-w-sm">
          Discover curated fashion collections tailored to your style.
        </p>
      </div>

      <div className="relative z-10 flex gap-10">
        {[["200+", "Brands"], ["2k+", "Products"], ["30k+", "Customers"]].map(([num, label]) => (
          <div key={label}>
            <p className="text-2xl font-bold text-white">{num}</p>
            <p className="text-xs text-white/40">{label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 flex items-center justify-center p-5 lg:p-10">
      <div className="w-full max-w-md">

    
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
            <span className="text-sm font-extrabold text-white">U</span>
          </div>
          <span className="font-bold text-base text-gray-900">Urban.CO</span>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1.5">
          Create account
        </h2>
        <p className="text-sm text-gray-400 mb-3">
          Sign up to start shopping
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
            />
          </div>

       
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
            />
          </div>

      
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              required
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
            />
          </div>

  
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.99] text-white font-semibold text-sm rounded-xl py-4 transition-all cursor-pointer border-none flex items-center justify-center gap-2 mt-1"
          >
            Create Account
          </button>

        </form>

        
        <div className="flex items-center gap-3 my-7">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-gray-900 underline underline-offset-2 hover:opacity-70 transition-opacity"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  </div>
);
 
}