"use client";

import { useState } from "react";
import { Lock, Loader2, Store, Mail, KeyRound, ChevronLeft, CheckCircle2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

export default function DealerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [forgotStep, setForgotStep] = useState<"none" | "request" | "otp" | "done">("none");
  const [forgotId, setForgotId] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [forgotPw, setForgotPw] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });
      const data = await res.json();
      if (res.ok && data.role === "dealer") {
        localStorage.setItem("dealer_token", data.access_token);
        localStorage.setItem("dealer_user_id", data.user_id);
        window.location.href = "/dealer/dashboard";
      } else if (res.ok && data.role !== "dealer") {
        setError("This account is not a dealer account. Please use the farmer login instead.");
      } else {
        setError(data.detail || "Invalid email or password.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    }
    setLoading(false);
  };

  const handleForgotRequest = async () => {
    if (!forgotId.trim()) { setForgotMsg("Please enter your email or phone number."); return; }
    setForgotLoading(true); setForgotMsg("");
    try {
      const res = await fetch(`${API}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotId.trim() }),
      });
      const data = await res.json();
      if (data.has_email) {
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
    if (!forgotOtp.trim() || !forgotPw) { setForgotMsg("Please enter the code and new password."); return; }
    if (forgotPw.length < 6) { setForgotMsg("Password must be at least 6 characters."); return; }
    setForgotLoading(true); setForgotMsg("");
    try {
      const res = await fetch(`${API}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: forgotId.trim(), otp: forgotOtp.trim(), new_password: forgotPw }),
      });
      const data = await res.json();
      if (res.ok) { setForgotStep("done"); }
      else { setForgotMsg(data.detail || "Failed to reset password."); }
    } catch {
      setForgotMsg("Network error. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          {forgotStep !== "none" ? <KeyRound size={32} className="text-gold-700" /> : <Store size={32} className="text-gold-700" />}
        </div>
        <h1 className="font-display text-2xl font-bold text-forest-700 text-center mb-1">
          {forgotStep === "none" ? "Dealer Portal" : forgotStep === "done" ? "Password Updated!" : "Reset Password"}
        </h1>
        <p className="text-soil-500 text-center text-sm mb-8">
          {forgotStep === "none" ? "Log in to manage your agrovet listing"
            : forgotStep === "request" ? "Enter your email to receive a reset code"
            : forgotStep === "otp" ? "Enter the code sent to your email"
            : "You can now log in with your new password"}
        </p>

        {forgotStep === "none" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-forest-700 mb-1 block">Email or Phone</label>
              <input type="text" placeholder="hello@agrovet.com" value={email}
                onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-forest-700 mb-1 block">Password</label>
              <input type="password" placeholder="Your temporary or chosen password" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors" />
            </div>
            {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}
            <button onClick={handleLogin} disabled={loading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : "Sign In"}
            </button>
            <button type="button" onClick={() => { setForgotStep("request"); setForgotId(email); setForgotMsg(""); }}
              className="w-full text-center text-sm font-semibold text-soil-500 hover:text-gold-700 transition-colors">
              Forgot Password?
            </button>
          </div>
        )}

        {forgotStep === "request" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-forest-700 mb-1 block">Email or Phone</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-300" />
                <input type="text" value={forgotId} onChange={e => setForgotId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleForgotRequest()}
                  placeholder="hello@agrovet.com"
                  className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors" />
              </div>
            </div>
            {forgotMsg && <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">{forgotMsg}</div>}
            <button onClick={handleForgotRequest} disabled={forgotLoading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              {forgotLoading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send Reset Code"}
            </button>
            <button onClick={() => setForgotStep("none")}
              className="w-full flex items-center justify-center gap-1 text-sm text-soil-500 hover:text-forest-700 transition-colors">
              <ChevronLeft size={14} /> Back to login
            </button>
          </div>
        )}

        {forgotStep === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-forest-700 mb-1 block">Reset Code</label>
              <input type="text" value={forgotOtp}
                onChange={e => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="123456" maxLength={6}
                className="w-full py-3 px-4 border border-cream-300 rounded-xl text-forest-700 text-center text-xl font-mono tracking-widest focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors" />
            </div>
            <div>
              <label className="text-sm font-semibold text-forest-700 mb-1 block">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-soil-300" />
                <input type="password" value={forgotPw} onChange={e => setForgotPw(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors" />
              </div>
            </div>
            {forgotMsg && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{forgotMsg}</div>}
            <button onClick={handleForgotReset} disabled={forgotLoading}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              {forgotLoading ? <><Loader2 size={16} className="animate-spin" /> Resetting...</> : "Reset Password"}
            </button>
            <button onClick={() => { setForgotStep("request"); setForgotMsg(""); }}
              className="w-full text-sm text-center text-soil-500 hover:text-gold-700 transition-colors">Resend code</button>
          </div>
        )}

        {forgotStep === "done" && (
          <div className="text-center space-y-4">
            <CheckCircle2 size={48} className="text-forest-500 mx-auto" />
            <p className="text-forest-700 font-semibold">Password updated successfully!</p>
            <button onClick={() => { setForgotStep("none"); setEmail(forgotId); setPassword(""); }}
              className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all">
              Back to Login
            </button>
          </div>
        )}

        {forgotStep === "none" && (
          <p className="text-xs text-soil-300 text-center mt-6">
            Don&apos;t have a dealer account?{" "}
            <a href="/dealers/apply" className="text-gold-500 hover:text-gold-700 font-semibold">Apply here</a>
          </p>
        )}
      </div>
    </div>
  );
}
