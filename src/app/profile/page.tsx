"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, LogIn, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.shambaiq.com";

export default function ProfilePage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [user, setUser] = useState<{ phone: string; name?: string } | null>(null);
  const router = useRouter();

  // Restore session from cookie on mount
  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        try {
          const raw = parts.pop()?.split(';').shift();
          return JSON.parse(decodeURIComponent(raw || ''));
        } catch {
          return null;
        }
      }
      return null;
    };
    const session = getCookie('shambaiq_session');
    if (session) {
      setUser({ phone: session.phone, name: session.name });
    }
  }, []);

  const handleAuth = async () => {
    if (!phone || !password) {
      setMsg("Please enter both phone number and password.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const endpoint = mode === "login" ? "login" : "register";
      const payload = mode === "login" 
        ? { identifier: phone, password }
        : { phone_number: phone, password, name: "Farmer" };

      const res = await fetch(`${API}/api/v1/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const token = data.access_token;
        const displayName = data.name || "Farmer";

        // Save session cookie (24 hrs)
        const sessionData = JSON.stringify({
          name: displayName,
          token,
          phone,
        });
        document.cookie = `shambaiq_session=${encodeURIComponent(
          sessionData
        )}; path=/; max-age=86400`;

        setUser({ phone, name: displayName });
        setMsg(mode === "login" ? "Welcome back! 🌱" : "Account created! 🎉");
        
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        setMsg(err.detail || "Something went wrong. Try again.");
      }
    } catch {
      setMsg("Could not connect. Check your connection.");
    }
    setLoading(false);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-cream-100">
        <div className="bg-gradient-to-br from-forest-700 to-[#1e4620] text-center py-10 px-4">
          <div className="w-16 h-16 mx-auto bg-gold-500 rounded-full flex items-center justify-center mb-3">
            <User size={32} className="text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-white">
            {user.name || user.phone}
          </h1>
          <p className="text-cream-300 text-sm mt-1">{msg}</p>
        </div>
        <div className="max-w-lg mx-auto px-4 py-6 space-y-3">
          <Link href="/yields" className="block bg-white rounded-xl p-4 border border-cream-300 shadow-sm hover:shadow-md transition-all">
            <span className="font-semibold text-forest-700">📈 My Yield History</span>
            <span className="block text-sm text-soil-400 mt-1">Track your harvests over time</span>
          </Link>
          <Link href="/app" className="block bg-white rounded-xl p-4 border border-cream-300 shadow-sm hover:shadow-md transition-all">
            <span className="font-semibold text-forest-700">🌱 Get New Advice</span>
            <span className="block text-sm text-soil-400 mt-1">Run a soil analysis for your shamba</span>
          </Link>
          <Link href="/doctor" className="block bg-white rounded-xl p-4 border border-cream-300 shadow-sm hover:shadow-md transition-all">
            <span className="font-semibold text-forest-700">📸 Plant Doctor</span>
            <span className="block text-sm text-soil-400 mt-1">Diagnose crop diseases with AI</span>
          </Link>
          <button
            onClick={() => {
              setUser(null);
              setMsg("");
              document.cookie = "shambaiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
              window.location.href = "/";
            }}
            className="w-full py-3 text-center text-red-600 font-semibold text-sm"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="bg-gradient-to-br from-forest-700 to-[#1e4620] text-center py-8 px-4">
        <User size={36} className="text-gold-400 mx-auto mb-2" />
        <h1 className="font-display text-2xl font-bold text-white">
          {mode === "login" ? "Welcome Back" : "Join ShambaIQ"}
        </h1>
        <p className="text-cream-300 text-sm mt-1">
          Track your farm, save your reports
        </p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300">
          {/* Toggle */}
          <div className="flex gap-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${
                mode === "login" ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400"
              }`}
            >
              <LogIn size={14} /> Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${
                mode === "register" ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400"
              }`}
            >
              <UserPlus size={14} /> Register
            </button>
          </div>

          <label className="block mb-4">
            <span className="text-sm font-semibold text-forest-700 mb-1 block">Phone Number</span>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3.5 text-soil-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712345678"
                className="w-full pl-9 pr-4 py-3 bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-semibold text-forest-700 mb-1 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </label>

          {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
