"use client";

import Link from "next/link";
import Input from "../elements/Input";
import Button from "../elements/Button";
import Divider from "../elements/Divider";
export default function Signup() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* LEFT BRAND SIDE */}
      <div className="hidden md:flex flex-col justify-between bg-black text-white p-12">
        <h1 className="text-3xl font-bold">SHOP.CO</h1>

        <div>
          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            CREATE YOUR
            <br />
            STYLE
            <br />
            ACCOUNT
          </h2>

          <p className="text-gray-300">
            Join thousands of customers discovering their perfect outfits every
            day.
          </p>
        </div>

        <p className="text-sm text-gray-400">© 2024 SHOP.CO</p>
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-2">Create Account</h2>

          <p className="text-gray-500 mb-6">Start shopping with us</p>

          <form className="space-y-4">
            <Input label="Full Name" placeholder="Enter your name" />

            <Input label="Email" type="email" placeholder="Enter email" />

            <Input
              label="Password"
              type="password"
              placeholder="Create password"
            />

            <Button
              type="submit"
              fullWidth
              className="bg-black text-white hover:bg-gray-900 py-3 rounded-lg"
            >
              Create Account
            </Button>
          </form>
          <Divider />
          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-black hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
