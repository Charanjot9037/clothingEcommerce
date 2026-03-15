"use client";
import { useState } from "react";
import Link from "next/link";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Divider from "../elements/Divider";

export default function Login() {

  const [form, setForm] = useState({
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

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    console.log(data);

    if (res.ok) {
      alert("Login successful");

   
      localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);
   
      window.location.href = "/";
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-between bg-black text-white p-12">
        <h1 className="text-3xl font-bold">SHOP.CO</h1>

        <div>
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            FIND CLOTHES
            <br />
            THAT MATCH
            <br />
            YOUR STYLE
          </h2>

          <p className="text-gray-300">
            Browse through our diverse range of fashion products and discover
            outfits that perfectly match your style.
          </p>
        </div>

        <p className="text-sm text-gray-400">© 2024 SHOP.CO</p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>

          <p className="text-gray-500 mb-6">Login to continue shopping</p>

          <form className="space-y-4" onSubmit={handleSubmit}>

            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
            />

            <Button
              type="submit"
              fullWidth
              className="bg-black text-white hover:bg-gray-900 py-3 rounded-lg"
            >
              Login
            </Button>

          </form>

          <Divider />

          <p className="text-sm text-gray-500 text-center mt-6">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-black hover:underline"
            >
              Sign Up
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}