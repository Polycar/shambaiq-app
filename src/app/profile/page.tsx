"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  User, Phone, LogIn, UserPlus, Loader2, MapPin, Leaf,
  Stethoscope, FlaskConical, Edit2, Check, X, ChevronRight,
  LogOut, Lock, BarChart3,
} from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface FarmerContext {
  name: string | null;
  county: string | null;
  language_pref: string;
  phone_number: string | null;
  email: string | null;
  member_since: string | null;
  latest_soil: {
    county: string; crop: string; health_score: number;
    is_acidic: boolean; is_n_low: boolean; is_p_low: boolean; is_k_low: boolean;
    recommended_fert: string; scanned_at: string | null;
  } | null;
  fields: { name: string; size_acres: number; crop: string; county: string }[];
  soil_report_count: number;
  diagnosis_count: number;
}

interface DiagnosisRecord {
  id: string; condition: string; confidence: number | null;
  crop: string | null; county: string | null; created_at: string | null;
}

interface SoilReport {
  id: string; county: string | null; crop: string | null;
  health_score: number; total_budget: number; recommended_fert: string | null;
  is_acidic: boolean; is_n_low: boolean; is_p_low: boolean; is_k_low: boolean;
  created_at: string | null;
}

function getCookieSession(): { token?: string; phone?: string; name?: string } | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

const COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay",
  "Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu",
  "Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru",
  "Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua",
  "Nyeri","Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

