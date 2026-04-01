"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[45%] shrink-0 relative overflow-hidden bg-gray-950">

        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 border border-white/5" />
        <div className="absolute bottom-20 -left-14 w-56 h-56 rounded-full bg-emerald-400/5 border border-emerald-400/10" />

        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <span className="text-base font-extrabold text-gray-950">U</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Urban.CO</span>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-5xl font-extrabold text-white leading-none tracking-tighter mb-5">
            Reset Your<br />
            Password<br />
            <span className="text-gray-300">Securely</span>
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-sm">
            Enter your new password to regain access. Your data remains safe with us.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10">
          {[
            ["200+", "Brands"],
            ["2k+", "Products"],
            ["30k+", "Customers"]
          ].map(([num, label]) => (
            <div key={label}>
              <p className="text-2xl font-bold text-white">{num}</p>
              <p className="text-xs text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-md">

          {success ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-black mb-4">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-6">You can now log in with your new password.</p>
              <Link
                href="/login"
                className="w-full text-center bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition inline-block"
              >
                Login
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-sm text-gray-400 mb-8">
                Enter your new password below.
              </p>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-sm rounded-xl py-3.5 transition cursor-pointer"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}