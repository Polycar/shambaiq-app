"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock, Store, BarChart3, AlertTriangle, FileText,
  Check, CheckCircle, X, Loader2, RefreshCw, Users, TrendingUp, MapPin, Wheat,
  PenLine, Eye, Trash2, Plus, Search, Phone, ChevronDown, ChevronRight, Upload,
  Sparkles, Globe, Link2, Image, Columns,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

type Tab = "stats" | "dealers" | "yields" | "blog" | "farmers" | "audit" | "crops" | "agrovets";

const parseInlineMarkdown = (text: string): string => {
  return text
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="inline rounded my-1 max-w-full" />')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-forest-700">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-gold-600 hover:underline font-medium">$1</a>')
    .replace(/`(.+?)`/g, '<code class="bg-cream-100 px-1 border rounded font-mono text-xs text-forest-800">$1</code>');
};

const renderMarkdown = (content: string) => {
  if (!content) return [];
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("## ")) {
      const text = trimmed.substring(3).trim();
      const html = parseInlineMarkdown(text);
      return <h2 key={i} className="font-display text-2xl font-bold text-forest-700 mt-10 mb-4 pb-1 border-b border-cream-200" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (trimmed.startsWith("### ")) {
      const text = trimmed.substring(4).trim();
      const html = parseInlineMarkdown(text);
      return <h3 key={i} className="font-display text-xl font-bold text-forest-700 mt-8 mb-3" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (trimmed.startsWith(">")) {
      const lines = trimmed.split("\n").map(line => {
        const lineTrimmed = line.trim();
        return lineTrimmed.startsWith(">") ? lineTrimmed.substring(1).trim() : lineTrimmed;
      }).join(" ");
      const html = parseInlineMarkdown(lines);
      return (
        <blockquote key={i} className="border-l-4 border-gold-500 pl-4 py-2 my-4 italic text-soil-500 bg-cream-50/50 rounded-r-lg" dangerouslySetInnerHTML={{ __html: html }} />
      );
    }

    const lines = trimmed.split("\n");
    const isBulletList = lines.every(line => line.trim().startsWith("- ") || line.trim().startsWith("* "));
    if (isBulletList && lines.length > 0) {
      return (
        <ul key={i} className="list-disc pl-6 my-4 space-y-2 text-soil-500">
          {lines.map((line, idx) => {
            const text = line.trim().substring(2).trim();
            const html = parseInlineMarkdown(text);
            return <li key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </ul>
      );
    }

    const isOrderedList = lines.every(line => /^\d+\.\s+/.test(line.trim()));
    if (isOrderedList && lines.length > 0) {
      return (
        <ol key={i} className="list-decimal pl-6 my-4 space-y-2 text-soil-500">
          {lines.map((line, idx) => {
            const text = line.trim().replace(/^\d+\.\s+/, "").trim();
            const html = parseInlineMarkdown(text);
            return <li key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </ol>
      );
    }

    if (trimmed.startsWith("![") && trimmed.includes("](")) {
      const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imgMatch) {
        const alt = imgMatch[1];
        const url = imgMatch[2];
        return (
          <div key={i} className="my-6">
            <img src={url} alt={alt} className="rounded-xl border border-cream-200 shadow-sm max-w-full mx-auto" />
            {alt && <p className="text-center text-xs text-soil-400 mt-2 font-medium">{alt}</p>}
          </div>
        );
      }
    }

    const html = parseInlineMarkdown(trimmed);
    return <p key={i} className="text-soil-500 leading-relaxed mb-4 text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
  });
};

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
  const [cropPrices, setCropPrices] = useState<any[]>([]);
  const [cropPriceMsg, setCropPriceMsg] = useState<{type: "success"|"error", text: string} | null>(null);
  const [editingPrice, setEditingPrice] = useState<any | null>(null);
  const [newPriceForm, setNewPriceForm] = useState<{crop: string, price_per_kg: string, unit: string, market: string} | null>(null);
  const [priceCSVUploading, setPriceCSVUploading] = useState(false);
  const [priceSaving, setPriceSaving] = useState(false);

  // Agrovet CSV state
  const [agrovets, setAgrovets] = useState<any[]>([]);
  const [agrovetTotal, setAgrovetTotal] = useState(0);
  const [agrovetUploading, setAgrovetUploading] = useState(false);
  const [agrovetMsg, setAgrovetMsg] = useState<{type: "success"|"error", text: string} | null>(null);
  const [agrovetSearch, setAgrovetSearch] = useState("");

  // Blog editor
  const [editing, setEditing] = useState<any>(null);
  const [blogForm, setBlogForm] = useState({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
  const [blogSaving, setBlogSaving] = useState(false);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [focusKeyword, setFocusKeyword] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState<'write' | 'preview' | 'split'>('write');

  const f = useCallback(async (url: string) => {
    const res = await fetch(`${API}${url}`, { headers: { "Authorization": `Bearer ${code}` } });
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
      const res = await fetch(`${API}/api/v1/crops/prices/admin`, { headers: { "Authorization": `Bearer ${code}` } });
      if (res.ok) {
        const data = await res.json();
        setCropPrices(data.list || []);
      }
    }
    else if (t === "agrovets") {
      const res = await fetch(`${API}/api/v1/admin/agrovets/csv`, { headers: { "Authorization": `Bearer ${code}` } });
      if (res.ok) {
        const data = await res.json();
        setAgrovets(data.agrovets || []);
        setAgrovetTotal(data.count || 0);
      }
    }
    setLoading(false);
  }, [code, f, dealerFilter, farmerSearch]);

  const login = async () => {
    setAuthErr(false);
    const res = await fetch(`${API}/api/v1/analytics/stats`, { headers: { "Authorization": `Bearer ${code}` } });
    if (res.ok) { setAuth(true); setStats(await res.json()); const s = await f("/api/v1/admin/summary"); setSummary(s); }
    else setAuthErr(true);
  };

  useEffect(() => { if (auth) fetchTab(tab); }, [auth, tab, dealerFilter]);

  // Actions
  const reviewDealer = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch(`${API}/api/v1/dealers/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify({ status, officer_id: "admin" }) });
    setDealers(prev => prev.filter(d => d.id !== id));
    setActionLoading(null);
  };

  const reviewYield = async (id: number, status: string) => {
    setActionLoading(String(id));
    await fetch(`${API}/api/v1/analytics/yields/${id}/review`, { method: "PATCH", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify({ status, officer_id: "admin" }) });
    setYields(prev => prev.filter(y => y.id !== id));
    setActionLoading(null);
  };

  const saveBlogPost = async () => {
    setBlogSaving(true);
    try {
      const res = editing
        ? await fetch(`${API}/api/v1/blog/admin/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(blogForm) })
        : await fetch(`${API}/api/v1/blog/admin/create`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(blogForm) });

      if (res.ok) {
        setEditing(null);
        setShowBlogEditor(false);
        setActiveEditorTab("write");
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
    await fetch(`${API}/api/v1/blog/admin/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${code}` } });
    fetchTab("blog");
  };

  const editPost = (post: any) => {
    setEditing(post);
    setShowBlogEditor(true);
    setActiveEditorTab("write");
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

  const downloadCropTemplate = () => {
    const csv = "crop,price_per_kg,unit,market\nMaize,45,KES/kg,Nairobi\nBeans,120,KES/kg,Nairobi\nTomatoes,80,KES/kg,Nairobi";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "crop_prices_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handlePriceCSVUpload = async (file: File) => {
    setPriceCSVUploading(true);
    setCropPriceMsg(null);
    const form = new FormData(); form.append("file", file);
    try {
      const res = await fetch(`${API}/api/v1/crops/prices/csv`, { method: "POST", headers: { "Authorization": `Bearer ${code}` }, body: form });
      const data = await res.json();
      if (res.ok) { setCropPriceMsg({type: "success", text: `${data.upserted} crop prices updated from CSV`}); fetchTab("crops"); }
      else { setCropPriceMsg({type: "error", text: data.detail || "CSV upload failed"}); }
    } catch { setCropPriceMsg({type: "error", text: "Network error during upload"}); }
    finally { setPriceCSVUploading(false); }
  };

  const handleAddPrice = async () => {
    if (!newPriceForm) return;
    setPriceSaving(true);
    setCropPriceMsg(null);
    try {
      const res = await fetch(`${API}/api/v1/crops/prices`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` },
        body: JSON.stringify({ crop: newPriceForm.crop, price_per_kg: parseFloat(newPriceForm.price_per_kg), unit: newPriceForm.unit || "KES/kg", market: newPriceForm.market || "Nairobi" }),
      });
      const data = await res.json();
      if (res.ok) { setCropPriceMsg({type: "success", text: "Price added"}); setNewPriceForm(null); fetchTab("crops"); }
      else { setCropPriceMsg({type: "error", text: data.detail || "Failed to add price"}); }
    } catch { setCropPriceMsg({type: "error", text: "Network error"}); }
    finally { setPriceSaving(false); }
  };

  const saveEditedPrice = async (id: string) => {
    if (!editingPrice) return;
    setPriceSaving(true);
    setCropPriceMsg(null);
    try {
      const res = await fetch(`${API}/api/v1/crops/prices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` },
        body: JSON.stringify({ price_per_kg: parseFloat(editingPrice.price_per_kg), unit: editingPrice.unit, market: editingPrice.market }),
      });
      const data = await res.json();
      if (res.ok) { setCropPriceMsg({type: "success", text: "Price updated"}); setEditingPrice(null); fetchTab("crops"); }
      else { setCropPriceMsg({type: "error", text: data.detail || "Failed to update"}); }
    } catch { setCropPriceMsg({type: "error", text: "Network error"}); }
    finally { setPriceSaving(false); }
  };

  const deletePrice = async (id: string, cropName: string) => {
    if (!confirm(`Delete price for ${cropName}?`)) return;
    setCropPriceMsg(null);
    try {
      const res = await fetch(`${API}/api/v1/crops/prices/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${code}` } });
      if (res.ok) { setCropPriceMsg({type: "success", text: `Price for ${cropName} deleted`}); fetchTab("crops"); }
      else { const data = await res.json(); setCropPriceMsg({type: "error", text: data.detail || "Failed to delete"}); }
    } catch { setCropPriceMsg({type: "error", text: "Network error"}); }
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
    { key: "agrovets", label: "Agrovets CSV", icon: Upload },
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
        <div className="space-y-5">
          {cropPriceMsg && (
            <div className={`p-3 rounded-lg text-sm ${cropPriceMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {cropPriceMsg.text}
            </div>
          )}
          <div className="bg-white rounded-xl border border-cream-200 p-5">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="font-semibold text-forest-700 flex-1">Crop Market Prices ({cropPrices.length})</h3>
              <button onClick={downloadCropTemplate} className="flex items-center gap-1.5 px-3 py-1.5 border border-cream-300 text-soil-600 rounded-lg text-xs hover:border-forest-300 hover:text-forest-700 transition-colors">
                <FileText size={14} /> Template
              </button>
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-cream-300 text-soil-600 rounded-lg text-xs hover:border-forest-300 hover:text-forest-700 transition-colors">
                {priceCSVUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Upload CSV
                <input type="file" accept=".csv" className="hidden" onChange={async (e) => { const file = e.target.files?.[0]; if (file) { await handlePriceCSVUpload(file); e.target.value = ""; } }} />
              </label>
              <button onClick={() => setNewPriceForm({ crop: "", price_per_kg: "", unit: "KES/kg", market: "Nairobi" })} className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-700 text-white rounded-lg text-xs hover:bg-forest-800 transition-colors">
                <Plus size={14} /> Add Price
              </button>
            </div>

            {cropPrices.length === 0 && !newPriceForm && (
              <p className="text-soil-400 text-sm text-center py-8">
                No crop prices yet. Upload a CSV or add manually.
                <br /><span className="text-xs text-soil-300 mt-1 block">CSV format: crop, price_per_kg, unit, market</span>
              </p>
            )}

            {(cropPrices.length > 0 || newPriceForm) && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="text-left py-2 px-3 text-soil-500 font-semibold text-xs">Crop</th>
                      <th className="text-left py-2 px-3 text-soil-500 font-semibold text-xs">Price/kg</th>
                      <th className="text-left py-2 px-3 text-soil-500 font-semibold text-xs">Unit</th>
                      <th className="text-left py-2 px-3 text-soil-500 font-semibold text-xs">Market</th>
                      <th className="text-left py-2 px-3 text-soil-500 font-semibold text-xs">Updated</th>
                      <th className="py-2 px-3 w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newPriceForm && (
                      <tr className="border-b border-green-100 bg-green-50">
                        <td className="py-1.5 px-2"><input autoFocus value={newPriceForm.crop} onChange={e => setNewPriceForm(f => f ? {...f, crop: e.target.value} : f)} placeholder="e.g. Maize" className="border border-cream-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                        <td className="py-1.5 px-2"><input type="number" value={newPriceForm.price_per_kg} onChange={e => setNewPriceForm(f => f ? {...f, price_per_kg: e.target.value} : f)} placeholder="45" className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                        <td className="py-1.5 px-2"><input value={newPriceForm.unit} onChange={e => setNewPriceForm(f => f ? {...f, unit: e.target.value} : f)} className="border border-cream-300 rounded px-2 py-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                        <td className="py-1.5 px-2"><input value={newPriceForm.market} onChange={e => setNewPriceForm(f => f ? {...f, market: e.target.value} : f)} className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                        <td className="py-1.5 px-3 text-xs text-soil-400">—</td>
                        <td className="py-1.5 px-2">
                          <div className="flex gap-1">
                            <button onClick={handleAddPrice} disabled={priceSaving || !newPriceForm.crop || !newPriceForm.price_per_kg} className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800 transition-colors disabled:opacity-50">
                              {priceSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                            </button>
                            <button onClick={() => setNewPriceForm(null)} className="p-1.5 border border-cream-200 text-soil-500 rounded hover:border-red-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {cropPrices.map((p: any, i: number) => (
                      <tr key={p.id} className={`border-b border-cream-100 ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}>
                        {editingPrice?.id === p.id ? (
                          <>
                            <td className="py-1.5 px-3 text-xs font-medium text-forest-800">{p.crop}</td>
                            <td className="py-1.5 px-2"><input type="number" value={editingPrice.price_per_kg} onChange={e => setEditingPrice((prev: any) => ({...prev, price_per_kg: e.target.value}))} className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                            <td className="py-1.5 px-2"><input value={editingPrice.unit} onChange={e => setEditingPrice((prev: any) => ({...prev, unit: e.target.value}))} className="border border-cream-300 rounded px-2 py-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                            <td className="py-1.5 px-2"><input value={editingPrice.market} onChange={e => setEditingPrice((prev: any) => ({...prev, market: e.target.value}))} className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                            <td className="py-1.5 px-3 text-xs text-soil-400">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}</td>
                            <td className="py-1.5 px-2">
                              <div className="flex gap-1">
                                <button onClick={() => saveEditedPrice(p.id)} disabled={priceSaving} className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800 transition-colors disabled:opacity-50">
                                  {priceSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                </button>
                                <button onClick={() => setEditingPrice(null)} className="p-1.5 border border-cream-200 text-soil-500 rounded hover:border-red-300 hover:text-red-500 transition-colors"><X size={12} /></button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-2 px-3 font-medium text-forest-800">{p.crop}</td>
                            <td className="py-2 px-3 text-forest-700 font-semibold">KES {p.price_per_kg?.toLocaleString()}</td>
                            <td className="py-2 px-3 text-soil-500 text-xs">{p.unit}</td>
                            <td className="py-2 px-3 text-soil-500 text-xs">{p.market}</td>
                            <td className="py-2 px-3 text-xs text-soil-400">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}</td>
                            <td className="py-2 px-2">
                              <div className="flex gap-1">
                                <button onClick={() => setEditingPrice({ id: p.id, price_per_kg: String(p.price_per_kg), unit: p.unit, market: p.market })} className="p-1.5 text-soil-400 hover:text-forest-700 transition-colors"><PenLine size={14} /></button>
                                <button onClick={() => deletePrice(p.id, p.crop)} className="p-1.5 text-soil-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
                <button onClick={() => { setEditing(null); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); setShowBlogEditor(true); setActiveEditorTab("write"); }} className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl"><Plus size={14} /> New Post</button>
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
            /* Blog editor form with SEO Assistant */
            (() => {
              const focusKeywordLower = focusKeyword.trim().toLowerCase();
              
              // 1. Title Metrics
              const titleLen = blogForm.title.length;
              const isTitleLenGood = titleLen >= 30 && titleLen <= 60;
              const hasKeywordInTitle = focusKeywordLower ? blogForm.title.toLowerCase().includes(focusKeywordLower) : false;
              
              // 2. Content Metrics
              const rawContent = blogForm.content || "";
              const words = rawContent.trim() ? rawContent.trim().split(/\s+/) : [];
              const wordCount = words.length;
              const isWordCountGood = wordCount >= 300;
              
              const h2Matches = rawContent.match(/^##\s+(.+)$/gm) || [];
              const h2Count = h2Matches.length;
              const isH2CountGood = h2Count >= 2;
              
              const hasKeywordInH2 = focusKeywordLower 
                ? h2Matches.some(h => h.toLowerCase().includes(focusKeywordLower)) 
                : false;
                
              // Keyword density
              const keywordMatches = focusKeywordLower 
                ? (rawContent.toLowerCase().match(new RegExp(focusKeywordLower.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) || [])
                : [];
              const keywordCount = keywordMatches.length;
              const keywordDensity = wordCount > 0 ? ((keywordCount / wordCount) * 100).toFixed(1) : "0.0";
              
              // 3. Excerpt Metrics
              const excerptLen = blogForm.excerpt.length;
              const isExcerptLenGood = excerptLen >= 80 && excerptLen <= 160;
              const hasKeywordInExcerpt = focusKeywordLower ? blogForm.excerpt.toLowerCase().includes(focusKeywordLower) : false;
              
              // 4. Links & Media Metrics
              const linkMatches = [...rawContent.matchAll(/\[(.*?)\]\((.*?)\)/g)];
              const internalLinks = linkMatches.filter(m => {
                const url = m[2];
                return url && (url.includes("/soil/") || url.includes("/crops/") || url.includes("/app"));
              });
              const hasInternalLinks = internalLinks.length > 0;
              
              const imageMatches = [...rawContent.matchAll(/!\[(.*?)\]\((.*?)\)/g)];
              const hasImages = imageMatches.length > 0;
              const allImagesHaveAlts = hasImages && imageMatches.every(m => m[1] && m[1].trim().length >= 3);
              const imageAltIssues = hasImages && !allImagesHaveAlts;
              
              const lowerContent = rawContent.toLowerCase();
              const linkSuggestions: { keyword: string; text: string; link: string }[] = [];
              
              if (lowerContent.includes("maize") && !lowerContent.includes("/crops/maize")) {
                linkSuggestions.push({ keyword: "maize", text: "Maize Farming Guide", link: "/crops/maize" });
              }
              if (lowerContent.includes("potato") && !lowerContent.includes("/crops/potato")) {
                linkSuggestions.push({ keyword: "potato", text: "Potato Farming Guide", link: "/crops/potato" });
              }
              if (lowerContent.includes("tomato") && !lowerContent.includes("/crops/tomato")) {
                linkSuggestions.push({ keyword: "tomato", text: "Tomato Farming Guide", link: "/crops/tomato" });
              }
              if (lowerContent.includes("nakuru") && !lowerContent.includes("/soil/nakuru")) {
                linkSuggestions.push({ keyword: "nakuru", text: "Nakuru Soil Report", link: "/soil/nakuru" });
              }
              if (lowerContent.includes("meru") && !lowerContent.includes("/soil/meru")) {
                linkSuggestions.push({ keyword: "meru", text: "Meru Soil Report", link: "/soil/meru" });
              }
              if (lowerContent.includes("uasin") && !lowerContent.includes("/soil/uasin-gishu")) {
                linkSuggestions.push({ keyword: "uasin", text: "Uasin Gishu Soil Report", link: "/soil/uasin-gishu" });
              }
              if (lowerContent.includes("fertilizer") && !lowerContent.includes("/app")) {
                linkSuggestions.push({ keyword: "fertilizer", text: "ShambaIQ Advisory Tool", link: "/app" });
              }
              
              // 5. Score Calculation
              let score = 0;
              if (isTitleLenGood) score += 15;
              if (hasKeywordInTitle) score += 15;
              if (isWordCountGood) score += 15;
              if (isH2CountGood) score += 10;
              if (hasKeywordInH2) score += 10;
              if (isExcerptLenGood) score += 15;
              if (hasKeywordInExcerpt) score += 10;
              if (hasInternalLinks) score += 10;
              
              if (hasImages) {
                if (allImagesHaveAlts) score += 10;
              } else {
                score += 5; // standard partial credit for having no broken images
              }
              
              score = Math.min(score, 100);
              
              // Color variables
              const scoreColor = score >= 80 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : score >= 50 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-rose-700 bg-rose-50 border-rose-200";
              const scoreBarColor = score >= 80 ? "bg-emerald-600" : score >= 50 ? "bg-amber-500" : "bg-rose-500";
              
              // Slug generation
              const slugPreview = blogForm.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") || "untitled-post";

              return (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
                  {/* Left: Blog Editor Form */}
                  <div className="lg:col-span-2 bg-white rounded-2xl border border-cream-300 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-cream-100">
                      <div>
                        <h2 className="font-display text-xl font-bold text-forest-700">{editing ? "Edit Post" : "Create New Post"}</h2>
                        <p className="text-xs text-soil-400">Draft or publish helpful crop guides, seasonal tips, or soil science reports.</p>
                      </div>
                      <button onClick={() => { setEditing(null); setShowBlogEditor(false); setActiveEditorTab("write"); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); }} className="text-sm font-medium text-soil-500 hover:text-forest-700 transition-colors">← Back to list</button>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-semibold text-forest-700 mb-1.5 block">Title</label>
                        <input 
                          value={blogForm.title} 
                          onChange={e => setBlogForm({ ...blogForm, title: e.target.value })} 
                          placeholder="e.g., How to Maximize Maize Yields in Nakuru County" 
                          className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 font-semibold placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-semibold text-forest-700 mb-1.5 block">Category</label>
                          <select 
                            value={blogForm.category} 
                            onChange={e => setBlogForm({ ...blogForm, category: e.target.value })} 
                            className="w-full px-4 py-3 border border-cream-300 rounded-xl bg-white text-forest-700 focus:outline-none focus:border-gold-400"
                          >
                            {["Guide", "Data Report", "Soil Science", "Fertilizer", "Seasonal", "News"].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-forest-700 mb-1.5 block">Read Time</label>
                          <input 
                            value={blogForm.read_time} 
                            onChange={e => setBlogForm({ ...blogForm, read_time: e.target.value })} 
                            placeholder="e.g., 5 min read" 
                            className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:border-gold-400" 
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-semibold text-forest-700 mb-1.5 block">Status</label>
                          <select 
                            value={blogForm.status} 
                            onChange={e => setBlogForm({ ...blogForm, status: e.target.value })} 
                            className="w-full px-4 py-3 border border-cream-300 rounded-xl bg-white text-forest-700 focus:outline-none focus:border-gold-400"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-sm font-semibold text-forest-700 block">Excerpt / Meta Description</label>
                          <span className={`text-xs font-semibold ${isExcerptLenGood ? "text-emerald-600" : "text-soil-400"}`}>
                            {excerptLen} / 160 characters (ideal: 80-160)
                          </span>
                        </div>
                        <textarea 
                          value={blogForm.excerpt} 
                          onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })} 
                          placeholder="Provide a compelling summary of the article (used in meta tags and listing pages)..." 
                          rows={2}
                          className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 resize-none text-sm" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex border border-cream-300 rounded-lg p-0.5 bg-cream-50">
                            <button
                              type="button"
                              onClick={() => setActiveEditorTab("write")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                activeEditorTab === "write"
                                  ? "bg-white text-forest-700 shadow-sm border border-cream-200"
                                  : "text-soil-400 hover:text-forest-700"
                              }`}
                            >
                              <PenLine size={13} />
                              Write
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveEditorTab("preview")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                activeEditorTab === "preview"
                                  ? "bg-white text-forest-700 shadow-sm border border-cream-200"
                                  : "text-soil-400 hover:text-forest-700"
                              }`}
                            >
                              <Eye size={13} />
                              Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveEditorTab("split")}
                              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                activeEditorTab === "split"
                                  ? "bg-white text-forest-700 shadow-sm border border-cream-200"
                                  : "text-soil-400 hover:text-forest-700"
                              }`}
                            >
                              <Columns size={13} />
                              Split View
                            </button>
                          </div>
                          
                          <span className={`text-xs font-semibold ${isWordCountGood ? "text-emerald-600" : "text-soil-400"}`}>
                            {wordCount} words
                          </span>
                        </div>

                        {activeEditorTab === "write" && (
                          <>
                            <textarea 
                              value={blogForm.content} 
                              onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} 
                              placeholder="Write your blog post here...&#10;&#10;## Use headings&#10;&#10;**Bold text** and [links](/soil/nakuru) work.&#10;&#10;Link to county pages: [Nakuru soil report](/soil/nakuru)&#10;Link to crop pages: [Maize guide](/crops/maize)&#10;Link to the tool: [Get advice](/app)" 
                              rows={18} 
                              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 font-mono text-sm focus:outline-none focus:border-gold-400 resize-y" 
                            />
                            <div className="bg-cream-50 rounded-lg p-3 border border-cream-200 mt-2 text-xs text-soil-400 leading-relaxed">
                              <span className="font-semibold text-forest-700 block mb-1">Markdown formatting tips:</span>
                              Use <code className="bg-white px-1 border rounded">## Heading Title</code> to create H2 sections. Create links with <code className="bg-white px-1 border rounded">[Link Text](/url)</code>. Add optimized images using <code className="bg-white px-1 border rounded">![Alt Text](image_url)</code>.
                            </div>
                          </>
                        )}

                        {activeEditorTab === "preview" && (
                          <div className="w-full min-h-[380px] max-h-[600px] overflow-y-auto px-6 py-6 border border-cream-300 rounded-xl bg-white text-forest-700 prose prose-forest max-w-none shadow-inner leading-relaxed">
                            {blogForm.content.trim() ? (
                              renderMarkdown(blogForm.content)
                            ) : (
                              <p className="text-soil-300 italic text-center py-20 text-sm">Nothing to preview yet. Write some markdown content in the 'Write' tab.</p>
                            )}
                          </div>
                        )}

                        {activeEditorTab === "split" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                              <textarea 
                                value={blogForm.content} 
                                onChange={e => setBlogForm({ ...blogForm, content: e.target.value })} 
                                placeholder="Write your blog post here..." 
                                rows={20} 
                                className="w-full h-full min-h-[450px] px-4 py-3 border border-cream-300 rounded-xl text-forest-700 font-mono text-sm focus:outline-none focus:border-gold-400 resize-none" 
                              />
                            </div>
                            <div className="w-full h-full min-h-[450px] max-h-[600px] overflow-y-auto px-6 py-6 border border-cream-300 rounded-xl bg-white text-forest-700 prose prose-forest max-w-none shadow-inner leading-relaxed">
                              {blogForm.content.trim() ? (
                                renderMarkdown(blogForm.content)
                              ) : (
                                <p className="text-soil-300 italic text-center py-20 text-sm font-medium">Nothing to preview yet. Start typing on the left pane.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 pt-2">
                        <button onClick={saveBlogPost} disabled={blogSaving || !blogForm.title || !blogForm.content} className="flex items-center gap-2 px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors shadow-sm">
                          {blogSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          {editing ? "Update Post" : "Create Post"}
                        </button>
                        {editing && blogForm.status === "draft" && (
                          <button onClick={async () => { const updatedForm = { ...blogForm, status: "published" }; setBlogForm(updatedForm); setBlogSaving(true); try { const res = editing ? await fetch(`${API}/api/v1/blog/admin/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(updatedForm) }) : await fetch(`${API}/api/v1/blog/admin/create`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(updatedForm) }); if (res.ok) { setEditing(null); setShowBlogEditor(false); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); alert("Post published!"); fetchTab("blog"); } else { const err = await res.json().catch(() => ({})); alert(err.detail ? (typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail)) : `Failed (${res.status})`); } } finally { setBlogSaving(false); } }} className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl shadow-sm transition-colors">Publish Now</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: SEO Assistant side panel */}
                  <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
                    {/* Focus Keyword Input Card */}
                    <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gold-50 border border-gold-200 text-gold-600 rounded-lg">
                          <Sparkles size={16} />
                        </div>
                        <h3 className="font-display font-bold text-forest-700 text-sm">Focus Keyword</h3>
                      </div>
                      <div className="relative">
                        <Search size={16} className="absolute left-3.5 top-3.5 text-soil-300" />
                        <input 
                          value={focusKeyword}
                          onChange={e => setFocusKeyword(e.target.value)}
                          placeholder="e.g., soil health, maize guide" 
                          className="w-full pl-9 pr-4 py-2.5 border border-cream-300 rounded-xl text-forest-700 text-sm placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 font-medium"
                        />
                      </div>
                      <p className="text-[11px] text-soil-400 mt-2 leading-relaxed">
                        Specify the search query this post aims to rank for. Real-time checklist matches will sync below.
                      </p>
                    </div>

                    {/* SEO Score Display */}
                    <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all duration-300`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[11px] font-bold text-soil-400 uppercase tracking-wider block">SEO Health Score</span>
                          <span className="font-display text-3xl font-extrabold text-forest-700">{score}<span className="text-sm font-normal text-soil-300">/100</span></span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                          {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-cream-100 rounded-full h-2 mb-3 overflow-hidden border border-cream-200/50">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-soil-400 leading-relaxed">
                        {score >= 80 
                          ? "🎉 Excellent optimization! Your blog post adheres to advanced SEO standards and is ready to compete on Google."
                          : score >= 50
                          ? "👍 Solid foundation. Complete the remaining items in the checklists below to maximize search indexability."
                          : "⚠️ Low search compliance. Optimize the content structure, meta tags, and include key internal links."}
                      </p>
                    </div>

                    {/* SERP Search Preview */}
                    <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-cream-100">
                        <Globe size={15} className="text-soil-400" />
                        <h3 className="font-display font-bold text-forest-700 text-sm">Google SERP Snippet Preview</h3>
                      </div>
                      
                      <div className="bg-cream-50/50 p-4 border border-cream-200 rounded-xl font-sans text-left space-y-1.5 shadow-inner">
                        {/* URL snippet */}
                        <div className="flex items-center gap-1.5 text-xs text-soil-400 truncate">
                          <span className="bg-cream-200 px-1 py-0.5 rounded text-[9px] font-semibold text-forest-700 uppercase tracking-tight">organic</span>
                          <span className="truncate">https://shambaiq.com › blog › {slugPreview}</span>
                        </div>
                        {/* Blue Google link title */}
                        <a href="#" className="font-sans text-[#1a0dab] hover:underline font-normal text-[17px] leading-tight block truncate">
                          {blogForm.title || "Post Title Preview"}
                        </a>
                        {/* Snippet Description */}
                        <p className="text-xs text-soil-400 font-sans leading-relaxed line-clamp-2">
                          {blogForm.excerpt || "Please enter an excerpt / meta description to preview how this listing description will appear in Google Search results..."}
                        </p>
                      </div>
                    </div>

                    {/* Checklists Widget */}
                    <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm space-y-5">
                      {/* Section 1: Title & Headings */}
                      <div>
                        <h4 className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-cream-100 flex justify-between items-center">
                          <span>1. Title & Structure</span>
                          <span className="text-[10px] font-normal text-soil-300 font-mono">35 points</span>
                        </h4>
                        
                        <div className="space-y-2">
                          {/* Title length check */}
                          <div className="flex items-start gap-2.5 text-xs">
                            {isTitleLenGood ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className={`font-medium ${isTitleLenGood ? "text-forest-700" : "text-soil-500"}`}>Title Character Count</span>
                                <span className="font-semibold text-soil-400">{titleLen}/60 chars</span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                Ideal: 30 to 60 characters for search snippet formatting.
                              </p>
                            </div>
                          </div>

                          {/* Focus Keyword in Title */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            {hasKeywordInTitle ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <span className={`font-medium ${hasKeywordInTitle ? "text-forest-700" : "text-soil-500"}`}>Keyword in Title</span>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                {focusKeyword 
                                  ? `Include "${focusKeyword}" in the article title.` 
                                  : "Define a focus keyword to trace title optimization."}
                              </p>
                            </div>
                          </div>

                          {/* Heading Hierarchy check */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            {isH2CountGood ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className={`font-medium ${isH2CountGood ? "text-forest-700" : "text-soil-500"}`}>H2 Subheadings</span>
                                <span className="font-semibold text-soil-400">{h2Count} found</span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                Add at least two subheadings starting with <code className="bg-cream-50 border px-1 rounded">## </code> for clear content hierarchy.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Content Optimization */}
                      <div>
                        <h4 className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-cream-100 flex justify-between items-center">
                          <span>2. Content Analytics</span>
                          <span className="text-[10px] font-normal text-soil-300 font-mono">35 points</span>
                        </h4>
                        
                        <div className="space-y-2">
                          {/* Word Count */}
                          <div className="flex items-start gap-2.5 text-xs">
                            {isWordCountGood ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className={`font-medium ${isWordCountGood ? "text-forest-700" : "text-soil-500"}`}>Minimum Word Count</span>
                                <span className="font-semibold text-soil-400">{wordCount} / 300 words</span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                Ideal posts contain at least 300 words to establish high authority.
                              </p>
                            </div>
                          </div>

                          {/* Focus Keyword in Subheading */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            {hasKeywordInH2 ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <span className={`font-medium ${hasKeywordInH2 ? "text-forest-700" : "text-soil-500"}`}>Keyword in H2 Subheadings</span>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                {focusKeyword 
                                  ? `Include "${focusKeyword}" in at least one H2 heading.` 
                                  : "Define a focus keyword to verify subheading placement."}
                              </p>
                            </div>
                          </div>

                          {/* Keyword Density */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            <div className="p-0.5 bg-cream-100 rounded text-forest-700 mt-0.5 shrink-0">
                              <TrendingUp size={10} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-medium text-forest-700">Keyword Density / Count</span>
                                <span className="font-semibold text-soil-400">{keywordDensity}% ({keywordCount}x)</span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                Density matches for focus keyword. Standard ranges lie between 0.5% and 2.5%.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Metadata & Links */}
                      <div>
                        <h4 className="text-xs font-bold text-forest-700 uppercase tracking-wider mb-2.5 pb-1.5 border-b border-cream-100 flex justify-between items-center">
                          <span>3. Metadata, Links & Media</span>
                          <span className="text-[10px] font-normal text-soil-300 font-mono">30 points</span>
                        </h4>
                        
                        <div className="space-y-2">
                          {/* Excerpt Meta description length */}
                          <div className="flex items-start gap-2.5 text-xs">
                            {isExcerptLenGood ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className={`font-medium ${isExcerptLenGood ? "text-forest-700" : "text-soil-500"}`}>Excerpt Length</span>
                                <span className="font-semibold text-soil-400">{excerptLen}/160 chars</span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                Keep between 80 and 160 characters to ensure it is not truncated on search listings.
                              </p>
                            </div>
                          </div>

                          {/* Focus Keyword in Excerpt */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            {hasKeywordInExcerpt ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <span className={`font-medium ${hasKeywordInExcerpt ? "text-forest-700" : "text-soil-500"}`}>Keyword in Excerpt</span>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                {focusKeyword 
                                  ? `Integrate "${focusKeyword}" into the summary excerpt.` 
                                  : "Define a focus keyword to verify meta description presence."}
                              </p>
                            </div>
                          </div>

                          {/* Internal Links */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            {hasInternalLinks ? (
                              <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                            ) : (
                              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className={`font-medium ${hasInternalLinks ? "text-forest-700" : "text-soil-500"}`}>Internal Linking</span>
                                <span className="font-semibold text-soil-400">{internalLinks.length} added</span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                Link to other platform pages (e.g. <code className="bg-cream-50 border px-1 rounded">(/soil/nakuru)</code> or <code className="bg-cream-50 border px-1 rounded">(/crops/maize)</code>) to improve navigation authority.
                              </p>

                              {hasInternalLinks && (
                                <div className="mt-2 pl-3 pr-2 py-2 bg-cream-50 rounded-lg border border-cream-200 text-[10px] text-soil-500 space-y-1">
                                  <span className="font-bold text-forest-700 block mb-1">Detected Platform Links:</span>
                                  {internalLinks.map((m, idx) => {
                                    const text = m[1] || "";
                                    const url = m[2] || "";
                                    return (
                                      <div key={idx} className="flex items-center gap-1">
                                        <Link2 size={10} className="text-soil-400 shrink-0" />
                                        <span className="font-semibold text-forest-700 truncate max-w-[80px]">&#34;{text}&#34;</span>
                                        <span className="text-soil-300 shrink-0">→</span>
                                        <code className="bg-white border px-1 rounded text-[9px] truncate max-w-[90px]">{url}</code>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {linkSuggestions.length > 0 && (
                                <div className="mt-2.5 pl-3 pr-2 py-2 bg-gold-50 border border-gold-200 text-[10px] text-gold-850 rounded-lg space-y-1">
                                  <span className="font-bold flex items-center gap-1 text-gold-800"><Sparkles size={10} className="text-gold-600" /> Link Suggestions:</span>
                                  <p className="text-[9px] text-gold-600 leading-snug">We noticed these keywords. Copy-paste these internal links to boost SEO ranking:</p>
                                  <div className="space-y-1 mt-1">
                                    {linkSuggestions.slice(0, 3).map((s, idx) => (
                                      <div key={idx} className="flex flex-col gap-0.5 bg-white border border-gold-150 p-1.5 rounded">
                                        <span className="font-medium text-forest-700">Keyword: &#34;{s.keyword}&#34;</span>
                                        <code className="text-soil-500 text-[9px] select-all font-mono">[{s.text}]({s.link})</code>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Image Alt tags */}
                          <div className="flex items-start gap-2.5 text-xs pt-1">
                            {hasImages ? (
                              imageAltIssues ? (
                                <AlertTriangle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                              ) : (
                                <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                              )
                            ) : (
                              <div className="p-0.5 bg-cream-100 rounded text-forest-700 mt-0.5 shrink-0">
                                <Image size={10} />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className={`font-medium ${hasImages && !imageAltIssues ? "text-forest-700" : "text-soil-500"}`}>Image Alt Tags</span>
                                <span className="font-semibold text-soil-400">
                                  {hasImages ? `${imageMatches.length} img` : "No images"}
                                </span>
                              </div>
                              <p className="text-[10px] text-soil-400 mt-0.5 leading-snug">
                                {!hasImages 
                                  ? "Tip: Add standard images with ![descriptive alt text](image_url) to improve rich readability."
                                  : imageAltIssues
                                  ? "⚠️ Some images are missing descriptive alt texts. Ensure the alt text is at least 3 characters long."
                                  : "🎉 All images have descriptive alt texts correctly optimized for screen readers and search engines."}
                              </p>

                              {hasImages && (
                                <div className="mt-2 pl-3 pr-2 py-2 bg-cream-50 rounded-lg border border-cream-200 text-[10px] text-soil-500 space-y-1">
                                  <span className="font-bold text-forest-700 block mb-1">Image Alt Text Audit:</span>
                                  {imageMatches.map((m, idx) => {
                                    const alt = m[1] || "";
                                    const url = m[2] || "";
                                    const isGood = alt.trim().length >= 3;
                                    return (
                                      <div key={idx} className="flex items-center justify-between gap-1">
                                        <span className="truncate max-w-[100px] font-mono text-soil-400">{url.split('/').pop()}</span>
                                        {isGood ? (
                                          <span className="text-emerald-600 font-medium flex items-center gap-0.5"><Check size={9} /> &#34;{alt}&#34;</span>
                                        ) : (
                                          <span className="text-rose-500 font-semibold flex items-center gap-0.5"><AlertTriangle size={9} /> Alt missing/short</span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
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

      {/* ═══ AGROVETS CSV ═══ */}
      {!loading && tab === "agrovets" && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-cream-300 p-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
              <div>
                <h2 className="font-display text-lg font-bold text-forest-700">Agrovet Directory</h2>
                <p className="text-xs text-soil-400">Upload a CSV to add or replace agrovets in the directory. CSV must have at least <code className="bg-cream-100 px-1 rounded">name</code> and <code className="bg-cream-100 px-1 rounded">county</code> columns.</p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-forest-700">{agrovetTotal}</div>
                <div className="text-xs text-soil-400">Total Agrovets</div>
              </div>
            </div>

            {agrovetMsg && (
              <div className={`mb-6 p-4 text-sm font-semibold rounded-xl flex items-center gap-2 ${agrovetMsg.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
                {agrovetMsg.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                {agrovetMsg.text}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-forest-700 mb-2 block">Add to existing directory</label>
                <label className={`flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-cream-300 rounded-xl cursor-pointer hover:border-gold-400 transition-colors ${agrovetUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <Upload size={20} className="text-soil-400" />
                  <span className="text-sm text-soil-400">{agrovetUploading ? "Uploading..." : "Drop CSV or click to browse"}</span>
                  <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    setAgrovetUploading(true); setAgrovetMsg(null);
                    const form = new FormData(); form.append("file", file);
                    try {
                      const res = await fetch(`${API}/api/v1/admin/agrovets/csv`, { method: "POST", headers: { "Authorization": `Bearer ${code}` }, body: form });
                      const data = await res.json();
                      if (res.ok) { setAgrovetMsg({type: "success", text: data.message}); fetchTab("agrovets"); }
                      else { setAgrovetMsg({type: "error", text: data.detail || "Upload failed"}); }
                    } catch { setAgrovetMsg({type: "error", text: "Network error"}); }
                    setAgrovetUploading(false); e.target.value = "";
                  }} />
                </label>
              </div>
              <div>
                <label className="text-sm font-semibold text-forest-700 mb-2 block">Replace entire directory</label>
                <label className={`flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-red-200 rounded-xl cursor-pointer hover:border-red-400 transition-colors ${agrovetUploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <Upload size={20} className="text-red-400" />
                  <span className="text-sm text-red-400">Replace all (destructive)</span>
                  <input type="file" accept=".csv" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return;
                    if (!confirm(`This will REPLACE all ${agrovetTotal} existing agrovets with the data in this file. Continue?`)) { e.target.value = ""; return; }
                    setAgrovetUploading(true); setAgrovetMsg(null);
                    const form = new FormData(); form.append("file", file);
                    try {
                      const res = await fetch(`${API}/api/v1/admin/agrovets/csv/replace`, { method: "POST", headers: { "Authorization": `Bearer ${code}` }, body: form });
                      const data = await res.json();
                      if (res.ok) { setAgrovetMsg({type: "success", text: data.message}); fetchTab("agrovets"); }
                      else { setAgrovetMsg({type: "error", text: data.detail || "Upload failed"}); }
                    } catch { setAgrovetMsg({type: "error", text: "Network error"}); }
                    setAgrovetUploading(false); e.target.value = "";
                  }} />
                </label>
              </div>
            </div>

            {/* Search and Table */}
            <div className="mb-4">
              <div className="relative">
                <Search size={16} className="absolute left-4 top-3.5 text-soil-400" />
                <input value={agrovetSearch} onChange={e => setAgrovetSearch(e.target.value)} placeholder="Search agrovets by name or county..." className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:border-gold-400" />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="bg-cream-100 text-left border-b border-cream-200">
                    <th className="px-4 py-3 font-semibold text-forest-700">Name</th>
                    <th className="px-4 py-3 font-semibold text-forest-700">County</th>
                    <th className="px-4 py-3 font-semibold text-forest-700">Town</th>
                    <th className="px-4 py-3 font-semibold text-forest-700">Phone</th>
                    <th className="px-4 py-3 font-semibold text-forest-700">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-100">
                  {agrovets
                    .filter(a => !agrovetSearch || a.name?.toLowerCase().includes(agrovetSearch.toLowerCase()) || a.county?.toLowerCase().includes(agrovetSearch.toLowerCase()))
                    .slice(0, 100)
                    .map((a, i) => (
                    <tr key={i} className="hover:bg-cream-50/50">
                      <td className="px-4 py-3 font-medium text-forest-700">{a.name}</td>
                      <td className="px-4 py-3 text-soil-400">{a.county}</td>
                      <td className="px-4 py-3 text-soil-400">{a.town || "—"}</td>
                      <td className="px-4 py-3 text-soil-400">{a.phone || "—"}</td>
                      <td className="px-4 py-3 text-soil-400">{a.rating || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {agrovets.length > 100 && !agrovetSearch && (
                <p className="text-xs text-soil-300 text-center py-3">Showing first 100 of {agrovets.length} agrovets. Use search to filter.</p>
              )}
            </div>
          </div>
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
