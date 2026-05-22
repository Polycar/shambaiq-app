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
      return <h3 key={i} className="font-display text-xl font-semibold text-forest-600 mt-8 mb-3" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (trimmed.startsWith("#### ")) {
      const text = trimmed.substring(5).trim();
      const html = parseInlineMarkdown(text);
      return <h4 key={i} className="font-semibold text-forest-700 mt-6 mb-2" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").filter(l => l.trim().startsWith("- ") || l.trim().startsWith("* "));
      return (
        <ul key={i} className="list-disc list-inside space-y-1 mb-4 text-soil-700">
          {items.map((item, j) => {
            const text = item.replace(/^[\s]*[-*]\s/, "");
            const html = parseInlineMarkdown(text);
            return <li key={j} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </ul>
      );
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(l => /^\s*\d+\.\s/.test(l));
      return (
        <ol key={i} className="list-decimal list-inside space-y-1 mb-4 text-soil-700">
          {items.map((item, j) => {
            const text = item.replace(/^\s*\d+\.\s/, "");
            const html = parseInlineMarkdown(text);
            return <li key={j} dangerouslySetInnerHTML={{ __html: html }} />;
          })}
        </ol>
      );
    }

    if (trimmed.startsWith("```")) {
      const lines = trimmed.split("\n");
      const code = lines.slice(1, lines.length - 1).join("\n");
      return <pre key={i} className="bg-soil-900 text-cream-100 rounded-xl p-4 mb-4 overflow-x-auto text-sm font-mono whitespace-pre-wrap">{code}</pre>;
    }

    if (trimmed.startsWith("|")) {
      const rows = trimmed.split("\n").filter(l => l.trim().startsWith("|") && !l.includes("---"));
      if (rows.length > 0) {
        const headers = rows[0].split("|").filter(h => h.trim()).map(h => h.trim());
        const bodyRows = rows.slice(1);
        return (
          <div key={i} className="overflow-x-auto mb-4">
            <table className="min-w-full border border-cream-200 rounded-lg text-sm">
              <thead className="bg-cream-50">
                <tr>
                  {headers.map((h, j) => (
                    <th key={j} className="px-4 py-2 border-b border-cream-200 text-left font-semibold text-forest-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, j) => {
                  const cells = row.split("|").filter(c => c.trim()).map(c => c.trim());
                  return (
                    <tr key={j} className={j % 2 === 0 ? "bg-white" : "bg-cream-50"}>
                      {cells.map((cell, k) => (
                        <td key={k} className="px-4 py-2 border-b border-cream-100 text-soil-700" dangerouslySetInnerHTML={{ __html: parseInlineMarkdown(cell) }} />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    if (trimmed.startsWith(">")) {
      const text = trimmed.replace(/^>\s?/gm, "").trim();
      const html = parseInlineMarkdown(text);
      return <blockquote key={i} className="border-l-4 border-gold-400 pl-4 italic text-soil-600 mb-4 bg-cream-50 py-2 pr-4 rounded-r" dangerouslySetInnerHTML={{ __html: html }} />;
    }

    if (trimmed.startsWith("---") || trimmed.startsWith("***") || trimmed.startsWith("___")) {
      return <hr key={i} className="border-cream-300 my-8" />;
    }

    const html = parseInlineMarkdown(trimmed);
    return <p key={i} className="text-soil-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: html }} />;
  }).filter(Boolean);
};

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [code, setCode] = useState("");
  const [authErr, setAuthErr] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [dealers, setDealers] = useState<any[]>([]);
  const [yields, setYields] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [farmers, setFarmers] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [dealerFilter, setDealerFilter] = useState("all");
  const [farmerSearch, setFarmerSearch] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Crop price management state
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
    setBlogForm({
      title: post.title || "",
      content: post.content || "",
      excerpt: post.excerpt || "",
      category: post.category || "Guide",
      status: post.status || "draft",
      read_time: post.read_time || "5 min read",
    });
  };

  const viewFarmerDetail = async (farmerId: string) => {
    const detail = await f(`/api/v1/admin/farmers/${farmerId}`);
    setSelectedFarmer(detail);
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

  if (!auth) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm border border-cream-200">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-forest-700 rounded-xl flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-cream-50" />
            </div>
            <h1 className="font-display text-xl font-bold text-forest-800">ShambaIQ Admin</h1>
            <p className="text-soil-400 text-center text-sm mb-8">Enter your officer access code</p>
          </div>
          <input
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
            placeholder="Access code"
            className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-forest-400 bg-cream-50"
          />
          {authErr && <p className="text-red-500 text-xs mb-3 text-center">Invalid access code</p>}
          <button onClick={login} className="w-full bg-forest-700 hover:bg-forest-800 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "stats", label: "Dashboard", icon: BarChart3 },
    { id: "dealers", label: "Dealers", icon: Store },
    { id: "yields", label: "Flagged Yields", icon: AlertTriangle },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "farmers", label: "Farmers", icon: Users },
    { id: "audit", label: "Audit Log", icon: TrendingUp },
    { id: "crops", label: "Crops", icon: Wheat },
    { id: "agrovets", label: "Agrovets CSV", icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-forest-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-forest-600 rounded-lg flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg">ShambaIQ Admin</span>
        </div>
        <button onClick={() => { setAuth(false); setCode(""); }} className="text-cream-300 hover:text-white text-sm transition-colors">
          Sign Out
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-48 min-h-screen bg-white border-r border-cream-200 pt-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${tab === t.id ? "bg-forest-50 text-forest-700 font-semibold border-r-2 border-forest-600" : "text-soil-600 hover:bg-cream-50"}`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-forest-800">
              {tabs.find(t => t.id === tab)?.label}
            </h2>
            <button onClick={() => fetchTab(tab)} className="flex items-center gap-2 text-sm text-soil-500 hover:text-forest-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-forest-500" />
            </div>
          )}

          {!loading && tab === "stats" && stats && (
            <div className="space-y-6">
              {/* Summary Cards */}
              {summary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Farmers", value: summary.total_farmers, icon: Users, color: "bg-forest-50 text-forest-700" },
                    { label: "Fields", value: summary.total_fields, icon: MapPin, color: "bg-blue-50 text-blue-700" },
                    { label: "Recommendations", value: summary.total_recommendations, icon: TrendingUp, color: "bg-gold-50 text-gold-700" },
                    { label: "Pending Dealers", value: summary.pending_dealers, icon: Store, color: "bg-red-50 text-red-700" },
                  ].map((card, i) => (
                    <div key={i} className={`rounded-xl p-4 ${card.color} border border-opacity-20`}>
                      <card.icon className="w-5 h-5 mb-2" />
                      <div className="text-2xl font-bold">{card.value?.toLocaleString() ?? "—"}</div>
                      <div className="text-xs font-medium opacity-75">{card.label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-cream-200 p-4">
                  <h3 className="font-semibold text-forest-700 mb-3">Soil Health Summary</h3>
                  <div className="space-y-2">
                    {stats.soil_health && Object.entries(stats.soil_health).map(([k, v]: [string, any]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-soil-600 capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="font-semibold text-forest-700">{v} ({stats.total_queries > 0 ? Math.round(v / stats.total_queries * 100) : 0}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-cream-200 p-4">
                  <h3 className="font-semibold text-forest-700 mb-3">Feedback</h3>
                  {stats.feedback ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-soil-600">Total responses</span>
                        <span className="font-semibold">{stats.feedback.total_responses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-soil-600">Average rating</span>
                        <span className="font-semibold">{stats.feedback.average_rating ?? "—"} / 5</span>
                      </div>
                    </div>
                  ) : <p className="text-soil-400 text-sm">No feedback yet</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-cream-200 p-4">
                  <h3 className="font-semibold text-forest-700 mb-3">Top Counties</h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {stats.county_distribution && Object.entries(stats.county_distribution)
                      .sort(([, a]: any, [, b]: any) => b - a).slice(0, 10)
                      .map(([county, count]: [string, any]) => (
                        <div key={county} className="flex justify-between text-sm">
                          <span className="text-soil-600">{county}</span>
                          <span className="font-semibold text-forest-700">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-cream-200 p-4">
                  <h3 className="font-semibold text-forest-700 mb-3">Top Crops</h3>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {stats.crop_distribution && Object.entries(stats.crop_distribution)
                      .sort(([, a]: any, [, b]: any) => b - a).slice(0, 10)
                      .map(([crop, count]: [string, any]) => (
                        <div key={crop} className="flex justify-between text-sm">
                          <span className="text-soil-600">{crop}</span>
                          <span className="font-semibold text-forest-700">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && tab === "dealers" && (
            <div className="space-y-4">
              <div className="flex gap-2 mb-4">
                {["all", "pending", "approved", "declined"].map(s => (
                  <button
                    key={s}
                    onClick={() => setDealerFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${dealerFilter === s ? "bg-forest-700 text-white" : "bg-white border border-cream-200 text-soil-600 hover:border-forest-300"}`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {dealers.length === 0 && <p className="text-soil-400 text-sm text-center py-8">No dealer applications found.</p>}
                {dealers.map((d: any) => (
                  <div key={d.id} className="bg-white rounded-xl border border-cream-200 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-forest-800">{d.business_name}</div>
                        <div className="text-sm text-soil-500 flex items-center gap-3 mt-1">
                          <span>{d.county}, {d.town}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{d.phone_number}</span>
                        </div>
                        {d.products_stocked && (
                          <div className="text-xs text-soil-400 mt-1">Products: {d.products_stocked}</div>
                        )}
                        {d.reviewed_at && (
                          <div className="text-xs text-soil-400 mt-1">
                            Reviewed: {new Date(d.reviewed_at).toLocaleDateString()}
                            {d.decline_reason && ` — ${d.decline_reason}`}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          d.status === "approved" ? "bg-green-100 text-green-700" :
                          d.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>{d.status}</span>
                        {d.status === "pending" && (
                          <>
                            <button
                              onClick={() => reviewDealer(d.id, "approved")}
                              disabled={actionLoading === d.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-forest-600 text-white rounded-lg text-sm hover:bg-forest-700 transition-colors disabled:opacity-50"
                            >
                              {actionLoading === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                              Approve
                            </button>
                            <button
                              onClick={() => reviewDealer(d.id, "declined")}
                              disabled={actionLoading === d.id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                            >
                              <X className="w-3 h-3" />
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && tab === "yields" && (
            <div className="space-y-3">
              {yields.length === 0 && <p className="text-soil-400 text-sm text-center py-8">No flagged yields.</p>}
              {yields.map((y: any) => (
                <div key={y.id} className="bg-white rounded-xl border border-amber-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-forest-800">{y.crop} — {y.yield_bags_per_acre} bags/acre</div>
                      <div className="text-sm text-soil-500 mt-1">Farmer: {y.farmer_id} | Season: {y.season}</div>
                      {y.flag_reason && <div className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{y.flag_reason}</div>}
                      {y.timestamp && <div className="text-xs text-soil-400 mt-1">{new Date(y.timestamp).toLocaleDateString()}</div>}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewYield(y.id, "verified")}
                        disabled={actionLoading === String(y.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-forest-600 text-white rounded-lg text-sm hover:bg-forest-700 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === String(y.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                        Verify
                      </button>
                      <button
                        onClick={() => reviewYield(y.id, "rejected")}
                        disabled={actionLoading === String(y.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && tab === "blog" && (
            <div className="space-y-4">
              {!showBlogEditor ? (
                <>
                  <button
                    onClick={() => { setEditing(null); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); setShowBlogEditor(true); setActiveEditorTab("write"); }}
                    className="flex items-center gap-2 px-4 py-2 bg-forest-700 text-white rounded-xl text-sm hover:bg-forest-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Post
                  </button>
                  <div className="space-y-3">
                    {posts.length === 0 && <p className="text-soil-400 text-sm text-center py-8">No blog posts yet.</p>}
                    {posts.map((p: any) => (
                      <div key={p.id} className="bg-white rounded-xl border border-cream-200 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold text-forest-800">{p.title}</div>
                            <div className="text-xs text-soil-400 mt-1 flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded-full font-medium ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-cream-100 text-soil-500"}`}>{p.status}</span>
                              <span>{p.category}</span>
                              {p.published_at && <span>Published {new Date(p.published_at).toLocaleDateString()}</span>}
                            </div>
                            {p.excerpt && <p className="text-sm text-soil-500 mt-2 line-clamp-2">{p.excerpt}</p>}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => editPost(p)} className="p-2 text-soil-400 hover:text-forest-700 transition-colors"><PenLine className="w-4 h-4" /></button>
                            <button onClick={() => deleteBlogPost(p.id)} className="p-2 text-soil-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-cream-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-lg font-bold text-forest-800">{editing ? "Edit Post" : "New Post"}</h3>
                    <button onClick={() => { setShowBlogEditor(false); setEditing(null); }} className="text-soil-400 hover:text-forest-700 transition-colors"><X className="w-5 h-5" /></button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-soil-500 mb-1">Title *</label>
                      <input value={blogForm.title} onChange={e => setBlogForm(f => ({ ...f, title: e.target.value }))} className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder="Post title" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-soil-500 mb-1">Category</label>
                      <select value={blogForm.category} onChange={e => setBlogForm(f => ({ ...f, category: e.target.value }))} className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 bg-white">
                        {["Guide", "Data Report", "Soil Science", "Fertilizer", "Seasonal"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-soil-500 mb-1">Excerpt</label>
                    <textarea value={blogForm.excerpt} onChange={e => setBlogForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder="Short description for listings..." />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold text-soil-500">Content (Markdown) *</label>
                      <div className="flex items-center gap-1 bg-cream-100 rounded-lg p-1">
                        {[
                          { id: 'write' as const, icon: PenLine, label: 'Write' },
                          { id: 'split' as const, icon: Columns, label: 'Split' },
                          { id: 'preview' as const, icon: Eye, label: 'Preview' },
                        ].map(({ id, icon: Icon, label }) => (
                          <button
                            key={id}
                            onClick={() => setActiveEditorTab(id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${activeEditorTab === id ? 'bg-white text-forest-700 shadow-sm' : 'text-soil-500 hover:text-forest-600'}`}
                          >
                            <Icon className="w-3 h-3" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {activeEditorTab === 'write' && (
                      <textarea
                        value={blogForm.content}
                        onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                        rows={20}
                        className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 font-mono"
                        placeholder="Write your post in Markdown..."
                      />
                    )}

                    {activeEditorTab === 'preview' && (
                      <div className="min-h-96 border border-cream-300 rounded-lg px-4 py-3 prose prose-sm max-w-none overflow-y-auto">
                        {blogForm.content ? renderMarkdown(blogForm.content) : <p className="text-soil-400 text-sm">Nothing to preview yet.</p>}
                      </div>
                    )}

                    {activeEditorTab === 'split' && (
                      <div className="grid grid-cols-2 gap-4">
                        <textarea
                          value={blogForm.content}
                          onChange={e => setBlogForm(f => ({ ...f, content: e.target.value }))}
                          rows={20}
                          className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 font-mono"
                          placeholder="Write your post in Markdown..."
                        />
                        <div className="min-h-96 border border-cream-300 rounded-lg px-4 py-3 prose prose-sm max-w-none overflow-y-auto">
                          {blogForm.content ? renderMarkdown(blogForm.content) : <p className="text-soil-400 text-sm">Preview will appear here.</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-semibold text-soil-500 mb-1">Read Time</label>
                      <input value={blogForm.read_time} onChange={e => setBlogForm(f => ({ ...f, read_time: e.target.value }))} className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder="5 min read" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-soil-500 mb-1">Status</label>
                      <select value={blogForm.status} onChange={e => setBlogForm(f => ({ ...f, status: e.target.value }))} className="w-full border border-cream-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 bg-white">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button onClick={() => { setShowBlogEditor(false); setEditing(null); }} className="px-4 py-2 border border-cream-300 text-soil-600 rounded-xl text-sm hover:bg-cream-50 transition-colors">Cancel</button>
                    <button onClick={() => saveBlogPost()} disabled={blogSaving || !blogForm.title || !blogForm.content} className="px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                      {blogSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {blogSaving ? "Saving..." : editing ? "Update Post" : "Save Draft"}
                    </button>
                    {editing && blogForm.status === "draft" && (
                      <button onClick={async () => { const updatedForm = { ...blogForm, status: "published" }; setBlogForm(updatedForm); setBlogSaving(true); try { const res = editing ? await fetch(`${API}/api/v1/blog/admin/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(updatedForm) }) : await fetch(`${API}/api/v1/blog/admin/create`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(updatedForm) }); if (res.ok) { setEditing(null); setShowBlogEditor(false); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); alert("Post published!"); fetchTab("blog"); } else { const err = await res.json().catch(() => ({})); alert(err.detail ? (typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail)) : `Failed (${res.status})`); } } finally { setBlogSaving(false); } }} className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl shadow-sm transition-colors">Publish Now</button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {!loading && tab === "farmers" && (
            <div className="space-y-4">
              {selectedFarmer ? (
                <div className="space-y-4">
                  <button onClick={() => setSelectedFarmer(null)} className="flex items-center gap-2 text-sm text-soil-500 hover:text-forest-700 transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Back to list
                  </button>
                  <div className="bg-white rounded-xl border border-cream-200 p-5">
                    <h3 className="font-display text-lg font-bold text-forest-800 mb-4">{selectedFarmer.farmer?.name || "Unknown"}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: "County", value: selectedFarmer.farmer?.county },
                        { label: "Phone", value: selectedFarmer.farmer?.phone_number },
                        { label: "Language", value: selectedFarmer.farmer?.language_pref?.toUpperCase() },
                        { label: "Joined", value: selectedFarmer.farmer?.created_at ? new Date(selectedFarmer.farmer.created_at).toLocaleDateString() : "—" },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="text-xs text-soil-400 mb-0.5">{item.label}</div>
                          <div className="text-sm font-semibold text-forest-800">{item.value || "—"}</div>
                        </div>
                      ))}
                    </div>

                    {selectedFarmer.fields?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-forest-700 mb-2 text-sm">Fields ({selectedFarmer.fields.length})</h4>
                        <div className="space-y-2">
                          {selectedFarmer.fields.map((field: any) => (
                            <div key={field.id} className="bg-cream-50 rounded-lg p-3 text-sm">
                              <span className="font-medium">{field.name}</span>
                              <span className="text-soil-400 ml-2">{field.primary_crop} · {field.size_acres} acres · {field.county}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedFarmer.recommendations?.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-forest-700 mb-2 text-sm">Recent Recommendations ({selectedFarmer.recommendations.length})</h4>
                        <div className="space-y-2">
                          {selectedFarmer.recommendations.slice(0, 5).map((rec: any) => (
                            <div key={rec.id} className="bg-cream-50 rounded-lg p-3 text-sm flex justify-between">
                              <span>{rec.crop} in {rec.county}</span>
                              <span className="text-soil-400">Health: {rec.health_score}% · KSh {rec.total_budget?.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil-400" />
                      <input
                        value={farmerSearch}
                        onChange={e => setFarmerSearch(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && fetchTab("farmers")}
                        placeholder="Search by name, phone, county..."
                        className="w-full pl-9 pr-4 py-2 border border-cream-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                      />
                    </div>
                    <button onClick={() => fetchTab("farmers")} className="px-4 py-2 bg-forest-700 text-white rounded-xl text-sm hover:bg-forest-800 transition-colors">Search</button>
                  </div>
                  <div className="space-y-2">
                    {farmers.length === 0 && <p className="text-soil-400 text-sm text-center py-8">No farmers found.</p>}
                    {farmers.map((farmer: any) => (
                      <div key={farmer.id} className="bg-white rounded-xl border border-cream-200 p-4 flex items-center justify-between hover:border-forest-300 transition-colors cursor-pointer" onClick={() => viewFarmerDetail(farmer.id)}>
                        <div>
                          <div className="font-semibold text-forest-800">{farmer.name || "Unknown"}</div>
                          <div className="text-sm text-soil-500 flex items-center gap-3 mt-0.5">
                            <span>{farmer.county}</span>
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{farmer.phone_number}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-soil-400">
                          <span>{farmer.fields} fields</span>
                          <span>{farmer.recommendations} recs</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {!loading && tab === "audit" && (
            <div className="space-y-2">
              {audit.length === 0 && <p className="text-soil-400 text-sm text-center py-8">No audit log entries.</p>}
              {audit.map((log: any) => (
                <div key={log.id} className="bg-white rounded-xl border border-cream-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-forest-800 capitalize">{log.action?.replace(/_/g, " ")}</div>
                      <div className="text-sm text-soil-500 mt-1">
                        Officer: {log.officer_id} · Target: {log.target_type} #{log.target_id?.slice(0, 8)}
                      </div>
                      {log.details && <div className="text-xs text-soil-400 mt-1">{log.details}</div>}
                    </div>
                    <div className="text-xs text-soil-400">
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                  <button
                    onClick={downloadCropTemplate}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-cream-300 text-soil-600 rounded-lg text-xs hover:border-forest-300 hover:text-forest-700 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" /> Template
                  </button>
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 border border-cream-300 text-soil-600 rounded-lg text-xs hover:border-forest-300 hover:text-forest-700 transition-colors">
                    {priceCSVUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    Upload CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) { await handlePriceCSVUpload(file); e.target.value = ""; }
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setNewPriceForm({ crop: "", price_per_kg: "", unit: "KES/kg", market: "Nairobi" })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-700 text-white rounded-lg text-xs hover:bg-forest-800 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Price
                  </button>
                </div>

                {cropPrices.length === 0 && !newPriceForm && (
                  <p className="text-soil-400 text-sm text-center py-8">
                    No crop prices yet. Upload a CSV or add manually.
                    <br />
                    <span className="text-xs text-soil-300 mt-1 block">CSV format: crop, price_per_kg, unit, market</span>
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
                            <td className="py-1.5 px-2">
                              <input
                                autoFocus
                                value={newPriceForm.crop}
                                onChange={e => setNewPriceForm(f => f ? {...f, crop: e.target.value} : f)}
                                placeholder="e.g. Maize"
                                className="border border-cream-300 rounded px-2 py-1 text-xs w-full focus:outline-none focus:ring-1 focus:ring-forest-400"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                type="number"
                                value={newPriceForm.price_per_kg}
                                onChange={e => setNewPriceForm(f => f ? {...f, price_per_kg: e.target.value} : f)}
                                placeholder="45"
                                className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                value={newPriceForm.unit}
                                onChange={e => setNewPriceForm(f => f ? {...f, unit: e.target.value} : f)}
                                className="border border-cream-300 rounded px-2 py-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-forest-400"
                              />
                            </td>
                            <td className="py-1.5 px-2">
                              <input
                                value={newPriceForm.market}
                                onChange={e => setNewPriceForm(f => f ? {...f, market: e.target.value} : f)}
                                className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400"
                              />
                            </td>
                            <td className="py-1.5 px-3 text-xs text-soil-400">—</td>
                            <td className="py-1.5 px-2">
                              <div className="flex gap-1">
                                <button
                                  onClick={handleAddPrice}
                                  disabled={priceSaving || !newPriceForm.crop || !newPriceForm.price_per_kg}
                                  className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800 transition-colors disabled:opacity-50"
                                >
                                  {priceSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                </button>
                                <button
                                  onClick={() => setNewPriceForm(null)}
                                  className="p-1.5 border border-cream-200 text-soil-500 rounded hover:border-red-300 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                        {cropPrices.map((p: any, i: number) => (
                          <tr key={p.id} className={`border-b border-cream-100 ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}>
                            {editingPrice?.id === p.id ? (
                              <>
                                <td className="py-1.5 px-3 text-xs font-medium text-forest-800">{p.crop}</td>
                                <td className="py-1.5 px-2">
                                  <input
                                    type="number"
                                    value={editingPrice.price_per_kg}
                                    onChange={e => setEditingPrice((prev: any) => ({...prev, price_per_kg: e.target.value}))}
                                    className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <input
                                    value={editingPrice.unit}
                                    onChange={e => setEditingPrice((prev: any) => ({...prev, unit: e.target.value}))}
                                    className="border border-cream-300 rounded px-2 py-1 text-xs w-20 focus:outline-none focus:ring-1 focus:ring-forest-400"
                                  />
                                </td>
                                <td className="py-1.5 px-2">
                                  <input
                                    value={editingPrice.market}
                                    onChange={e => setEditingPrice((prev: any) => ({...prev, market: e.target.value}))}
                                    className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none focus:ring-1 focus:ring-forest-400"
                                  />
                                </td>
                                <td className="py-1.5 px-3 text-xs text-soil-400">
                                  {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}
                                </td>
                                <td className="py-1.5 px-2">
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => saveEditedPrice(p.id)}
                                      disabled={priceSaving}
                                      className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800 transition-colors disabled:opacity-50"
                                    >
                                      {priceSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                                    </button>
                                    <button
                                      onClick={() => setEditingPrice(null)}
                                      className="p-1.5 border border-cream-200 text-soil-500 rounded hover:border-red-300 hover:text-red-500 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2 px-3 font-medium text-forest-800">{p.crop}</td>
                                <td className="py-2 px-3 text-forest-700 font-semibold">KES {p.price_per_kg?.toLocaleString()}</td>
                                <td className="py-2 px-3 text-soil-500 text-xs">{p.unit}</td>
                                <td className="py-2 px-3 text-soil-500 text-xs">{p.market}</td>
                                <td className="py-2 px-3 text-xs text-soil-400">
                                  {p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}
                                </td>
                                <td className="py-2 px-2">
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => setEditingPrice({ id: p.id, price_per_kg: String(p.price_per_kg), unit: p.unit, market: p.market })}
                                      className="p-1.5 text-soil-400 hover:text-forest-700 transition-colors"
                                    >
                                      <PenLine className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deletePrice(p.id, p.crop)}
                                      className="p-1.5 text-soil-400 hover:text-red-500 transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
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

          {!loading && tab === "agrovets" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-cream-200 p-5">
                <h3 className="font-semibold text-forest-700 mb-1">Agrovet Directory</h3>
                <p className="text-sm text-soil-500 mb-4">{agrovetTotal} agrovets in the directory. Upload a CSV to add or replace entries.</p>

                {agrovetMsg && (
                  <div className={`mb-4 p-3 rounded-lg text-sm ${agrovetMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                    {agrovetMsg.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-dashed border-cream-300 rounded-xl p-5 text-center hover:border-forest-400 transition-colors">
                    <Upload className="w-6 h-6 text-soil-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-forest-700 mb-1">Append Agrovets</p>
                    <p className="text-xs text-soil-400 mb-3">Add new entries to existing directory</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setAgrovetUploading(true);
                        setAgrovetMsg(null);
                        const form = new FormData(); form.append("file", file);
                        try {
                          const res = await fetch(`${API}/api/v1/admin/agrovets/csv`, { method: "POST", headers: { "Authorization": `Bearer ${code}` }, body: form });
                          const data = await res.json();
                          if (res.ok) { setAgrovetMsg({type: "success", text: data.message}); fetchTab("agrovets"); }
                          else { setAgrovetMsg({type: "error", text: data.detail || "Upload failed"}); }
                        } catch { setAgrovetMsg({type: "error", text: "Network error"}); }
                        finally { setAgrovetUploading(false); e.target.value = ""; }
                      }}
                      className="hidden"
                      id="csv-append"
                    />
                    <label htmlFor="csv-append" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-forest-700 text-white rounded-lg text-sm hover:bg-forest-800 transition-colors">
                      {agrovetUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Choose CSV
                    </label>
                  </div>

                  <div className="border-2 border-dashed border-red-200 rounded-xl p-5 text-center hover:border-red-400 transition-colors">
                    <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-700 mb-1">Replace Directory</p>
                    <p className="text-xs text-soil-400 mb-3">Replaces ALL existing agrovets</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!confirm("This will REPLACE the entire agrovet directory. Are you sure?")) return;
                        setAgrovetUploading(true);
                        setAgrovetMsg(null);
                        const form = new FormData(); form.append("file", file);
                        try {
                          const res = await fetch(`${API}/api/v1/admin/agrovets/csv/replace`, { method: "POST", headers: { "Authorization": `Bearer ${code}` }, body: form });
                          const data = await res.json();
                          if (res.ok) { setAgrovetMsg({type: "success", text: data.message}); fetchTab("agrovets"); }
                          else { setAgrovetMsg({type: "error", text: data.detail || "Upload failed"}); }
                        } catch { setAgrovetMsg({type: "error", text: "Network error"}); }
                        finally { setAgrovetUploading(false); e.target.value = ""; }
                      }}
                      className="hidden"
                      id="csv-replace"
                    />
                    <label htmlFor="csv-replace" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                      <AlertTriangle className="w-4 h-4" />
                      Replace All
                    </label>
                  </div>
                </div>
              </div>

              {agrovets.length > 0 && (
                <div className="bg-white rounded-xl border border-cream-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-forest-700">Directory Preview ({agrovetTotal} entries)</h3>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soil-400" />
                      <input
                        value={agrovetSearch}
                        onChange={e => setAgrovetSearch(e.target.value)}
                        placeholder="Filter..."
                        className="pl-9 pr-4 py-1.5 border border-cream-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 w-48"
                      />
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="border-b border-cream-200">
                          {agrovets[0] && Object.keys(agrovets[0]).slice(0, 6).map(k => (
                            <th key={k} className="text-left py-2 px-3 text-soil-500 font-semibold capitalize">{k.replace(/_/g, " ")}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {agrovets
                          .filter(a => !agrovetSearch || Object.values(a).some(v => String(v).toLowerCase().includes(agrovetSearch.toLowerCase())))
                          .slice(0, 50)
                          .map((a, i) => (
                            <tr key={i} className={`border-b border-cream-100 ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}>
                              {Object.values(a).slice(0, 6).map((v: any, j) => (
                                <td key={j} className="py-1.5 px-3 text-soil-700">{v || "—"}</td>
                              ))}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    {agrovets.filter(a => !agrovetSearch || Object.values(a).some(v => String(v).toLowerCase().includes(agrovetSearch.toLowerCase()))).length > 50 && (
                      <p className="text-xs text-soil-400 text-center pt-2">Showing first 50 of {agrovetTotal} entries</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
