"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Phone, Lock, User, LogIn, UserPlus, Loader2, ArrowLeft, Satellite,
  MapPin, Mail, KeyRound, CheckCircle2, ChevronLeft,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

const KENYA_COUNTIES = [
  "Baringo", "Bomet", "Bungoma", "Busia", "Elgeyo Marakwet",
  "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga",
  "Kisii", "Kisumu", "Kitui", "Kwale", "Laikipia",
  "Lamu", "Machakos", "Makueni", "Mandera", "Marsabit",
  "Meru", "Migori", "Mombasa", "Murang'a", "Nairobi",
  "Nakuru", "Nandi", "Narok", "Nyamira", "Nyandarua",
  "Nyeri", "Samburu", "Siaya", "Taita Taveta", "Tana River",
  "Tharaka Nithi", "Trans Nzoia", "Turkana", "Uasin Gishu",
  "Vihiga", "Wajir", "West Pokot",
];

export default function FarmerLogin() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [county, setCounty] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [forgotStep, setForgotStep] = useState<"none" | "request" | "otp" | "done">("none");
  const [forgotId, setForgotId] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPw, setForgotPw] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSupport, setForgotSupport] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone || !password) { setError("Please fill in all required fields."); return; }
    if (mode === "register" && !name.trim()) { setError("Please enter your name."); return; }

    setLoading(true);
    try {
      let token = "";
      if (mode === "register") {
        const res = await fetch(`${API}/api/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: phone, password, name: name.trim(), county: county || undefined }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `Registration failed (${res.status})`);
        }
        token = (await res.json()).access_token;
      } else {
        const res = await fetch(`${API}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: phone, password }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || `Login failed (${res.status}). Check your credentials.`);
        }
        token = (await res.json()).access_token;
      }

      let displayName = name.trim() || "Farmer";
      try {
        const meRes = await fetch(`${API}/api/v1/auth/me`, { headers: { "Authorization": `Bearer ${token}` } });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.name) displayName = meData.name;
        }
      } catch { /* non-critical */ }

      document.cookie = `shambaiq_session=${encodeURIComponent(JSON.stringify({ name: displayName, token, phone }))}; path=/; max-age=86400`;
      router.push("/");
      router.refresh();
    } catch (err: any) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError("Cannot reach the server. Please check your internet connection and try again.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async () => {
    if (!forgotId.trim()) { setForgotMsg("Please enter your phone number or email."); return; }
    setForgotLoading(true);
    setForgotMsg("");
    setForgotSupport(false);
    try {
      const res = await fetch(`${API}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotId.trim() }),
      });
      const data = await res.json();
      if (data.support) {
        setForgotMsg(data.message);
        setForgotSupport(true);
      } else if (data.has_email) {
        setForgotStep("otp");
      } else {
        setForgotMsg(data.message);
      }
    } catch {
      setForgotMsg("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotReset = async () => {
    if (!forgotOtp.trim() || !forgotPw) { setForgotMsg("Please enter the code and your new password."); return; }
    if (forgotPw.length < 6) { setForgotMsg("Password must be at least 6 characters."); return; }
    setForgotLoading(true);
    setForgotMsg("");
    try {
      const res = await fetch(`${API}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotId.trim(), otp: forgotOtp.trim(), new_password: forgotPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setForgotStep("done");
      } else {
        setForgotMsg(data.detail || "Failed to reset password. Please try again.");
      }
    } catch {
      setForgotMsg("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgot = () => {
    setForgotStep("none"); setForgotId(""); setForgotOtp(""); setForgotPw(""); setForgotMsg(""); setForgotSupport(false);
  };

  const inputCls = "w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all";

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <section className="relative bg-gradient-to-br from-forest-800 via-forest-700 to-[#1e4620] pt-8 pb-20 px-6 text-center grain overflow-hidden">
        <div className="absolute top-6 right-[12%] w-40 h-40 rounded-full bg-gold-500/[0.06] blur-3xl animate-float" />
        <Link href="/" className="inline-flex items-center gap-1.5 text-cream-400 hover:text-gold-300 text-sm font-medium mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to ShambaIQ
        </Link>
        <div className="w-16 h-16 mx-auto bg-gold-500/15 border border-gold-500/25 rounded-full flex items-center justify-center mb-5">
          {forgotStep !== "none"
            ? <KeyRound className="text-gold-400" size={30} strokeWidth={1.5} />
            : <User className="text-gold-400" size={30} strokeWidth={1.5} />
          }
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-cream-100 mb-2">
          {forgotStep === "none"
            ? (mode === "login" ? "Welcome Back" : "Start Your Journey")
            : forgotStep === "done" ? "Password Reset!" : "Reset Password"
          }
        </h1>
        <p className="text-cream-400/80 text-sm max-w-[300px] mx-auto leading-relaxed">
          {forgotStep === "none"
            ? (mode === "login" ? "Track your farm, save your reports and grow smarter." : "Register your farm and get hyper-local soil and crop advice.")
            : forgotStep === "request" ? "Enter your phone number or email to receive a reset code."
            : forgotStep === "otp" ? "Enter the 6-digit code sent to your email and choose a new password."
            : "You can now log in with your new password."
          }
        </p>
      </section>

      <main className="flex-1 px-4 sm:px-6 -mt-12 mb-20 max-w-md mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-xl shadow-forest-900/8 p-7 sm:p-8 border border-cream-200">

          {forgotStep !== "none" ? (
            <div className="space-y-5">
              {forgotStep === "request" && (
                <>
                  <div>
                    <label className="text-sm font-bold text-forest-800 mb-2 block">Phone Number or Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                      <input
                        type="text"
                        value={forgotId}
                        onChange={e => setForgotId(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleForgotRequest()}
                        placeholder="0712345678 or email@example.com"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  {forgotMsg && (
                    <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
                      forgotSupport ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-red-50 border border-red-200 text-red-600"
                    }`}>{forgotMsg}</div>
                  )}
                  <button onClick={handleForgotRequest} disabled={forgotLoading}
                    className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2">
                    {forgotLoading && <Loader2 size={18} className="animate-spin" />}
                    Send Reset Code
                  </button>
                </>
              )}

              {forgotStep === "otp" && (
                <>
                  <div>
                    <label className="text-sm font-bold text-forest-800 mb-2 block">6-Digit Reset Code</label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={e => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 px-4 text-forest-900 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-forest-800 mb-2 block">New Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                      <input type="password" value={forgotPw} onChange={e => setForgotPw(e.target.value)}
                        placeholder="At least 6 characters" className={inputCls} />
                    </div>
                  </div>
                  {forgotMsg && <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">{forgotMsg}</div>}
                  <button onClick={handleForgotReset} disabled={forgotLoading}
                    className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2">
                    {forgotLoading && <Loader2 size={18} className="animate-spin" />}
                    Reset Password
                  </button>
                  <button onClick={() => { setForgotStep("request"); setForgotMsg(""); }}
                    className="w-full text-center text-sm font-semibold text-soil-400 hover:text-gold-600 py-2 transition-colors">
                    Resend code
                  </button>
                </>
              )}

              {forgotStep === "done" && (
                <div className="text-center py-4 space-y-4">
                  <CheckCircle2 size={48} className="text-forest-500 mx-auto" />
                  <p className="text-forest-800 font-semibold">Password updated successfully!</p>
                  <p className="text-soil-400 text-sm">You can now log in with your new password.</p>
                  <button onClick={() => { resetForgot(); setMode("login"); }}
                    className="w-full bg-gold-500 hover:bg-gold-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all">
                    Back to Login
                  </button>
                </div>
              )}

              {forgotStep !== "done" && (
                <button onClick={resetForgot}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-soil-400 hover:text-forest-700 py-2 transition-colors">
                  <ChevronLeft size={16} /> Back to login
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex bg-cream-100 p-1.5 rounded-2xl mb-8">
                <button type="button" onClick={() => { setMode("login"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    mode === "login" ? "bg-forest-800 text-white shadow-lg" : "text-soil-400 hover:text-forest-700"
                  }`}>
                  <LogIn size={16} /> Login
                </button>
                <button type="button" onClick={() => { setMode("register"); setError(""); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    mode === "register" ? "bg-forest-800 text-white shadow-lg" : "text-soil-400 hover:text-forest-700"
                  }`}>
                  <UserPlus size={16} /> Register
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {mode === "register" && (
                  <div>
                    <label className="text-sm font-bold text-forest-800 mb-2 block">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                      <input type="text" value={name} onChange={e => setName(e.target.value)}
                        placeholder="Enter your name" className={inputCls} />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-forest-800 mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder="0712345678" className={inputCls} />
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="text-sm font-bold text-forest-800 mb-2 block">County</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                      <select value={county} onChange={e => setCounty(e.target.value)}
                        className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all appearance-none">
                        <option value="">Select your county</option>
                        {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-bold text-forest-800 mb-2 block">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" className={inputCls} />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">{error}</div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-70 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-lg shadow-gold-500/20 transition-all flex items-center justify-center gap-2 text-base">
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {mode === "login" ? "Log In" : "Create Account"}
                </button>

                {mode === "login" && (
                  <button type="button"
                    onClick={() => { setForgotStep("request"); setForgotId(phone); setForgotMsg(""); }}
                    className="w-full text-center text-sm font-semibold text-soil-400 hover:text-gold-600 py-2 transition-colors">
                    Forgot Password?
                  </button>
                )}
              </form>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-soil-400">
          <Satellite size={12} />
          <span>Your data is stored securely on ShambaIQ servers</span>
        </div>
      </main>
    </div>
  );
}
