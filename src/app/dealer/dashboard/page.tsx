"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Store, Package, BarChart3, Users, MapPin, Loader2,
  Check, CheckCircle, LogOut, Edit3, TrendingUp,
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
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-soil-400 hover:text-red-600 border border-cream-300 rounded-lg hover:border-red-300 transition-colors"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-cream-300 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-forest-700/10 rounded-xl flex items-center justify-center">
                    <TrendingUp size={20} className="text-forest-700" />
                  </div>
                  <span className="text-sm text-soil-400">Soil Queries (30 days)</span>
                </div>
                <div className="font-display text-3xl font-bold text-forest-700">{analytics.recent_queries}</div>
                <p className="text-xs text-soil-300 mt-1">Farmers in {analytics.county} seeking advice</p>
              </div>
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
          )}

          {/* Products Manager */}
          <div className="bg-white rounded-2xl border border-cream-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package size={20} className="text-gold-500" />
                <h2 className="font-display text-lg font-bold text-forest-700">Products You Stock</h2>
              </div>
              {!editingProducts && (
                <button
                  onClick={() => setEditingProducts(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-forest-700 border border-cream-300 rounded-lg hover:border-gold-400 transition-colors"
                >
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
                <textarea
                  value={products}
                  onChange={(e) => setProducts(e.target.value)}
                  placeholder="e.g. DAP, CAN, Urea, Maize Seeds, Pesticides..."
                  rows={4}
                  className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-y"
                />
                <div className="flex gap-3">
                  <button
                    onClick={saveProducts}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingProducts(false); setProducts(dealer.products_stocked || ""); }}
                    className="px-5 py-2.5 text-sm text-soil-400 border border-cream-300 rounded-xl hover:border-gold-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {dealer.products_stocked ? (
                  <div className="flex flex-wrap gap-2">
                    {dealer.products_stocked.split(",").map((p: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-cream-100 text-forest-700 text-sm font-medium rounded-full">
                        {p.trim()}
                      </span>
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
              <div>
                <span className="text-soil-400">Business Name</span>
                <p className="font-semibold text-forest-700">{dealer.business_name}</p>
              </div>
              <div>
                <span className="text-soil-400">Phone Number</span>
                <p className="font-semibold text-forest-700">{dealer.phone_number}</p>
              </div>
              <div>
                <span className="text-soil-400">Location</span>
                <p className="font-semibold text-forest-700">{dealer.town}, {dealer.county}</p>
              </div>
              <div>
                <span className="text-soil-400">Status</span>
                <p className="font-semibold text-green-600">✓ Approved &amp; Listed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
