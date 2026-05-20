"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone, Lock, User, LogIn, UserPlus, Loader2, ArrowLeft, Satellite
} from "lucide-react";

/* ── Use the SAME base URL as api.ts ──────────────────── */
const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shambaiq-backend-production.up.railway.app";

export default function FarmerLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      let token = "";

      if (mode === "register") {
        const res = await fetch(`${API}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone_number: phone,
            password: password,
            name: name.trim(),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.detail || `Registration failed (${res.status})`
          );
        }
        const data = await res.json();
        token = data.access_token;
      } else {
        const res = await fetch(`${API}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: phone,
            password: password,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            err.detail || `Login failed (${res.status}). Check your credentials.`
          );
        }
        const data = await res.json();
        token = data.access_token;
      }

      /* Fetch user profile to get the display name */
      let displayName = name.trim() || "Farmer";
      try {
        const meRes = await fetch(`${API}/api/v1/auth/me?token=${token}`);
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.name) displayName = meData.name;
        }
      } catch {
        /* non-critical — proceed with what we have */
      }

      /* Save session cookie (24 hrs) */
      const sessionData = JSON.stringify({
        name: displayName,
        token,
        phone,
      });
      document.cookie = `shambaiq_session=${encodeURIComponent(
        sessionData
      )}; path=/; max-age=86400`;

      router.push("/");
      router.refresh();
    } catch (err: any) {
      /* Distinguish network errors from API errors */
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Cannot reach the server. Please check your internet connection and try again."
        );
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* ─── Hero header ─── */}
      <section className="relative bg-gradient-to-br from-forest-800 via-forest-700 to-[#1e4620] pt-8 pb-20 px-6 text-center grain overflow-hidden">
        {/* Floating orb */}
        <div className="absolute top-6 right-[12%] w-40 h-40 rounded-full bg-gold-500/[0.06] blur-3xl animate-float" />

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-cream-400 hover:text-gold-300 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to ShambaIQ
        </Link>

        <div className="w-16 h-16 mx-auto bg-gold-500/15 border border-gold-500/25 rounded-full flex items-center justify-center mb-5">
          <User className="text-gold-400" size={30} strokeWidth={1.5} />
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-100 mb-2">
          {mode === "login" ? "Welcome Back" : "Start Your Journey"}
        </h1>
        <p className="text-cream-400/80 text-sm max-w-[300px] mx-auto leading-relaxed">
          {mode === "login"
            ? "Track your farm, save your reports and grow smarter."
            : "Register your farm and get hyper-local soil and crop advice."}
        </p>
      </section>

      {/* ─── Auth card ─── */}
      <main className="flex-1 px-4 sm:px-6 -mt-12 mb-20 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-forest-900/8 p-7 sm:p-8 border border-cream-200">
          {/* Tab switcher */}
          <div className="flex bg-cream-100 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === "login"
                  ? "bg-forest-800 text-white shadow-lg"
                  : "text-soil-400 hover:text-forest-700"
              }`}
            >
              <LogIn size={16} /> Login
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                mode === "register"
                  ? "bg-forest-800 text-white shadow-lg"
                  : "text-soil-400 hover:text-forest-700"
              }`}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name field (register only) */}
            {mode === "register" && (
              <div>
                <label className="text-sm font-bold text-forest-800 mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300"
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="text-sm font-bold text-forest-800 mb-2 block">
                Phone Number
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678"
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-bold text-forest-800 mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-70 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 text-base"
            >
              {loading && (
                <Loader2 size={18} className="animate-spin" />
              )}
              {mode === "login" ? "Log In" : "Create Account"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                className="w-full text-center text-sm font-semibold text-soil-400 hover:text-gold-600 py-2 transition-colors"
              >
                Forgot Password?
              </button>
            )}
          </form>
        </div>

        {/* Trust signal */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-soil-400">
          <Satellite size={12} />
          <span>Your data is stored securely on ShambaIQ servers</span>
        </div>
      </main>
    </div>
  );
}
