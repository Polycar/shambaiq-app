"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Store, Package, BarChart3, Users, MapPin, Loader2,
  Check, CheckCircle, CheckCircle2, LogOut, Edit3, TrendingUp,
  ChevronDown, ChevronUp, Wheat, Droplets, Lock, X,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

export default function DealerDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [editingProducts, setEditingProducts] = useState(false);
  const [products, setProducts] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  // Farmer needs panel
  const [showNeeds, setShowNeeds] = useState(false);
  const [needs, setNeeds] = useState<any>(null);
  const [needsLoading, setNeedsLoading] = useState(false);

  // Change password
  const [showChangePw, setShowChangePw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("dealer_token");
    if (!t) { window.location.href = "/dealer/login"; return; }
    setToken(t);
  }, []);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [profileRes, analyticsRes] = await Promise.all([
        fetch(`${API}/api/v1/dealers/portal/me?token=${token}`),
        fetch(`${API}/api/v1/dealers/portal/analytics?token=${token}`),
      ]);
      if (profileRes.status === 401 || profileRes.status === 403) {
        localStorage.removeItem("dealer_token");
        window.location.href = "/dealer/login";
        return;
      }
      const p = await profileRes.json();
      const a = await analyticsRes.json();
      setProfile(p);
      setAnalytics(a);
      if (p.dealer?.products_stocked) setProducts(p.dealer.products_stocked);
    } catch (e) {
      console.error("Failed to fetch dealer data:", e);
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchNeeds = useCallback(async () => {
    if (!token) return;
    setNeedsLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/dealers/portal/farmer-needs?token=${token}`);
      if (res.ok) setNeeds(await res.json());
    } catch {}
    setNeedsLoading(false);
  }, [token]);

  const toggleNeeds = () => {
    if (!showNeeds && !needs) fetchNeeds();
    setShowNeeds(v => !v);
  };

  const saveProducts = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/v1/dealers/portal/products?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products_stocked: products }),
      });
      if (res.ok) {
        setSavedMsg(true);
        setEditingProducts(false);
        setTimeout(() => setSavedMsg(false), 3000);
        fetchData();
      }
    } catch {}
    setSaving(false);
  };

  const changePassword = async () => {
    if (!newPw || !currentPw) { setPwMsg({ type: "error", text: "Please fill in all fields." }); return; }
    if (newPw.length < 6) { setPwMsg({ type: "error", text: "New password must be at least 6 characters." }); return; }
    if (newPw !== confirmPw) { setPwMsg({ type: "error", text: "Passwords do not match." }); return; }
    setPwSaving(true); setPwMsg(null);
    try {
      const res = await fetch(`${API}/api/v1/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ current_password: currentPw, new_password: newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ type: "success", text: "Password changed successfully!" });
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
        setTimeout(() => { setPwMsg(null); setShowChangePw(false); }, 2500);
      } else {
        setPwMsg({ type: "error", text: data.detail || "Failed to change password." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Network error. Please try again." });
    }
    setPwSaving(false);
  };

  const logout = () => {
    localStorage.removeItem("dealer_token");
    localStorage.removeItem("dealer_user_id");
    window.location.href = "/dealer/login";
  };

  if (loading || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-forest-700" />
      </div>
    );
  }

  const dealer = profile.dealer;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center">
            <Store size={28} className="text-gold-600" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-forest-700">
              {dealer?.business_name || "Dealer Portal"}
            </h1>
            <p className="text-sm text-soil-400">
              {dealer ? `${dealer.town}, ${dealer.county}` : profile.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowChangePw(v => !v)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-soil-500 hover:text-forest-700 border border-cream-300 rounded-lg hover:border-forest-300 transition-colors">
            <Lock size={14} /> Change Password
          </button>
          <button onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-soil-400 hover:text-red-600 border border-cream-300 rounded-lg hover:border-red-300 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </div>

      {/* Change Password Panel */}
      {showChangePw && (
        <div className="bg-white rounded-2xl border border-cream-300 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold text-forest-700 flex items-center gap-2">
              <Lock size={18} className="text-gold-500" /> Change Password
            </h2>
            <button onClick={() => { setShowChangePw(false); setPwMsg(null); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
              className="text-soil-400 hover:text-forest-700"><X size={18} /></button>
          </div>
          {pwMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
              pwMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"
            }`}>{pwMsg.text}</div>
          )}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-soil-500 mb-1 block">Current Password</label>
              <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                placeholder="Current password"
                className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-soil-500 mb-1 block">New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400" />
            </div>
            <div>
              <label className="text-xs font-semibold text-soil-500 mb-1 block">Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={changePassword} disabled={pwSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors">
              {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save Password
            </button>
          </div>
        </div>
      )}

      {!dealer ? (
        <div className="bg-gold-50 border border-gold-200 rounded-2xl p-8 text-center">
          <Store size={40} className="text-gold-500 mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold text-forest-700 mb-2">No Approved Listing Yet</h2>
          <p className="text-sm text-soil-400">Your dealer account exists, but no approved application was found. Your application may still be under review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analytics Cards */}
          {analytics && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Soil Queries — clickable to show farmer needs */}
                <button
                  onClick={toggleNeeds}
                  className="bg-white rounded-2xl border border-cream-300 p-6 text-left hover:border-forest-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-forest-700/10 rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} className="text-forest-700" />
                    </div>
                    <span className="text-sm text-soil-400">Soil Queries (30 days)</span>
                    {showNeeds
                      ? <ChevronUp size={14} className="text-soil-400 ml-auto" />
                      : <ChevronDown size={14} className="text-soil-400 ml-auto group-hover:text-forest-700 transition-colors" />}
                  </div>
                  <div className="font-display text-3xl font-bold text-forest-700">{analytics.recent_queries}</div>
                  <p className="text-xs text-gold-600 mt-1 font-medium">Click to see farmer needs →</p>
                </button>

                <div className="bg-white rounded-2xl border border-cream-300 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center">
                      <Users size={20} className="text-gold-600" />
                    </div>
                    <span className="text-sm text-soil-400">Registered Farmers</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-forest-700">{analytics.total_farmers}</div>
                  <p className="text-xs text-soil-300 mt-1">In {analytics.county} County</p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-300 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <span className="text-sm text-soil-400">Your Location</span>
                  </div>
                  <div className="font-display text-lg font-bold text-forest-700">{dealer.town}</div>
                  <p className="text-xs text-soil-300 mt-1">{dealer.county} County</p>
                </div>
              </div>

              {/* Farmer Needs Panel */}
              {showNeeds && (
                <div className="bg-white rounded-2xl border border-forest-200 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-lg font-bold text-forest-700 flex items-center gap-2">
                      <BarChart3 size={20} className="text-forest-600" />
                      Farmer Needs in {analytics.county} County
                    </h2>
                    {needsLoading && <Loader2 size={16} className="animate-spin text-soil-400" />}
                  </div>

                  {needsLoading && !needs && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-forest-500" />
                    </div>
                  )}

                  {needs && needs.total_queries === 0 && (
                    <p className="text-soil-400 text-sm text-center py-6">No soil queries recorded in the last 90 days yet.</p>
                  )}

                  {needs && needs.total_queries > 0 && (
                    <div className="space-y-6">
                      <p className="text-xs text-soil-400">
                        Based on <strong className="text-forest-700">{needs.total_queries}</strong> soil queries in the last {needs.period_days} days
                      </p>

                      <div className="grid sm:grid-cols-2 gap-6">
                        {/* Top Crops */}
                        <div>
                          <h3 className="text-sm font-bold text-forest-700 mb-3 flex items-center gap-2">
                            <Wheat size={14} /> Top Crops Grown
                          </h3>
                          <div className="space-y-2">
                            {needs.top_crops.map((c: any, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="text-xs w-5 text-soil-400 font-mono">{i + 1}.</div>
                                <div className="flex-1 bg-cream-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-forest-500 h-2 rounded-full"
                                    style={{ width: `${Math.round(c.count / needs.top_crops[0].count * 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-forest-800 w-24 truncate">{c.crop}</span>
                                <span className="text-xs text-soil-400 w-8 text-right">{c.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Top Fertilizers */}
                        <div>
                          <h3 className="text-sm font-bold text-forest-700 mb-3 flex items-center gap-2">
                            <Package size={14} /> Most Recommended Inputs
                          </h3>
                          <div className="space-y-2">
                            {needs.top_fertilizers.map((f: any, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="text-xs w-5 text-soil-400 font-mono">{i + 1}.</div>
                                <div className="flex-1 bg-cream-100 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gold-400 h-2 rounded-full"
                                    style={{ width: `${Math.round(f.count / needs.top_fertilizers[0].count * 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-forest-800 w-24 truncate">{f.name}</span>
                                <span className="text-xs text-soil-400 w-8 text-right">{f.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Soil Deficiencies */}
                      <div>
                        <h3 className="text-sm font-bold text-forest-700 mb-3 flex items-center gap-2">
                          <Droplets size={14} /> Common Soil Deficiencies
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "Low Nitrogen", key: "nitrogen_low", color: "bg-blue-100 text-blue-700" },
                            { label: "Low Phosphorus", key: "phosphorus_low", color: "bg-amber-100 text-amber-700" },
                            { label: "Low Potassium", key: "potassium_low", color: "bg-purple-100 text-purple-700" },
                            { label: "Acidic Soil", key: "soil_acidic", color: "bg-red-100 text-red-700" },
                          ].map(d => (
                            <div key={d.key} className={`rounded-xl p-3 text-center ${d.color}`}>
                              <div className="text-2xl font-bold">{needs.deficiencies[d.key]?.percent ?? 0}%</div>
                              <div className="text-xs font-medium mt-0.5">{d.label}</div>
                              <div className="text-xs opacity-70">{needs.deficiencies[d.key]?.count ?? 0} farms</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Queries */}
                      {needs.recent_queries.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-forest-700 mb-3">Recent Farmer Queries</h3>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-xs">
                              <thead>
                                <tr className="border-b border-cream-200">
                                  <th className="text-left py-2 px-3 text-soil-500 font-semibold">Crop</th>
                                  <th className="text-left py-2 px-3 text-soil-500 font-semibold">Recommended Inputs</th>
                                  <th className="text-left py-2 px-3 text-soil-500 font-semibold">Budget (KSh)</th>
                                  <th className="text-left py-2 px-3 text-soil-500 font-semibold">Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {needs.recent_queries.map((q: any, i: number) => (
                                  <tr key={i} className={`border-b border-cream-100 ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}>
                                    <td className="py-2 px-3 font-medium text-forest-800">{q.crop}</td>
                                    <td className="py-2 px-3 text-soil-600">{q.recommended_fert || "—"}</td>
                                    <td className="py-2 px-3 text-soil-600">{q.total_budget?.toLocaleString() || "—"}</td>
                                    <td className="py-2 px-3 text-soil-400">{q.date || "—"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Products Manager */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gold-500" />
                <h2 className="font-display text-lg font-bold text-forest-700">Products You Stock</h2>
              </div>
              {!editingProducts && (
                <button onClick={() => setEditingProducts(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-forest-700 border border-cream-300 rounded-lg hover:border-gold-400 transition-colors">
                  <Edit3 size={14} /> Edit
                </button>
              )}
            </div>

            {savedMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl flex items-center gap-2">
                <CheckCircle size={16} /> Products updated successfully!
              </div>
            )}

            {editingProducts ? (
              <div className="space-y-4">
                <textarea value={products} onChange={e => setProducts(e.target.value)}
                  placeholder="e.g. DAP, CAN, Urea, Maize Seeds, Pesticides..." rows={4}
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-y" />
                <div className="flex gap-3">
                  <button onClick={saveProducts} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
                  </button>
                  <button onClick={() => { setEditingProducts(false); setProducts(dealer.products_stocked || ""); }}
                    className="px-5 py-2.5 text-sm text-soil-400 border border-cream-300 rounded-xl hover:border-gold-400 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                {dealer.products_stocked ? (
                  <div className="flex flex-wrap gap-2">
                    {dealer.products_stocked.split(",").map((p: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-cream-100 text-forest-700 text-sm font-medium rounded-full">{p.trim()}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-soil-400 text-sm">No products listed yet. Click &quot;Edit&quot; to add your inventory.</p>
                )}
              </div>
            )}
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4 flex items-center gap-2">
              <Store size={20} className="text-gold-500" /> Business Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-soil-400">Business Name</span><p className="font-semibold text-forest-700">{dealer.business_name}</p></div>
              <div><span className="text-soil-400">Phone Number</span><p className="font-semibold text-forest-700">{dealer.phone_number}</p></div>
              <div><span className="text-soil-400">Location</span><p className="font-semibold text-forest-700">{dealer.town}, {dealer.county}</p></div>
              <div><span className="text-soil-400">Status</span><p className="font-semibold text-green-600">✓ Approved &amp; Listed</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
