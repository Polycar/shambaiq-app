"use client";

import { useState } from "react";
import { Lock, Loader2, Store } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

export default function DealerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
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

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="w-16 h-16 bg-gold-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Store size={32} className="text-gold-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-forest-700 text-center mb-1">Dealer Portal</h1>
        <p className="text-soil-400 text-center text-sm mb-8">Log in to manage your agrovet listing</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-forest-700 mb-1 block">Email or Phone</label>
            <input
              type="text"
              placeholder="hello@agrovet.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-forest-700 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="Your temporary or chosen password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In</>}
          </button>
        </div>

        <p className="text-xs text-soil-300 text-center mt-6">
          Don&apos;t have a dealer account?{" "}
          <a href="/dealers/apply" className="text-gold-500 hover:text-gold-600 font-semibold">Apply here</a>
        </p>
      </div>
    </div>
  );
}
