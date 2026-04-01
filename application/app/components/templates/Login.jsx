"use client";
import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        window.location.href = data.isAdmin ? "/admin" : "/";
      } else {
        alert(data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      setResetSent(true);
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
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-white/80 tracking-wide">New arrivals every week</span>
          </div>

          <h2 className="text-5xl font-extrabold text-white leading-none tracking-tighter mb-5">
            FIND CLOTHES<br />
            THAT MATCH<br />
            <span className="text-gray-300">YOUR STYLE</span>
          </h2>

          <p className="text-sm text-white/40 leading-relaxed max-w-sm">
            Browse our diverse range of fashion-forward products. Curated looks, unbeatable prices.
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 flex gap-10">
          {[["200+", "Brands"], ["2k+", "Products"], ["30k+", "Customers"]].map(([num, label]) => (
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

          {/* ── FORGOT PASSWORD VIEW ── */}
          {forgotMode ? (
            <>
              {!resetSent ? (
                <>
                  <button
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-8 cursor-pointer bg-transparent border-none p-0"
                    onClick={() => setForgotMode(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back to login
                  </button>

                  <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Reset Password</h2>
                  <p className="text-sm text-gray-400 mb-8">Enter your email and we'll send you a reset link.</p>

                  <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold text-sm rounded-xl py-3.5 transition cursor-pointer border-none"
                    >
                      {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    We've sent a reset link to{" "}
                    <span className="font-semibold text-gray-900">{resetEmail}</span>. It may take a minute.
                  </p>
                  <button
                    className="mt-8 text-sm font-semibold text-gray-900 underline underline-offset-2 cursor-pointer bg-transparent border-none"
                    onClick={() => { setForgotMode(false); setResetSent(false); setResetEmail(""); }}
                  >
                    Back to login
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ── LOGIN VIEW ── */
            <>
              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
                  <span className="text-sm font-extrabold text-white">U</span>
                </div>
                <span className="font-bold text-base text-gray-900">Urban.CO</span>
              </div>

              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-1.5">Welcome back</h2>
              <p className="text-sm text-gray-400 mb-9">Sign in to continue shopping</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Email */}
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

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs text-gray-400 hover:text-gray-900 transition-colors cursor-pointer bg-transparent border-none p-0"
                      onClick={() => setForgotMode(true)}
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900/5 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-700 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center"
                    >
                      {showPassword ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl py-4 transition-all cursor-pointer border-none flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                        <path d="M12 2a10 10 0 0110 10" />
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-7">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Google button */}
              <button
                type="button"
                className="w-full bg-white border border-gray-200 hover:border-gray-900 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-900 flex items-center justify-center gap-2.5 transition-all hover:ring-2 hover:ring-gray-900/5 cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-gray-400 mt-8">
                Don't have an account?{" "}
                <Link href="/signup" className="font-bold text-gray-900 underline underline-offset-2 hover:opacity-70 transition-opacity">
                  Sign up
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