export default function ProfilePage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [county, setCounty] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [token, setToken] = useState<string | null>(null);

  // Profile data
  const [ctx, setCtx] = useState<FarmerContext | null>(null);
  const [diagnoses, setDiagnoses] = useState<DiagnosisRecord[]>([]);
  const [soilReports, setSoilReports] = useState<SoilReport[]>([]);
  const [ctxLoading, setCtxLoading] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCounty, setEditCounty] = useState("");
  const [editLang, setEditLang] = useState("en");
  const [saving, setSaving] = useState(false);

  // Change password
  const [changingPw, setChangingPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const router = useRouter();

  const loadProfile = useCallback(async (tok: string) => {
    setCtxLoading(true);
    try {
      const [ctxRes, diagRes, soilRes] = await Promise.all([
        fetch(`${API}/api/v1/auth/me/context`, { headers: { Authorization: `Bearer ${tok}` } }),
        fetch(`${API}/api/v1/diagnosis/history?limit=3`, { headers: { Authorization: `Bearer ${tok}` } }),
        fetch(`${API}/api/v1/auth/soil-history?limit=20`, { headers: { Authorization: `Bearer ${tok}` } }),
      ]);
      if (ctxRes.ok) {
        const data: FarmerContext = await ctxRes.json();
        setCtx(data);
        setEditName(data.name || "");
        setEditCounty(data.county || "");
        setEditLang(data.language_pref || "en");
      }
      if (diagRes.ok) {
        const data = await diagRes.json();
        setDiagnoses(data.history || []);
      }
      if (soilRes.ok) {
        const data = await soilRes.json();
        setSoilReports(data.history || []);
      }
    } finally {
      setCtxLoading(false);
    }
  }, []);

  useEffect(() => {
    const session = getCookieSession();
    if (session?.token) {
      setToken(session.token);
      loadProfile(session.token);
    }
  }, [loadProfile]);

  const changePassword = async () => {
    if (!currentPw || !newPw) { setPwMsg("Enter both fields."); return; }
    if (newPw.length < 6) { setPwMsg("New password must be at least 6 characters."); return; }
    setSaving(true); setPwMsg("");
    try {
      const res = await fetch(`${API}/api/v1/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
      });
      if (res.ok) {
        setPwMsg("Password updated successfully.");
        setCurrentPw(""); setNewPw("");
        setTimeout(() => { setChangingPw(false); setPwMsg(""); }, 2000);
      } else {
        const err = await res.json().catch(() => ({}));
        setPwMsg(err.detail || "Failed. Check your current password.");
      }
    } catch { setPwMsg("Network error. Try again."); }
    setSaving(false);
  };

  const handleAuth = async () => {
    if (!phone || !password) { setMsg("Enter phone and password."); return; }
    if (mode === "register" && !county) { setMsg("Please select your county."); return; }
    if (mode === "register" && password.length < 6) { setMsg("Password must be at least 6 characters."); return; }
    setLoading(true); setMsg("");
    try {
      const endpoint = mode === "login" ? "login" : "register";
      const payload = mode === "login"
        ? { identifier: phone, password }
        : { phone_number: phone, password, name: name || "Farmer", county };

      const res = await fetch(`${API}/api/v1/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const tok = data.access_token;
        const displayName = data.name || name || "Farmer";
        document.cookie = `shambaiq_session=${encodeURIComponent(
          JSON.stringify({ name: displayName, token: tok, phone })
        )}; path=/; max-age=86400`;
        setToken(tok);
        await loadProfile(tok);
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        setMsg(err.detail || "Something went wrong.");
      }
    } catch { setMsg("Could not connect. Check your connection."); }
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/v1/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, county: editCounty, language_pref: editLang }),
      });
      if (res.ok) {
        setCtx(prev => prev ? { ...prev, name: editName, county: editCounty, language_pref: editLang } : prev);
        // Update cookie name
        const session = getCookieSession();
        if (session) {
          document.cookie = `shambaiq_session=${encodeURIComponent(
            JSON.stringify({ ...session, name: editName })
          )}; path=/; max-age=86400`;
        }
        setEditing(false);
      }
    } finally { setSaving(false); }
  };

  const logout = () => {
    document.cookie = "shambaiq_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  // ── Logged-in view ─────────────────────────────────────────────────────────
  if (token) {
    const initials = ctx?.name
      ? ctx.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
      : "F";
    const memberYear = ctx?.member_since ? new Date(ctx.member_since).getFullYear() : null;

    return (
      <div className="min-h-screen bg-cream-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-forest-700 to-[#1e4620] px-4 pt-10 pb-8">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 mx-auto bg-gold-500 rounded-full flex items-center justify-center mb-3 text-white font-bold text-xl">
              {initials}
            </div>
            {ctxLoading ? (
              <Loader2 size={20} className="animate-spin text-cream-300 mx-auto" />
            ) : (
              <>
                <h1 className="font-display text-xl font-bold text-white">{ctx?.name || "Farmer"}</h1>
                <div className="flex items-center justify-center gap-1 mt-1 text-cream-300 text-sm">
                  {ctx?.county && <><MapPin size={12} /><span>{ctx.county} County</span></>}
                  {ctx?.county && memberYear && <span>·</span>}
                  {memberYear && <span>Since {memberYear}</span>}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-5 space-y-4">

          {/* Stats row */}
          {ctx && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Soil Reports", value: ctx.soil_report_count, icon: <FlaskConical size={18} className="text-forest-600" /> },
                { label: "Diagnoses", value: ctx.diagnosis_count, icon: <Stethoscope size={18} className="text-red-500" /> },
                { label: "Fields", value: ctx.fields.length, icon: <Leaf size={18} className="text-gold-500" /> },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-xl p-3 border border-cream-300 text-center shadow-sm">
                  <div className="flex justify-center mb-1">{s.icon}</div>
                  <div className="font-bold text-lg text-forest-700">{s.value}</div>
                  <div className="text-xs text-soil-400">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Profile details + edit */}
          <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
              <h2 className="font-display font-bold text-forest-700 text-sm">Profile Details</h2>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="flex items-center gap-1 text-xs text-gold-600 font-semibold">
                  <Edit2 size={12} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={saveProfile} disabled={saving} className="flex items-center gap-1 text-xs text-forest-600 font-semibold">
                    {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                  </button>
                  <button onClick={() => setEditing(false)} className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                    <X size={12} /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="px-5 py-4 space-y-4 text-sm">
              {/* Name */}
              <div>
                <label className="text-xs text-soil-400 block mb-1">Full Name</label>
                {editing ? (
                  <input value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-300 text-forest-700" />
                ) : (
                  <p className="text-forest-700 font-medium">{ctx?.name || "—"}</p>
                )}
              </div>

              {/* County */}
              <div>
                <label className="text-xs text-soil-400 block mb-1">County</label>
                {editing ? (
                  <select value={editCounty} onChange={e => setEditCounty(e.target.value)}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-300 text-forest-700">
                    <option value="">Select county</option>
                    {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <p className="text-forest-700 font-medium">{ctx?.county || "—"}</p>
                )}
              </div>

              {/* Language */}
              <div>
                <label className="text-xs text-soil-400 block mb-1">Preferred Language</label>
                {editing ? (
                  <select value={editLang} onChange={e => setEditLang(e.target.value)}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-300 text-forest-700">
                    <option value="en">English</option>
                    <option value="sw">Kiswahili</option>
                  </select>
                ) : (
                  <p className="text-forest-700 font-medium">{ctx?.language_pref === "sw" ? "Kiswahili" : "English"}</p>
                )}
              </div>

              {/* Phone — read only */}
              <div>
                <label className="text-xs text-soil-400 block mb-1">Phone</label>
                <p className="text-forest-700 font-medium">{ctx?.phone_number || "—"}</p>
              </div>
            </div>
          </div>

          {/* Latest soil report */}
          {ctx?.latest_soil && (
            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
                <h2 className="font-display font-bold text-forest-700 text-sm">Latest Soil Report</h2>
                <Link href="/app" className="text-xs text-gold-600 font-semibold flex items-center gap-0.5">
                  New report <ChevronRight size={12} />
                </Link>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-forest-700">{ctx.latest_soil.crop} — {ctx.latest_soil.county}</p>
                    <p className="text-xs text-soil-400 mt-0.5">
                      {ctx.latest_soil.scanned_at ? new Date(ctx.latest_soil.scanned_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-forest-700">{ctx.latest_soil.health_score}</div>
                    <div className="text-xs text-soil-400">Health score</div>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {ctx.latest_soil.is_acidic && <span className="px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded-full font-medium">Acidic pH</span>}
                  {ctx.latest_soil.is_n_low && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full font-medium">Low N</span>}
                  {ctx.latest_soil.is_p_low && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full font-medium">Low P</span>}
                  {ctx.latest_soil.is_k_low && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full font-medium">Low K</span>}
                  {!ctx.latest_soil.is_acidic && !ctx.latest_soil.is_n_low && !ctx.latest_soil.is_p_low && !ctx.latest_soil.is_k_low && (
                    <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full font-medium">No deficiencies</span>
                  )}
                </div>
                <p className="text-xs text-soil-500 mt-3 leading-relaxed">Recommended: {ctx.latest_soil.recommended_fert}</p>
              </div>
            </div>
          )}

          {/* Soil report history */}
          {soilReports.length > 0 && (
            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
                <h2 className="font-display font-bold text-forest-700 text-sm">Soil Report History</h2>
                <Link href="/app" className="text-xs text-gold-600 font-semibold flex items-center gap-0.5">
                  New report <ChevronRight size={12} />
                </Link>
              </div>
              <ul className="divide-y divide-cream-200">
                {soilReports.map(r => (
                  <li key={r.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-forest-700 truncate">
                          {r.crop || "—"}{r.county ? ` · ${r.county}` : ""}
                        </p>
                        <p className="text-xs text-soil-400 mt-0.5">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" }) : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-forest-700">{r.health_score}</div>
                          <div className="text-xs text-soil-400">score</div>
                        </div>
                      </div>
                    </div>
                    {r.recommended_fert && (
                      <p className="text-xs text-soil-500 mt-1.5 leading-relaxed">
                        {r.recommended_fert}
                        {r.total_budget > 0 && ` · KES ${r.total_budget.toLocaleString()}`}
                      </p>
                    )}
                    <div className="flex gap-1.5 flex-wrap mt-1.5">
                      {r.is_acidic && <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-xs rounded-full">Acidic</span>}
                      {r.is_n_low && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full">Low N</span>}
                      {r.is_p_low && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full">Low P</span>}
                      {r.is_k_low && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full">Low K</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recent diagnoses */}
          {diagnoses.length > 0 && (
            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200">
                <h2 className="font-display font-bold text-forest-700 text-sm">Recent Diagnoses</h2>
                <Link href="/doctor" className="text-xs text-gold-600 font-semibold flex items-center gap-0.5">
                  New scan <ChevronRight size={12} />
                </Link>
              </div>
              <ul className="divide-y divide-cream-200">
                {diagnoses.map(d => (
                  <li key={d.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-forest-700">{d.condition}</p>
                      <p className="text-xs text-soil-400 mt-0.5">
                        {[d.crop, d.created_at ? new Date(d.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : null].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {d.confidence != null && (
                      <span className="text-xs text-soil-400 shrink-0 ml-2">{d.confidence.toFixed(0)}%</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Fields */}
          {ctx && ctx.fields.length > 0 && (
            <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-cream-200">
                <h2 className="font-display font-bold text-forest-700 text-sm">My Fields</h2>
              </div>
              <ul className="divide-y divide-cream-200">
                {ctx.fields.map((f, i) => (
                  <li key={i} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-forest-700">{f.name}</p>
                      <p className="text-xs text-soil-400 mt-0.5">{f.crop} · {f.county}</p>
                    </div>
                    <span className="text-xs text-soil-400 shrink-0 ml-2">{f.size_acres} acres</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-cream-200">
              <h2 className="font-display font-bold text-forest-700 text-sm">Quick Actions</h2>
            </div>
            {[
              { href: "/app", icon: <BarChart3 size={16} className="text-forest-600" />, label: "Get Soil Report", desc: "Run analysis for your shamba" },
              { href: "/doctor", icon: <Stethoscope size={16} className="text-red-500" />, label: "Plant Doctor", desc: "Diagnose crop diseases with AI" },
              { href: "/agronomy", icon: <Leaf size={16} className="text-gold-500" />, label: "Ask Agronomist", desc: "Chat with Shamba Mshauri" },
              { href: "/yields", icon: <BarChart3 size={16} className="text-forest-600" />, label: "My Yield History", desc: "Track your harvests" },
            ].map(a => (
              <Link key={a.href} href={a.href}
                className="flex items-center gap-3 px-5 py-3.5 border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors">
                <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center shrink-0">{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-forest-700">{a.label}</p>
                  <p className="text-xs text-soil-400">{a.desc}</p>
                </div>
                <ChevronRight size={14} className="text-soil-300 shrink-0" />
              </Link>
            ))}
          </div>

          {/* Account */}
          <div className="bg-white rounded-2xl border border-cream-300 shadow-sm overflow-hidden">
            <button onClick={() => { setChangingPw(!changingPw); setPwMsg(""); }}
              className="w-full flex items-center gap-3 px-5 py-4 border-b border-cream-100 hover:bg-cream-50 transition-colors text-left">
              <Lock size={16} className="text-soil-400" />
              <span className="text-sm font-medium text-forest-700 flex-1">Change Password</span>
              <ChevronRight size={14} className={`text-soil-300 transition-transform ${changingPw ? "rotate-90" : ""}`} />
            </button>
            {changingPw && (
              <div className="px-5 py-4 border-b border-cream-100 space-y-3 bg-cream-50">
                <input type="password" placeholder="Current password" value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
                <input type="password" placeholder="New password (min 6 characters)" value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className="w-full px-3 py-2 border border-cream-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold-300" />
                {pwMsg && <p className={`text-xs ${pwMsg.includes("success") ? "text-forest-600" : "text-red-500"}`}>{pwMsg}</p>}
                <button onClick={changePassword} disabled={saving}
                  className="w-full py-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />} Update Password
                </button>
              </div>
            )}
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-red-50 transition-colors text-left">
              <LogOut size={16} className="text-red-500" />
              <span className="text-sm font-semibold text-red-600">Log Out</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── Auth view ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream-100">
      <div className="bg-gradient-to-br from-forest-700 to-[#1e4620] text-center py-10 px-4">
        <User size={36} className="text-gold-400 mx-auto mb-2" />
        <h1 className="font-display text-2xl font-bold text-white">
          {mode === "login" ? "Welcome Back" : "Join ShambaIQ"}
        </h1>
        <p className="text-cream-300 text-sm mt-1">Track your farm, save your reports</p>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300">
          <div className="flex gap-1 mb-6">
            {(["login", "register"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1 ${mode === m ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-400"}`}>
                {m === "login" ? <><LogIn size={14} /> Login</> : <><UserPlus size={14} /> Register</>}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <>
              <label className="block mb-4">
                <span className="text-sm font-semibold text-forest-700 mb-1 block">Full Name</span>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Kamau"
                  className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </label>
              <label className="block mb-4">
                <span className="text-sm font-semibold text-forest-700 mb-1 block">County</span>
                <select value={county} onChange={e => setCounty(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-forest-700">
                  <option value="">Select your county</option>
                  {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
            </>
          )}

          <label className="block mb-4">
            <span className="text-sm font-semibold text-forest-700 mb-1 block">Phone Number</span>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3.5 text-soil-400" />
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0712345678"
                className="w-full pl-9 pr-4 py-3 bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
          </label>

          <label className="block mb-4">
            <span className="text-sm font-semibold text-forest-700 mb-1 block">Password</span>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
              className="w-full px-4 py-3 bg-cream-100 border border-cream-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
          </label>

          {msg && <p className={`text-sm mb-3 ${msg.includes("Welcome") || msg.includes("created") ? "text-forest-600" : "text-red-600"}`}>{msg}</p>}

          <button onClick={handleAuth} disabled={loading}
            className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {mode === "login" ? "Log In" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
