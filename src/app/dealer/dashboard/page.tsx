"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Store, Package, BarChart3, Users, MapPin, Loader2,
  Check, CheckCircle, LogOut, TrendingUp,
  ChevronDown, ChevronUp, Wheat, Droplets, Lock, X, Plus, Trash2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

// ── Stock status helpers ─────────────────────────────────────────────────────

const STOCK_LABELS: Record<string, string> = {
  in_stock: "In Stock",
  low_stock: "Running Low",
  out_of_stock: "Out of Stock",
};

const STOCK_COLORS: Record<string, string> = {
  in_stock: "text-green-700 font-semibold",
  low_stock: "text-amber-600 font-semibold",
  out_of_stock: "text-red-600 font-semibold",
};

const STOCK_BG: Record<string, string> = {
  in_stock: "bg-green-50 border-green-200",
  low_stock: "bg-amber-50 border-amber-200",
  out_of_stock: "bg-red-50 border-red-200",
};

// ── Common product catalog ───────────────────────────────────────────────────

const CATALOG: { name: string; category: string; unit: string }[] = [
  { name: "DAP 50kg", category: "Fertilizer", unit: "50kg bag" },
  { name: "CAN 50kg", category: "Fertilizer", unit: "50kg bag" },
  { name: "Urea 50kg", category: "Fertilizer", unit: "50kg bag" },
  { name: "NPK 17:17:17 50kg", category: "Fertilizer", unit: "50kg bag" },
  { name: "NPK 23:23:0 50kg", category: "Fertilizer", unit: "50kg bag" },
  { name: "MOP 50kg", category: "Fertilizer", unit: "50kg bag" },
  { name: "Agricultural Lime 50kg", category: "Lime", unit: "50kg bag" },
  { name: "Calcitic Lime 50kg", category: "Lime", unit: "50kg bag" },
  { name: "Maize Seed 2kg", category: "Seed", unit: "2kg packet" },
  { name: "Maize Seed 10kg", category: "Seed", unit: "10kg bag" },
  { name: "Beans Seed 1kg", category: "Seed", unit: "1kg packet" },
  { name: "Sunflower Seed 1kg", category: "Seed", unit: "1kg packet" },
  { name: "Sorghum Seed 1kg", category: "Seed", unit: "1kg packet" },
  { name: "Dithane M45 1kg", category: "Fungicide", unit: "1kg packet" },
  { name: "Ridomil Gold 1kg", category: "Fungicide", unit: "1kg packet" },
  { name: "Karate 1L", category: "Insecticide", unit: "1L bottle" },
  { name: "Kingcode Elite 1L", category: "Insecticide", unit: "1L bottle" },
  { name: "Duduthrin 1L", category: "Insecticide", unit: "1L bottle" },
  { name: "Roundup 1L", category: "Herbicide", unit: "1L bottle" },
  { name: "Weedmaster 1L", category: "Herbicide", unit: "1L bottle" },
  { name: "Touchdown 1L", category: "Herbicide", unit: "1L bottle" },
  { name: "Granular Foliar 1kg", category: "Foliar", unit: "1kg packet" },
  { name: "Optimizer 1L", category: "Foliar", unit: "1L bottle" },
];

const CATEGORIES = ["Fertilizer", "Lime", "Seed", "Fungicide", "Insecticide", "Herbicide", "Foliar", "Other"];

interface Product {
  id: string;
  product_name: string;
  category: string;
  brand?: string;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  price?: number;
  unit?: string;
  updated_at?: string;
}

