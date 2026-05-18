"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, Lock, User, Home, Sprout, BarChart3, Stethoscope, UserCircle, Menu, LogIn, UserPlus, Loader2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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
            name: name,
          }),
        });
        
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.detail || "Registration failed");
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
          const err = await res.json();
          throw new Error(err.detail || "Login failed. Check your credentials.");
        }
        const data = await res.json();
        token = data.access_token;
      }

      // Fetch user profile to get the name
      const meRes = await fetch(`${API}/api/v1/auth/me?token=${token}`);
      let displayName = "Farmer";
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.name) displayName = meData.name;
      }

      // Save token and name in the cookie
      const sessionData = JSON.stringify({ name: displayName, token, phone });
      document.cookie = `shambaiq_session=${encodeURIComponent(sessionData)}; path=/; max-age=86400`;
      
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-sans text-soil-700">
      
      {/* ═══ TOP NAV ═══ */}
      <nav className="bg-forest-900 px-6 py-4 flex items-center justify-between border-b border-white/10 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Shamba<span className="text-gold-500">IQ</span></span>
        </div>
        <button className="text-white">
          <Menu size={24} />
        </button>
      </nav>

      {/* ═══ HEADER SECTION ═══ */}
      <section className="bg-forest-800 pt-10 pb-20 px-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mb-4 border border-gold-500/30">
          <User className="text-gold-500" size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {mode === "login" ? "Welcome Back" : "Start Your Journey"}
        </h1>
        <p className="text-white/70 text-sm max-w-[280px]">
          {mode === "login" 
            ? "Track your farm, save your reports and grow smarter." 
            : "Register your farm and get hyper-local soil and crop advice."}
        </p>
      </section>

      {/* ═══ AUTH CARD ═══ */}
      <main className="flex-1 px-6 -mt-12 mb-20">
        <div className="bg-white rounded-[32px] shadow-xl shadow-forest-900/10 p-8 border border-cream-100">
          
          {/* Tabs */}
          <div className="flex bg-cream-100 p-1.5 rounded-2xl mb-8">
            <button 
              onClick={() => setMode("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === "login" ? "bg-forest-800 text-white shadow-lg" : "text-soil-400"}`}
            >
              <LogIn size={16} /> Login
            </button>
            <button 
              onClick={() => setMode("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${mode === "register" ? "bg-forest-800 text-white shadow-lg" : "text-soil-400"}`}
            >
              <UserPlus size={16} /> Register
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div>
                <label className="text-sm font-bold text-forest-800 mb-2 block">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name" 
                    className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-forest-800 mb-2 block">Phone Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712345678" 
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-forest-800 mb-2 block">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-soil-300" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-cream-50 border border-cream-200 rounded-2xl py-4 pl-12 pr-4 text-forest-900 focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-gold-600 hover:bg-gold-700 disabled:opacity-70 active:scale-95 text-white font-bold py-5 rounded-2xl shadow-lg shadow-gold-600/20 transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === "login" ? "Log In" : "Create Account"}
            </button>
            
            {error && (
              <p className="text-red-500 text-sm text-center font-medium mt-2">{error}</p>
            )}
            
            {mode === "login" && (
              <button className="w-full text-center text-sm font-semibold text-soil-400 py-2">
                Forgot Password?
              </button>
            )}
          </form>
        </div>
      </main>

      {/* ═══ BOTTOM NAV ═══ */}
      <footer className="bg-white border-t border-cream-200 px-6 py-4 flex items-center justify-between sticky bottom-0 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center gap-1 text-soil-400">
          <Home size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-soil-400">
          <Sprout size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Soil</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-soil-400">
          <BarChart3 size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Yields</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-soil-400">
          <Stethoscope size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Doctor</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-forest-800">
          <UserCircle size={20} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Me</span>
        </button>
      </footer>

    </div>
  );
}
