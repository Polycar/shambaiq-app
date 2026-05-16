"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock, Store, BarChart3, AlertTriangle, FileText,
  Check, CheckCircle, X, Loader2, RefreshCw, Users, TrendingUp, MapPin, Wheat,
  PenLine, Eye, Trash2, Plus, Search, Phone, ChevronDown, ChevronRight, Download, Package
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

type Tab = "stats" | "dealers" | "yields" | "blog" | "farmers" | "audit" | "inventory";

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
  const [inventory, setInventory] = useState<any[]>([
    { name: "DAP", subsidized: 2500, commercial: 6500 },
    { name: "CAN", subsidized: 2500, commercial: 4500 },
    { name: "NPK 17:17:17", subsidized: 2500, commercial: 5600 },
    { name: "Urea", subsidized: 2500, commercial: 5500 },
    { name: "Lime", subsidized: 1500, commercial: 1800 },
    { name: "Mavuno", subsidized: 2500, commercial: 5800 },
    { name: "YaraMila Cereal", subsidized: 3500, commercial: 7200 },
    { name: "SSP", subsidized: 2500, commercial: 5200 },
    { name: "Manure", subsidized: 500, commercial: 1000 },
  ]);
  const [cropPrices, setCropPrices] = useState<any[]>([
    { crop: "Maize", price: 65 },
    { crop: "Beans", price: 110 },
    { crop: "Potatoes", price: 40 },
    { crop: "Tomatoes", price: 100 },
    { crop: "Kale (Sukuma)", price: 36 },
    { crop: "Wheat", price: 115 },
    { crop: "Sorghum", price: 80 },
    { crop: "Avocado", price: 50 },
    { crop: "Tea", price: 25 },
    { crop: "Finger Millet", price: 100 },
    { crop: "Cassava", price: 15 },
    { crop: "Sweet Potato", price: 25 },
    { crop: "Groundnuts", price: 120 },
    { crop: "Cowpeas", price: 80 },
    { crop: "Sunflower", price: 55 },
    { crop: "Coffee (Arabica)", price: 400 },
    { crop: "Macadamia", price: 150 },
    { crop: "Mangoes", price: 40 },
    { crop: "Onions", price: 80 },
    { crop: "Cabbage", price: 20 },
    { crop: "Cotton", price: 60 },
    { crop: "Pigeon Peas", price: 90 },
    { crop: "Rice (Upland)", price: 120 },
    { crop: "Sisal", price: 100 },
    { crop: "Pyrethrum", price: 250 },
  ]);
  const [farmerSearch, setFarmerSearch] = useState("");
  const [farmerDetail, setFarmerDetail] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Blog editor
  const [editing, setEditing] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [blogForm, setBlogForm] = useState({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
  const [blogSaving, setBlogSaving] = useState(false);

  const f = useCallback(async (url: string) => {
    try {
      const sep = url.includes("?") ? "&" : "?";
      const res = await fetch(`${API}${url}${sep}access_code=${code}`);
      if (res.ok) return res.json();
      return null;
    } catch (err) {
      console.error("Network error:", err);
      return null;
    }
  }, [code]);

  const fetchTab = useCallback(async (t: Tab) => {
    setLoading(true);
    if (t === "stats") { setStats(await f("/api/v1/analytics/stats")); setSummary(await f("/api/v1/admin/summary")); }
    else if (t === "dealers") { const d = await f(`/api/v1/admin/dealers?status=${dealerFilter}`); setDealers(d?.dealers || []); }
    else if (t === "yields") { const y = await f("/api/v1/analytics/yields/flagged"); setYields(y?.records || []); }
    else if (t === "blog") { const b = await f("/api/v1/blog/admin/all"); setPosts(b?.posts || []); }
    else if (t === "farmers") { const fm = await f(`/api/v1/admin/farmers?search=${farmerSearch}`); setFarmers(fm?.farmers || []); }
    else if (t === "audit") { const a = await f("/api/v1/analytics/audit-log"); setAudit(a?.logs || []); }
    else if (t === "inventory") { 
      const inv = await f("/api/v1/admin/inventory"); 
      if (inv?.items) setInventory(inv.items);
      if (inv?.crops) setCropPrices(inv.crops);
    }
    setLoading(false);
  }, [code, f, dealerFilter, farmerSearch]);

  const login = async () => {
    setAuthErr(false);
    try {
      const res = await fetch(`${API}/api/v1/analytics/stats?access_code=${code}`);
      if (res.ok) { 
        setAuth(true); 
        setStats(await res.json()); 
        const s = await f("/api/v1/admin/summary"); 
        setSummary(s); 
      }
      else setAuthErr(true);
    } catch (err) {
      console.error("Login fetch error:", err);
      setAuthErr(true);
    }
  };

  useEffect(() => { if (auth) fetchTab(tab); }, [auth, tab, dealerFilter]);

  // Actions
  const reviewDealer = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await fetch(`${API}/api/v1/dealers/applications/${id}?access_code=${code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, officer_id: "admin" }) });
      setDealers(prev => prev.filter(d => d.id !== id));
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const reviewYield = async (id: number, status: string) => {
    setActionLoading(String(id));
    try {
      await fetch(`${API}/api/v1/analytics/yields/${id}/review?access_code=${code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, officer_id: "admin" }) });
      setYields(prev => prev.filter(y => y.id !== id));
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const saveBlogPost = async () => {
    setBlogSaving(true);
    try {
      if (editing) {
        await fetch(`${API}/api/v1/blog/admin/${editing.id}?access_code=${code}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogForm) });
      } else {
        await fetch(`${API}/api/v1/blog/admin/create?access_code=${code}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(blogForm) });
      }
      setEditing(null);
      setIsCreating(false);
      setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
      fetchTab("blog");
    } catch (err) { console.error(err); }
    setBlogSaving(false);
  };

  const deleteBlogPost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`${API}/api/v1/blog/admin/${id}?access_code=${code}`, { method: "DELETE" });
      fetchTab("blog");
    } catch (err) { console.error(err); }
  };

  const editPost = (post: any) => {
    setEditing(post);
    setBlogForm({ title: post.title, content: "", excerpt: post.excerpt || "", category: post.category, status: post.status, read_time: post.read_time || "" });
    // Fetch full content
    try {
      fetch(`${API}/api/v1/blog/${post.slug}`).then(r => r.ok ? r.json() : null).then(d => { if (d) setBlogForm(f => ({ ...f, content: d.content })); }).catch(e => console.error(e));
    } catch (err) { console.error(err); }
  };

  const loadFarmerDetail = async (id: string) => {
    if (farmerDetail?.farmer?.id === id) { setFarmerDetail(null); return; }
    const d = await f(`/api/v1/admin/farmers/${id}`);
    setFarmerDetail(d);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => 
        headers.map(header => {
          let val = row[header] ?? "";
          if (typeof val === "object") val = JSON.stringify(val);
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    { key: "dealers", label: "Dealers", icon: Store, badge: summary?.pending_dealers },
    { key: "inventory", label: "Inventory", icon: Package },
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
          <div className="bg-white rounded-xl p-6 border border-cream-300 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-bold text-forest-700">Regional Input Demand</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-soil-400 bg-cream-100 px-2 py-1 rounded-md uppercase font-bold tracking-wider">Live Analytics</span>
                  <button 
                    onClick={() => {
                      const data = Object.entries(stats.county_distribution || {}).map(([c, n]) => ({ County: c, Recommendations: n }));
                      downloadCSV(data, "shambaiq_regional_demand");
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-forest-700 text-white text-xs font-bold rounded-lg hover:bg-forest-800 transition-all shadow-sm"
                  >
                    <Download size={12} /> Export CSV
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="pb-3 font-semibold text-soil-700">County</th>
                      <th className="pb-3 font-semibold text-soil-700 text-center">Primary Deficit</th>
                      <th className="pb-3 font-semibold text-soil-700 text-center">Recommended Input</th>
                      <th className="pb-3 font-semibold text-soil-700 text-right">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-100">
                    {Object.entries(stats.county_distribution || {}).sort(([,a],[,b]) => (b as number) - (a as number)).slice(0, 8).map(([county, count]) => {
                      const isAcidic = county === "Bungoma" || county === "Nandi" || county === "Uasin Gishu" || county === "Trans Nzoia";
                      return (
                        <tr key={county} className="hover:bg-cream-50/50 transition-colors">
                          <td className="py-3.5 font-bold text-forest-900">{county}</td>
                          <td className="py-3.5 text-center">
                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${
                              isAcidic ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"
                            }`}>
                              {isAcidic ? "Acidity (Low pH)" : "Nitrogen Deficit"}
                            </span>
                          </td>
                          <td className="py-3.5 text-center text-soil-600 font-medium">
                            {isAcidic ? "Lime + DAP" : "CAN / Urea"}
                          </td>
                          <td className="py-3.5 text-right font-bold text-forest-700">
                            {count as number} recs
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            <p className="mt-4 text-[11px] text-soil-300 italic">
              * This table aggregates real-time AI recommendations to predict local fertilizer demand.
            </p>
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
            <button 
              onClick={() => downloadCSV(dealers, `shambaiq_dealers_${dealerFilter}`)}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-forest-700 text-white rounded-lg hover:bg-forest-800 transition-all text-sm font-semibold shadow-md"
            >
              <Download size={14} /> Export CSV
            </button>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-lg font-bold text-forest-700">Flagged Yields</h2>
            <button 
              onClick={() => downloadCSV(yields, "shambaiq_flagged_yields")}
              className="flex items-center gap-2 px-4 py-2 bg-forest-700 text-white rounded-lg hover:bg-forest-800 transition-all text-sm font-semibold shadow-md"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
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
          {!editing && !isCreating ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-lg font-bold text-forest-700">Blog Posts</h2>
                <button onClick={() => { setEditing(null); setIsCreating(true); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); }} className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl"><Plus size={14} /> New Post</button>
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
                <button onClick={() => { setEditing(null); setIsCreating(false); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); }} className="text-sm text-soil-400 hover:text-forest-700">← Back to list</button>
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
                    <button onClick={() => { setBlogForm({ ...blogForm, status: "published" }); setTimeout(saveBlogPost, 100); }} className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl">Publish Now</button>
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
            <button 
              onClick={() => downloadCSV(farmers, "shambaiq_farmers")}
              className="flex items-center gap-2 px-6 py-3 bg-forest-700 text-white rounded-xl hover:bg-forest-800 transition-all font-semibold shadow-md"
            >
              <Download size={18} /> Export CSV
            </button>
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
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${a.action?.includes("approved") || a.action?.includes("verified") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{a.action?.replace(/_/g, " ") || "action"}</span></td>
                    <td className="px-4 py-3 text-soil-400">{a.target_type?.replace(/_/g, " ") || "—"}</td>
                    <td className="px-4 py-3 text-soil-400">{a.details || "—"}</td>
                    <td className="px-4 py-3 text-soil-400 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("en-KE")}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* ═══ INVENTORY ═══ */}
      {!loading && tab === "inventory" && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-cream-200 flex justify-between items-center bg-cream-50/50">
              <div>
                <h2 className="font-display text-lg font-bold text-forest-700">1. Fertilizer Price Manager</h2>
                <p className="text-xs text-soil-400">Manage input costs (Subsidized vs Commercial market rates).</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => downloadCSV(inventory, "shambaiq_fertilizer_prices")}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-forest-700 text-forest-700 font-semibold rounded-xl hover:bg-cream-50 transition-all text-sm"
                >
                  <Download size={14} /> Export CSV
                </button>
                <button 
                  onClick={async () => {
                    setLoading(true);
                    await fetch(`${API}/api/v1/admin/inventory/update?access_code=${code}`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ items: inventory, crops: cropPrices })
                    });
                    setLoading(false);
                    alert("All market prices updated successfully! 🚀");
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-forest-700 text-white font-semibold rounded-xl hover:bg-forest-800 transition-all shadow-lg shadow-forest-100"
                >
                  <Check size={16} /> Save All Changes
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-cream-50/30 text-soil-700">
                    <th className="px-6 py-4 font-semibold">Fertilizer Type</th>
                    <th className="px-6 py-4 font-semibold text-center">Subsidized (KES)</th>
                    <th className="px-6 py-4 font-semibold text-center">Commercial (KES)</th>
                    <th className="px-6 py-4 font-semibold text-right">Last Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {inventory.map((item, idx) => item && (
                    <tr key={item.name || idx} className="hover:bg-cream-50/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-forest-900">{item.name || "Unknown Item"}</td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="number" 
                          value={item.subsidized ?? 0} 
                          onChange={(e) => {
                            const newInv = [...inventory];
                            newInv[idx].subsidized = parseInt(e.target.value) || 0;
                            setInventory(newInv);
                          }}
                          className="w-24 px-3 py-1.5 border border-cream-200 rounded-lg text-center focus:ring-2 focus:ring-gold-200 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="number" 
                          value={item.commercial ?? 0} 
                          onChange={(e) => {
                            const newInv = [...inventory];
                            newInv[idx].commercial = parseInt(e.target.value) || 0;
                            setInventory(newInv);
                          }}
                          className="w-24 px-3 py-1.5 border border-cream-200 rounded-lg text-center focus:ring-2 focus:ring-gold-200 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-soil-300">
                        {item.updated_at ? new Date(item.updated_at).toLocaleDateString("en-KE") : "Live"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-cream-300 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-cream-200 flex justify-between items-center bg-cream-50/50">
              <div>
                <h2 className="font-display text-lg font-bold text-forest-700">2. Crop Selling Prices (KES/KG)</h2>
                <p className="text-xs text-soil-400">Manage the current market rate for farmer harvests.</p>
              </div>
              <button 
                onClick={() => downloadCSV(cropPrices, "shambaiq_crop_prices")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-forest-700 text-forest-700 font-semibold rounded-xl hover:bg-cream-50 transition-all text-sm"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-cream-50/30 text-soil-700">
                    <th className="px-6 py-4 font-semibold">Crop</th>
                    <th className="px-6 py-4 font-semibold text-center">Market Price (KES per KG)</th>
                    <th className="px-6 py-4 font-semibold text-right">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {cropPrices.map((item, idx) => item && (
                    <tr key={item.crop || idx} className="hover:bg-cream-50/20 transition-colors">
                      <td className="px-6 py-4 font-bold text-forest-900">{item.crop}</td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="number" 
                          value={item.price ?? 0} 
                          onChange={(e) => {
                            const newCrops = [...cropPrices];
                            newCrops[idx].price = parseInt(e.target.value) || 0;
                            setCropPrices(newCrops);
                          }}
                          className="w-32 px-3 py-1.5 border border-cream-200 rounded-lg text-center focus:ring-2 focus:ring-gold-200 outline-none"
                        />
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-soil-300">
                        Market Average
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