export default function DealerDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Inventory
  const [inventory, setInventory] = useState<Product[]>([]);
  const [invLoading, setInvLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [addForm, setAddForm] = useState({ product_name: "", category: "Fertilizer", unit: "", price: "" });
  const [addMode, setAddMode] = useState<"catalog" | "custom">("catalog");
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [addSaving, setAddSaving] = useState(false);

  // Farmer needs
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
    } catch (e) {
      console.error("Failed to fetch dealer data:", e);
    }
    setLoading(false);
  }, [token]);

  const fetchInventory = useCallback(async () => {
    if (!token) return;
    setInvLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/dealers/portal/inventory?token=${token}`);
      if (res.ok) {
        const data = await res.json();
        setInventory(data.products || []);
      }
    } catch {}
    setInvLoading(false);
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (token) fetchInventory(); }, [token, fetchInventory]);

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

  const updateStockStatus = async (product: Product, newStatus: "in_stock" | "low_stock" | "out_of_stock") => {
    if (!token) return;
    setSaving(s => ({ ...s, [product.id]: true }));
    try {
      const res = await fetch(`${API}/api/v1/dealers/portal/inventory/${product.id}?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock_status: newStatus }),
      });
      if (res.ok) {
        setInventory(inv => inv.map(p => p.id === product.id ? { ...p, stock_status: newStatus } : p));
      }
    } catch {}
    setSaving(s => ({ ...s, [product.id]: false }));
  };

  const updatePrice = async (product: Product, price: string) => {
    if (!token) return;
    const parsed = parseFloat(price);
    if (isNaN(parsed) || parsed < 0) return;
    setSaving(s => ({ ...s, [`price_${product.id}`]: true }));
    try {
      const res = await fetch(`${API}/api/v1/dealers/portal/inventory/${product.id}?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: parsed }),
      });
      if (res.ok) {
        setInventory(inv => inv.map(p => p.id === product.id ? { ...p, price: parsed } : p));
      }
    } catch {}
    setSaving(s => ({ ...s, [`price_${product.id}`]: false }));
  };

  const removeProduct = async (productId: string) => {
    if (!token) return;
    setSaving(s => ({ ...s, [`del_${productId}`]: true }));
    try {
      const res = await fetch(`${API}/api/v1/dealers/portal/inventory/${productId}?token=${token}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setInventory(inv => inv.filter(p => p.id !== productId));
      }
    } catch {}
    setSaving(s => ({ ...s, [`del_${productId}`]: false }));
  };

  const addProduct = async () => {
    if (!token || !addForm.product_name || !addForm.category) return;
    setAddSaving(true);
    try {
      const catalog = CATALOG.find(c => c.name === addForm.product_name);
      const body = {
        product_name: addForm.product_name,
        category: addForm.category,
        unit: addForm.unit || catalog?.unit || "",
        stock_status: "in_stock",
        price: addForm.price ? parseFloat(addForm.price) : undefined,
      };
      const res = await fetch(`${API}/api/v1/dealers/portal/inventory?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setInventory(inv => [...inv, data.product]);
        setAddForm({ product_name: "", category: "Fertilizer", unit: "", price: "" });
        setShowAddPanel(false);
      }
    } catch {}
    setAddSaving(false);
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

  // Products grouped by category, filtered by activeCategory
  const existingNames = new Set(inventory.map(p => p.product_name));
  const catalogOptions = CATALOG.filter(c => !existingNames.has(c.name));
  const filteredInventory = activeCategory === "All"
    ? inventory
    : inventory.filter(p => p.category === activeCategory);
  const inventoryCategories = ["All", ...Array.from(new Set(inventory.map(p => p.category))).sort()];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gold-100 rounded-2xl flex items-center justify-center">
            <Store size={28} className="text-gold-700" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-forest-700">
              {dealer?.business_name || "Dealer Portal"}
            </h1>
            <p className="text-sm text-soil-500">
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
            className="flex items-center gap-2 px-4 py-2 text-sm text-soil-500 hover:text-red-600 border border-cream-300 rounded-lg hover:border-red-300 transition-colors">
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
              className="text-soil-500 hover:text-forest-700"><X size={18} /></button>
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
          <p className="text-sm text-soil-500">Your dealer account exists, but no approved application was found. Your application may still be under review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Analytics Cards */}
          {analytics && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={toggleNeeds}
                  className="bg-white rounded-2xl border border-cream-300 p-6 text-left hover:border-forest-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-forest-700/10 rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} className="text-forest-700" />
                    </div>
                    <span className="text-sm text-soil-500">Soil Queries (30 days)</span>
                    {showNeeds ? <ChevronUp size={14} className="text-soil-500 ml-auto" /> : <ChevronDown size={14} className="text-soil-500 ml-auto group-hover:text-forest-700 transition-colors" />}
                  </div>
                  <div className="font-display text-3xl font-bold text-forest-700">{analytics.recent_queries}</div>
                  <p className="text-xs text-gold-700 mt-1 font-medium">Click to see farmer needs →</p>
                </button>

                <div className="bg-white rounded-2xl border border-cream-300 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gold-100 rounded-xl flex items-center justify-center">
                      <Users size={20} className="text-gold-700" />
                    </div>
                    <span className="text-sm text-soil-500">Registered Farmers</span>
                  </div>
                  <div className="font-display text-3xl font-bold text-forest-700">{analytics.total_farmers}</div>
                  <p className="text-xs text-soil-300 mt-1">In {analytics.county} County</p>
                </div>

                <div className="bg-white rounded-2xl border border-cream-300 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <MapPin size={20} className="text-green-600" />
                    </div>
                    <span className="text-sm text-soil-500">Your Location</span>
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
                    {needsLoading && <Loader2 size={16} className="animate-spin text-soil-500" />}
                  </div>

                  {needsLoading && !needs && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 size={24} className="animate-spin text-forest-500" />
                    </div>
                  )}

                  {needs && needs.total_queries === 0 && (
                    <p className="text-soil-500 text-sm text-center py-6">No soil queries recorded in the last 90 days yet.</p>
                  )}

                  {needs && needs.total_queries > 0 && (
                    <div className="space-y-6">
                      <p className="text-xs text-soil-500">
                        Based on <strong className="text-forest-700">{needs.total_queries}</strong> soil queries in the last {needs.period_days} days
                      </p>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-bold text-forest-700 mb-3 flex items-center gap-2">
                            <Wheat size={14} /> Top Crops Grown
                          </h3>
                          <div className="space-y-2">
                            {needs.top_crops.map((c: any, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="text-xs w-5 text-soil-500 font-mono">{i + 1}.</div>
                                <div className="flex-1 bg-cream-100 rounded-full h-2 overflow-hidden">
                                  <div className="bg-forest-500 h-2 rounded-full" style={{ width: `${Math.round(c.count / needs.top_crops[0].count * 100)}%` }} />
                                </div>
                                <span className="text-sm font-medium text-forest-800 w-24 truncate">{c.crop}</span>
                                <span className="text-xs text-soil-500 w-8 text-right">{c.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-forest-700 mb-3 flex items-center gap-2">
                            <Package size={14} /> Most Recommended Inputs
                          </h3>
                          <div className="space-y-2">
                            {needs.top_fertilizers.map((f: any, i: number) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className="text-xs w-5 text-soil-500 font-mono">{i + 1}.</div>
                                <div className="flex-1 bg-cream-100 rounded-full h-2 overflow-hidden">
                                  <div className="bg-gold-400 h-2 rounded-full" style={{ width: `${Math.round(f.count / needs.top_fertilizers[0].count * 100)}%` }} />
                                </div>
                                <span className="text-sm font-medium text-forest-800 w-24 truncate">{f.name}</span>
                                <span className="text-xs text-soil-500 w-8 text-right">{f.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ── Inventory Manager ──────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gold-500" />
                <div>
                  <h2 className="font-display text-lg font-bold text-forest-700">Stock &amp; Inventory</h2>
                  <p className="text-xs text-soil-500 mt-0.5">Update availability so farmers know what you have before visiting</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddPanel(v => !v)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-forest-700 hover:bg-forest-800 rounded-xl transition-colors"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Add product panel */}
            {showAddPanel && (
              <div className="mb-5 bg-cream-50 border border-cream-300 rounded-xl p-4 space-y-4">
                <div className="flex rounded-lg overflow-hidden border border-cream-300">
                  <button onClick={() => setAddMode("catalog")} className={`flex-1 py-2 text-sm font-semibold transition-all ${addMode === "catalog" ? "bg-forest-700 text-white" : "bg-white text-soil-500 hover:bg-cream-100"}`}>From catalog</button>
                  <button onClick={() => setAddMode("custom")} className={`flex-1 py-2 text-sm font-semibold transition-all ${addMode === "custom" ? "bg-forest-700 text-white" : "bg-white text-soil-500 hover:bg-cream-100"}`}>Custom product</button>
                </div>

                {addMode === "catalog" ? (
                  <select
                    value={addForm.product_name}
                    onChange={e => {
                      const cat = CATALOG.find(c => c.name === e.target.value);
                      setAddForm(f => ({ ...f, product_name: e.target.value, category: cat?.category || f.category, unit: cat?.unit || f.unit }));
                    }}
                    className="w-full px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 bg-white focus:outline-none focus:border-gold-400"
                  >
                    <option value="">Select a product...</option>
                    {CATEGORIES.map(cat => {
                      const opts = catalogOptions.filter(c => c.category === cat);
                      if (!opts.length) return null;
                      return (
                        <optgroup key={cat} label={cat}>
                          {opts.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </optgroup>
                      );
                    })}
                  </select>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Product name (e.g. Mancozeb 1kg)"
                      value={addForm.product_name}
                      onChange={e => setAddForm(f => ({ ...f, product_name: e.target.value }))}
                      className="px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 focus:outline-none focus:border-gold-400"
                    />
                    <select
                      value={addForm.category}
                      onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}
                      className="px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 bg-white focus:outline-none focus:border-gold-400"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-soil-500 mb-1 block">Price (KSh) — optional</label>
                    <input
                      type="number"
                      placeholder="e.g. 3200"
                      value={addForm.price}
                      onChange={e => setAddForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-soil-500 mb-1 block">Unit — optional</label>
                    <input
                      type="text"
                      placeholder="e.g. 50kg bag"
                      value={addForm.unit}
                      onChange={e => setAddForm(f => ({ ...f, unit: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 focus:outline-none focus:border-gold-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={addProduct} disabled={addSaving || !addForm.product_name}
                    className="flex items-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-colors">
                    {addSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Add to inventory
                  </button>
                  <button onClick={() => { setShowAddPanel(false); setAddForm({ product_name: "", category: "Fertilizer", unit: "", price: "" }); }}
                    className="px-4 py-2.5 text-sm text-soil-500 border border-cream-300 rounded-xl hover:border-gold-400 transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {/* Category filter tabs */}
            {inventory.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {inventoryCategories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${activeCategory === cat ? "bg-forest-700 text-white" : "bg-cream-100 text-soil-500 hover:bg-cream-200"}`}>
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Inventory table */}
            {invLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-forest-500" />
              </div>
            ) : filteredInventory.length === 0 ? (
              <div className="text-center py-10 text-soil-500 text-sm">
                {inventory.length === 0
                  ? "No products added yet. Click \"Add Product\" to start building your inventory."
                  : "No products in this category."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-soil-500 uppercase tracking-wide">Product</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-soil-500 uppercase tracking-wide">Category</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-soil-500 uppercase tracking-wide">Availability</th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-soil-500 uppercase tracking-wide">Price (KSh)</th>
                      <th className="py-2.5 px-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((product, i) => (
                      <tr key={product.id} className={`border-b border-cream-100 ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}>
                        <td className="py-3 px-3">
                          <div className="font-medium text-forest-800">{product.product_name}</div>
                          {product.unit && <div className="text-xs text-soil-500">{product.unit}</div>}
                        </td>
                        <td className="py-3 px-3 text-soil-500 text-xs">{product.category}</td>
                        <td className="py-3 px-3">
                          <select
                            value={product.stock_status}
                            onChange={e => updateStockStatus(product, e.target.value as "in_stock" | "low_stock" | "out_of_stock")}
                            disabled={saving[product.id]}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none focus:ring-1 focus:ring-gold-400 bg-white transition-colors ${STOCK_COLORS[product.stock_status]} ${STOCK_BG[product.stock_status]}`}
                          >
                            <option value="in_stock" className="text-green-700">In Stock</option>
                            <option value="low_stock" className="text-amber-600">Running Low</option>
                            <option value="out_of_stock" className="text-red-600">Out of Stock</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <PriceInput
                            value={product.price}
                            onSave={(price) => updatePrice(product, price)}
                            disabled={!!saving[`price_${product.id}`]}
                          />
                        </td>
                        <td className="py-3 px-3">
                          <button
                            onClick={() => removeProduct(product.id)}
                            disabled={saving[`del_${product.id}`]}
                            className="p-1.5 text-soil-300 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Remove product"
                          >
                            {saving[`del_${product.id}`] ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Business Info */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6">
            <h2 className="font-display text-lg font-bold text-forest-700 mb-4 flex items-center gap-2">
              <Store size={20} className="text-gold-500" /> Business Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-soil-500">Business Name</span><p className="font-semibold text-forest-700">{dealer.business_name}</p></div>
              <div><span className="text-soil-500">Phone Number</span><p className="font-semibold text-forest-700">{dealer.phone_number}</p></div>
              <div><span className="text-soil-500">Location</span><p className="font-semibold text-forest-700">{dealer.town}, {dealer.county}</p></div>
              {dealer.physical_address && (
                <div><span className="text-soil-500">Address</span><p className="font-semibold text-forest-700">{dealer.physical_address}</p></div>
              )}
              <div><span className="text-soil-500">Status</span><p className="font-semibold text-green-600 flex items-center gap-1"><CheckCircle size={14} /> Approved &amp; Listed</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Inline price editor ──────────────────────────────────────────────────────

function PriceInput({ value, onSave, disabled }: { value?: number; onSave: (v: string) => void; disabled: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value !== undefined ? String(value) : "");

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") { onSave(draft); setEditing(false); }
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-24 px-2 py-1 border border-gold-400 rounded-lg text-xs text-forest-700 focus:outline-none"
          autoFocus
        />
        <button onClick={() => { onSave(draft); setEditing(false); }} disabled={disabled}
          className="p-1 text-forest-700 hover:text-forest-900 disabled:opacity-50">
          <Check size={12} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setDraft(value !== undefined ? String(value) : ""); setEditing(true); }}
      className="text-xs text-soil-500 hover:text-forest-700 transition-colors min-w-[60px] text-left"
    >
      {value !== undefined ? value.toLocaleString() : <span className="text-soil-300">— set price</span>}
    </button>
  );
}
