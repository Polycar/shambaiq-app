"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock, Store, BarChart3, AlertTriangle, FileText,
  Check, CheckCircle, X, Loader2, RefreshCw, Users, TrendingUp, MapPin, Wheat,
  PenLine, Eye, Trash2, Plus, Search, Phone, ChevronDown, ChevronRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

type Tab = "stats" | "dealers" | "yields" | "blog" | "farmers" | "audit" | "crops";

export default function AdminDashboard() {
  const [code, setCode] = useState("");
  const [auth, setAuth] = useState(false);
  const [authErr, setAuthErr] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");
  const [loading, setLoading] = useState(false);

  // Data
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [dealers, setDealers] = useState<any[]>([]);
  const [dealerFilter, setDealerFilter] = useState("pending");
  const [yields, setYields] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [farmerSearch, setFarmerSearch] = useState("");
  const [farmerDetail, setFarmerDetail] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Crop Pricing state
  const [cropList, setCropList] = useState<any[]>([]);
  const [cropSaving, setCropSaving] = useState(false);
  const [cropSavedMessage, setCropSavedMessage] = useState(false);

  // Blog editor
  const [editing, setEditing] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
  const [blogSaving, setBlogSaving] = useState(false);
  const [showBlogEditor, setShowBlogEditor] = useState(false);

  const f = useCallback(async (url: string) => {
    const sep = url.includes("?") ? "&" : "?";
    const res = await fetch(`${API}${url}${sep}access_code=${code}`);
    if (res.ok) return res.json();
    return null;
  }, [code]);

  const fetchTab = useCallback(async (t: Tab) => {
    setLoading(true);
    if (t === "stats") { setStats(await f("/api/v1/analytics/stats")); setSummary(await f("/api/v1/admin/summary")); }
    else if (t === "dealers") { const d = await f(`/api/v1/admin/dealers?status=${dealerFilter}`); setDealers(d?.dealers || []); }
    else if (t === "yields") { const y = await f("/api/v1/analytics/yields/flagged"); setYields(y?.records || []); }
    else if (t === "blog") { const b = await f("/api/v1/blog/admin/all"); setPosts(b?.posts || []); }
    else if (t === "farmers") { const fm = await f(`/api/v1/admin/farmers?search=${farmerSearch}`); setFarmers(fm?.farmers || []); }
    else if (t === "audit") { const a = await f("/api/v1/analytics/audit-log"); setAudit(a?.logs || []); }
    else if (t === "crops") {
      const res = await fetch(`/api/admin/crops?access_code=${code}`);
      if (res.ok) {
        const data = await res.json();
        setCropList(data.crops || []);
      }
    }
    setLoading(false);
  }, [code, f, dealerFilter, farmerSearch]);

  const login = async () => {
    setAuthErr(false);
    const res = await fetch(`${API}/api/v1/analytics/stats?access_code=${code}`);
    if (res.ok) { setAuth(true); setStats(await res.json()); const s = await f("/api/v1/admin/summary"); setSummary(s); }
    else setAuthErr(true);
  };

  useEffect(() => { if (auth) fetchTab(tab); }, [auth, tab, dealerFilter]);

  // Actions
  const reviewDealer = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch(`${API}/api/v1/dealers/applications/${id}?access_code=${code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, officer_id: "admin" }) });
    setDealers(prev => prev.filter(d => d.id !== id));
    setActionLoading(null);
  };

  const reviewYield = async (id: number, status: string) => {
    setActionLoading(String(id));
    await fetch(`${API}/api/v1/analytics/yields/${id}/review?access_code=${code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, officer_id: "admin" }) });
    setYields(prev => prev.filter(y => y.id !== id));
    setActionLoading(null);
  };

  const saveBlogPost = async () => {
    setBlogSaving(true);
    try {
      const res = editing
        ? await fetch(`${API}/api/v1/blog/admin/${editing.id}?access_code=${code}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogForm) })
        : await fetch(`${API}/api/v1/blog/admin/create?access_code=${code}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogForm) });

      if (res.ok) {
        setEditing(null);
        setShowBlogEditor(false);
        setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
        alert(editing ? "Blog post updated successfully!" : "Blog post created successfully!");
        fetchTab("blog");
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Blog save failed:", err);
        alert(err.detail ? (typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail)) : `Failed to save blog post (${res.status})`);
      }
    } catch (e: any) {
      console.error("Blog save error:", e);
      alert("Network error: " + e.message);
    } finally {
      setBlogSaving(false);
    }
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`${API}/api/v1/blog/admin/${id}?access_code=${code}`, { method: "DELETE" });
    fetchTab("blog");
  };

  const editPost = (post: any) => {
    setEditing(post);
    setShowBlogEditor(true);
    setBlogForm({ title: post.title, content: post.content || "", excerpt: post.excerpt || "", category: post.category, status: post.status, read_time: post.read_time || "" });
    // Fetch full content if not already present
    if (!post.content) {
      fetch(`${API}/api/v1/blog/${post.slug}`).then(r => r.ok ? r.json() : null).then(d => { if (d) setBlogForm(f => ({ ...f, content: d.content })); });
    }
  };

  const loadFarmerDetail = async (id: string) => {
    if (farmerDetail?.farmer?.id === id) { setFarmerDetail(null); return; }
    const d = await f(`/api/v1/admin/farmers/${id}`);
    setFarmerDetail(d);
  };

  // ─── Login ───
  if (!auth) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="w-14 h-14 bg-forest-700/10 rounded-xl flex items-center justify-center mx-auto mb-6"><Lock size={28} className="text-forest-700" /></div>
        <h1 className="font-display text-2xl font-bold text-forest-700 text-center mb-2">Admin Dashboard</h1>
        <p className="text-soil-400 text-center text-sm mb-8">Enter your officer access code</p>
        <input type="password" placeholder="Access code" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 mb-4" />
        {authErr && <p className="text-sm text-red-600 mb-4 text-center">Invalid access code</p>}
        <button onClick={login} className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl transition-colors">Sign In</button>
      </div>
    </div>
  );

  // ─── Tabs ───
  const tabs: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "stats", label: "Overview", icon: BarChart3 },
    { key: "crops", label: "Crop Pricing", icon: Wheat },
    { key: "dealers", label: "Dealers", icon: Store, badge: summary?.pending_dealers },
    { key: "yields", label: "Yields", icon: AlertTriangle, badge: summary?.flagged_yields },
    { key: "blog", label: "Blog", icon: PenLine },
    { key: "farmers", label: "Farmers", icon: Users, badge: summary?.total_farmers },
    { key: "audit", label: "Audit", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-forest-700">Admin Dashboard</h1>
        <button onClick={() => fetchTab(tab)} className="flex items-center gap-2 px-4 py-2 text-sm text-soil-400 hover:text-forest-700 border border-cream-300 rounded-lg hover:border-gold-400 transition-colors"><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            { l: "Farmers", v: summary.total_farmers },
            { l: "Fields", v: summary.total_fields },
            { l: "Recommendations", v: summary.total_recommendations },
            { l: "Yields", v: summary.total_yields },
            { l: "Pending Dealers", v: summary.pending_dealers },
            { l: "Approved Dealers", v: summary.approved_dealers },
            { l: "Flagged Yields", v: summary.flagged_yields },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-lg p-3 border border-cream-300 text-center">
              <div className="font-display text-xl font-bold text-forest-700">{s.v}</div>
              <div className="text-xs text-soil-400">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(t => { const Icon = t.icon; return (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? "bg-forest-700 text-white" : "bg-white border border-cream-300 text-soil-400 hover:border-gold-400"}`}>
            <Icon size={16} />{t.label}
            {t.badge != null && t.badge > 0 && <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{t.badge}</span>}
          </button>
        );})}
      </div>

      {loading && <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-forest-700" /></div>}

      {/* ═══ STATS ═══ */}
      {!loading && tab === "stats" && stats && (
        stats.total_queries === 0 ? (
          <div className="text-center py-16 text-soil-400">
            <BarChart3 size={32} className="text-cream-300 mx-auto mb-4" />
            <p>No statistics data available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Soil Health Issues</h3>
              {Object.entries(stats.soil_health || {}).map(([k, v]) => (<div key={k} className="flex justify-between py-1"><span className="text-sm text-soil-400 capitalize">{k.replace(/_/g, " ")}</span><span className="font-semibold text-forest-700">{v as number}</span></div>))}
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Top Counties</h3>
              {Object.entries(stats.county_distribution || {}).sort(([,a],[,b]) => (b as number) - (a as number)).slice(0,8).map(([c, n]) => (<div key={c} className="flex justify-between py-1"><span className="text-sm text-soil-400">{c}</span><span className="font-semibold text-forest-700">{n as number}</span></div>))}
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Top Crops</h3>
              {Object.entries(stats.crop_distribution || {}).sort(([,a],[,b]) => (b as number) - (a as number)).slice(0,8).map(([c, n]) => (<div key={c} className="flex justify-between py-1"><span className="text-sm text-soil-400">{c}</span><span className="font-semibold text-forest-700">{n as number}</span></div>))}
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Feedback</h3>
              <div className="text-center py-4">
                <div className="font-display text-4xl font-bold text-forest-700">{stats.feedback?.average_rating?.toFixed(1) || "—"}</div>
                <div className="text-sm text-soil-400 mt-1">Average rating · {stats.feedback?.total_responses || 0} responses</div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ═══ CROPS ═══ */}
      {!loading && tab === "crops" && (
        <div className="bg-white rounded-2xl border border-cream-300 p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div>
              <h2 className="font-display text-lg font-bold text-forest-700">Crop Pricing & Yield Economics</h2>
              <p className="text-xs text-soil-400">Edit crop market prices and baseline yields. Changes take effect immediately across all crop guides and reports.</p>
            </div>
            <button
              onClick={async () => {
                setCropSaving(true);
                const res = await fetch(`/api/admin/crops?access_code=${code}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ crops: cropList }),
                });
                setCropSaving(false);
                if (res.ok) {
                  setCropSavedMessage(true);
                  setTimeout(() => setCropSavedMessage(false), 3000);
                  fetchTab("crops");
                }
              }}
              disabled={cropSaving}
              className="flex items-center gap-2 px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl shadow-sm transition-colors"
            >
              {cropSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Save Changes
            </button>
          </div>

          {cropSavedMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} /> Prices updated successfully and synced to Crop Guides!
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream-100 text-left border-b border-cream-200">
                  <th className="px-4 py-3 font-semibold text-forest-700">Crop</th>
                  <th className="px-4 py-3 font-semibold text-forest-700">Soil pH Range</th>
                  <th className="px-4 py-3 font-semibold text-forest-700">Market Price (KES/kg)</th>
                  <th className="px-4 py-3 font-semibold text-forest-700">Baseline Yield (kg/acre)</th>
                  <th className="px-4 py-3 font-semibold text-forest-700">Soil Texture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {cropList.map((cr, idx) => (
                  <tr key={cr.Crop} className="hover:bg-cream-50/50">
                    <td className="px-4 py-3 font-semibold text-forest-700 flex items-center gap-2">
                      <Wheat size={16} className="text-gold-500" />
                      {cr.Crop}
                    </td>
                    <td className="px-4 py-3 text-soil-400">
                      {cr.ph_min} – {cr.ph_max}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 max-w-[120px]">
                        <span className="text-soil-300 font-medium">KES</span>
                        <input
                          type="number"
                          value={cr.price_per_kg}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const updated = [...cropList];
                            updated[idx] = { ...updated[idx], price_per_kg: val };
                            setCropList(updated);
                          }}
                          className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-forest-700 font-semibold focus:outline-none focus:border-gold-400"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 max-w-[140px]">
                        <input
                          type="number"
                          value={cr.yield_per_acre}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            const updated = [...cropList];
                            updated[idx] = { ...updated[idx], yield_per_acre: val };
                            setCropList(updated);
                          }}
                          className="w-full px-2.5 py-1.5 border border-cream-300 rounded-lg text-forest-700 font-semibold focus:outline-none focus:border-gold-400"
                        />
                        <span className="text-soil-400 text-xs">kg</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-soil-400">
                      {cr.pref_texture}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ DEALERS ═══ */}
      {!loading && tab === "dealers" && (
        <div>
          <div className="flex gap-2 mb-6">
            {["pending", "approved", "declined", "all"].map(s => (
              <button key={s} onClick={() => setDealerFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${dealerFilter === s ? "bg-forest-700 text-white" : "bg-white border border-cream-300 text-soil-400"}`}>{s}</button>
            ))}
          </div>
          {dealers.length === 0 ? <p className="text-center py-12 text-soil-400">No {dealerFilter} applications.</p> : (
            <div className="space-y-4">
              {dealers.map(d => (
                <div key={d.id} className="bg-white rounded-xl border border-cream-300 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-forest-700 text-lg">{d.business_name}</h3>
                      <p className="text-sm text-soil-400">{d.town}, {d.county} · {d.phone_number}</p>
                      {d.products_stocked && <p className="text-xs text-soil-300 mt-1">Products: {d.products_stocked}</p>}
                      <p className="text-xs text-soil-300 mt-1">{new Date(d.created_at).toLocaleDateString("en-KE")}</p>
                      {d.decline_reason && <p className="text-xs text-red-500 mt-1">Reason: {d.decline_reason}</p>}
                    </div>
                    {d.status === "pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => reviewDealer(d.id, "approved")} disabled={actionLoading === d.id} className="flex items-center gap-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50"><Check size={14} /> Approve</button>
                        <button onClick={() => reviewDealer(d.id, "declined")} disabled={actionLoading === d.id} className="flex items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50"><X size={14} /> Decline</button>
                      </div>
                    )}
                    {d.status !== "pending" && <span className={`px-3 py-1 rounded-full text-xs font-semibold ${d.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{d.status}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ YIELDS ═══ */}
      {!loading && tab === "yields" && (
        <div>
          {yields.length === 0 ? <div className="text-center py-16"><CheckCircle size={32} className="text-green-500 mx-auto mb-4" /><p className="text-soil-400">No flagged yields.</p></div> : (
            <div className="space-y-4">
              {yields.map(y => (
                <div key={y.id} className="bg-white rounded-xl border border-cream-300 p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-forest-700">{y.crop} — {y.yield_bags_per_acre} bags/acre</h3>
                    <p className="text-sm text-soil-400">Farmer: {y.farmer_id} · {y.season}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full"><AlertTriangle size={12} /> {y.flag_reason}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => reviewYield(y.id, "verified")} disabled={actionLoading === String(y.id)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50"><Check size={14} /> Verify</button>
                    <button onClick={() => reviewYield(y.id, "rejected")} disabled={actionLoading === String(y.id)} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50"><X size={14} /> Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ BLOG EDITOR ═══ */}
      {!loading && tab === "blog" && (
        <div>
          {!showBlogEditor && !editing ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg font-bold text-forest-700">Blog Posts</h2>
                <button onClick={() => { setEditing(null); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); setShowBlogEditor(true); }} className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl"><Plus size={14} /> New Post</button>
              </div>
              {posts.length === 0 ? <p className="text-center py-12 text-soil-400">No blog posts yet.</p> : (
                <div className="space-y-3">
                  {posts.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border border-cream-300 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-forest-700">{p.title}</h3>
                        <div className="flex gap-3 mt-1 text-xs text-soil-400">
                          <span className={`px-2 py-0.5 rounded-full font-semibold ${p.status === "published" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{p.status}</span>
                          <span>{p.category}</span>
                          {p.published_at && <span>{new Date(p.published_at).toLocaleDateString("en-KE")}</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => editPost(p)} className="p-2 hover:bg-cream-100 rounded-lg"><PenLine size={16} className="text-forest-700" /></button>
                        {p.status === "published" && <a href={`/blog/${p.slug}`} target="_blank" className="p-2 hover:bg-cream-100 rounded-lg"><Eye size={16} className="text-forest-700" /></a>}
                        <button onClick={() => deleteBlogPost(p.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 size={16} className="text-red-500" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Blog editor form */
            <div className="bg-white rounded-2xl border border-cream-300 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg font-bold text-forest-700">{editing ? "Edit Post" : "New Post"}</h2>
                <button onClick={() => { setEditing(null); setShowBlogEditor(false); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); }} className="text-sm text-soil-400 hover:text-forest-700">← Back to list</button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-forest-700 mb-1 block">Title</label>
                  <input value={blogForm.title} onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} placeholder="Post title" className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:border-gold-400" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-forest-700 mb-1 block">Category</label>
                    <select value={blogForm.category} onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} className="w-full px-4 py-3 border border-cream-300 rounded-xl bg-white">
                      {["Guide", "Data Report", "Soil Science", "Fertilizer", "Seasonal", "News"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-forest-700 mb-1 block">Read time</label>
                    <input value={blogForm.read_time} onChange={e => setBlogForm({ ...blogForm, read_time: e.target.value })} placeholder="5 min read" className="w-full px-4 py-3 border border-cream-300 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-forest-700 mb-1 block">Status</label>
                    <select value={blogForm.status} onChange={e => setBlogForm({ ...blogForm, status: e.target.value })} className="w-full px-4 py-3 border border-cream-300 rounded-xl bg-white">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-forest-700 mb-1 block">Excerpt (shown in listing)</label>
                  <input value={blogForm.excerpt} onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} placeholder="Brief description..." className="w-full px-4 py-3 border border-cream-300 rounded-xl" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-forest-700 mb-1 block">Content (Markdown supported)</label>
                  <textarea value={blogForm.content} onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} placeholder="Write your blog post here...&#10;&#10;## Use headings&#10;&#10;**Bold text** and [links](/soil/nakuru) work.&#10;&#10;Link to county pages: [Nakuru soil report](/soil/nakuru)&#10;Link to crop pages: [Maize guide](/crops/maize)&#10;Link to the tool: [Get advice](/app)" rows={16} className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 font-mono text-sm focus:outline-none focus:border-gold-400 resize-y" />
                  <p className="text-xs text-soil-300 mt-1">Use ## for headings, **bold**, [text](url) for links. Link to /soil/county-name and /crops/crop-name for internal links.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={saveBlogPost} disabled={blogSaving || !blogForm.title || !blogForm.content} className="flex items-center gap-2 px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl">
                    {blogSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    {editing ? "Update Post" : "Create Post"}
                  </button>
                  {editing && blogForm.status === "draft" && (
                    <button onClick={async () => { const updatedForm = { ...blogForm, status: "published" }; setBlogForm(updatedForm); setBlogSaving(true); try { const res = editing ? await fetch(`${API}/api/v1/blog/admin/${editing.id}?access_code=${code}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedForm) }) : await fetch(`${API}/api/v1/blog/admin/create?access_code=${code}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updatedForm) }); if (res.ok) { setEditing(null); setShowBlogEditor(false); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); alert("Post published!"); fetchTab("blog"); } else { const err = await res.json().catch(() => ({})); alert(err.detail ? (typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail)) : `Failed (${res.status})`); } } finally { setBlogSaving(false); } }} className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl">Publish Now</button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ FARMERS ═══ */}
      {!loading && tab === "farmers" && (
        <div>
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-3.5 text-soil-400" />
              <input value={farmerSearch} onChange={e => setFarmerSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchTab("farmers")} placeholder="Search by name, phone, or county..." className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:border-gold-400" />
            </div>
            <button onClick={() => fetchTab("farmers")} className="px-6 py-3 bg-forest-700 text-white font-semibold rounded-xl">Search</button>
          </div>
          {farmers.length === 0 ? <p className="text-center py-12 text-soil-400">No farmers found.</p> : (
            <div className="space-y-3">
              {farmers.map(fm => (
                <div key={fm.id} className="bg-white rounded-xl border border-cream-300">
                  <button onClick={() => loadFarmerDetail(fm.id)} className="w-full p-4 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-forest-700/10 rounded-full flex items-center justify-center text-forest-700 font-bold text-sm">{fm.name?.charAt(0) || "?"}</div>
                      <div>
                        <h3 className="font-semibold text-forest-700">{fm.name || "Unnamed"}</h3>
                        <div className="flex gap-3 text-xs text-soil-400">
                          <span className="flex items-center gap-1"><Phone size={10} /> {fm.phone_number}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} /> {fm.county}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs text-soil-400 hidden sm:block">
                        <div>{fm.fields} fields · {fm.recommendations} recs · {fm.yields_logged} yields</div>
                        <div>{new Date(fm.created_at).toLocaleDateString("en-KE")}</div>
                      </div>
                      {farmerDetail?.farmer?.id === fm.id ? <ChevronDown size={16} className="text-soil-400" /> : <ChevronRight size={16} className="text-soil-400" />}
                    </div>
                  </button>
                  {farmerDetail?.farmer?.id === fm.id && (
                    <div className="border-t border-cream-200 p-4 bg-cream-50">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-soil-400 uppercase mb-2">Fields ({farmerDetail.fields.length})</h4>
                          {farmerDetail.fields.length === 0 ? <p className="text-xs text-soil-300">No fields registered</p> : farmerDetail.fields.map((f: any) => (
                            <div key={f.id} className="text-sm mb-2"><span className="font-medium text-forest-700">{f.name}</span><br /><span className="text-xs text-soil-400">{f.size_acres} acres · {f.primary_crop} · {f.ward || f.county}</span></div>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-soil-400 uppercase mb-2">Recent Recommendations ({farmerDetail.recommendations.length})</h4>
                          {farmerDetail.recommendations.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="text-sm mb-2"><span className="font-medium text-forest-700">{r.crop}</span> in {r.county}<br /><span className="text-xs text-soil-400">Score: {r.health_score} · KES {r.total_budget?.toLocaleString()} · {new Date(r.created_at).toLocaleDateString("en-KE")}</span></div>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-soil-400 uppercase mb-2">Yield History ({farmerDetail.yields.length})</h4>
                          {farmerDetail.yields.map((y: any) => (
                            <div key={y.id} className="text-sm mb-2"><span className="font-medium text-forest-700">{y.crop}</span> — {y.yield_bags_per_acre} bags/acre<br /><span className="text-xs text-soil-400">{y.season} · <span className={y.status === "flagged" ? "text-red-500" : "text-green-600"}>{y.status}</span></span></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══ AUDIT LOG ═══ */}
      {!loading && tab === "audit" && (
        <div>
          {audit.length === 0 ? <p className="text-center py-16 text-soil-400">No audit entries yet.</p> : (
            <div className="bg-white rounded-xl border border-cream-300 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-cream-100"><th className="px-4 py-3 text-left font-semibold text-forest-700">Action</th><th className="px-4 py-3 text-left font-semibold text-forest-700">Target</th><th className="px-4 py-3 text-left font-semibold text-forest-700">Details</th><th className="px-4 py-3 text-left font-semibold text-forest-700">Date</th></tr></thead>
                <tbody>{audit.map(a => (
                  <tr key={a.id} className="border-t border-cream-200">
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${a.action.includes("approved") || a.action.includes("verified") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{a.action.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3 text-soil-400">{a.target_type?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-soil-400">{a.details || "—"}</td>
                    <td className="px-4 py-3 text-soil-400 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("en-KE")}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
