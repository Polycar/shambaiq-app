"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Lock, Store, BarChart3, AlertTriangle, FileText,
  Check, CheckCircle, X, Loader2, RefreshCw, Users, TrendingUp, MapPin, Wheat,
  PenLine, Eye, Trash2, Plus, Search, Phone, ChevronDown, ChevronRight, Upload,
  Sparkles, Globe, Link2, Image, Columns,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

type Tab = "stats" | "b2b" | "dealers" | "yields" | "blog" | "farmers" | "audit" | "crops" | "agrovets";

function dlCSV(rows: (string | number | null | boolean)[][], name: string) {
  const csv = rows.map(r => r.map(v => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const parseInlineMarkdown = (text: string): string => {
  return text
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="inline rounded my-1 max-w-full" />')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-forest-700">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" class="text-gold-700 hover:underline font-medium">$1</a>')
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
            {alt && <p className="text-center text-xs text-soil-500 mt-2 font-medium">{alt}</p>}
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
  const [yieldsFilter, setYieldsFilter] = useState("all");
  const [yieldTotal, setYieldTotal] = useState(0);
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
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [imgModal, setImgModal] = useState<{ url: string; alt: string } | null>(null);
  const [b2bExporting, setB2bExporting] = useState<string | null>(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const f = useCallback(async (url: string) => {
    const res = await fetch(`${API}${url}`, { headers: { "Authorization": `Bearer ${code}` } });
    if (res.ok) return res.json();
    return null;
  }, [code]);

  const fetchTab = useCallback(async (t: Tab) => {
    setLoading(true);
    if (t === "stats") { setStats(await f("/api/v1/analytics/stats")); setSummary(await f("/api/v1/admin/summary")); }
    else if (t === "dealers") { const d = await f(`/api/v1/admin/dealers?status=${dealerFilter}`); setDealers(d?.dealers || []); }
    else if (t === "yields") {
      const params = yieldsFilter !== "all" ? `?status=${yieldsFilter}` : "";
      const y = await f(`/api/v1/analytics/yields${params}`);
      setYields(y?.records || []);
      setYieldTotal(y?.total ?? 0);
    }
    else if (t === "blog") { const b = await f("/api/v1/blog/admin/all"); setPosts(b?.posts || []); }
    else if (t === "farmers") { const fm = await f(`/api/v1/admin/farmers?search=${farmerSearch}`); setFarmers(fm?.farmers || []); }
    else if (t === "audit") { const a = await f("/api/v1/analytics/audit-log"); setAudit(a?.logs || []); }
    else if (t === "crops") {
      const res = await fetch(`${API}/api/v1/crops/economics`, { cache: "no-store" });
      if (res.ok) { const data = await res.json(); setCropPrices(data.crops || []); }
    }
    else if (t === "agrovets") {
      const res = await fetch(`${API}/api/v1/admin/agrovets/csv`, { headers: { "Authorization": `Bearer ${code}` } });
      if (res.ok) {
        const data = await res.json();
        setAgrovets(data.agrovets || []);
        setAgrovetTotal(data.count || 0);
      }
    }
    else if (t === "b2b") {
      if (!stats) setStats(await f("/api/v1/analytics/stats"));
    }
    setLoading(false);
  }, [code, f, dealerFilter, farmerSearch, yieldsFilter]);

  const login = async (overrideCode?: string) => {
    setAuthErr(false);
    const activeCode = overrideCode || code;
    if (!activeCode) return;
    const res = await fetch(`${API}/api/v1/analytics/stats`, { headers: { "Authorization": `Bearer ${activeCode}` } });
    if (res.ok) {
      setAuth(true);
      localStorage.setItem("shambaiq_admin_code", activeCode);
      setStats(await res.json());
      const s = await fetch(`${API}/api/v1/admin/summary`, { headers: { "Authorization": `Bearer ${activeCode}` } });
      if (s.ok) setSummary(await s.json());
    } else {
      setAuthErr(true);
      if (!overrideCode) {
        localStorage.removeItem("shambaiq_admin_code");
      }
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem("shambaiq_admin_code");
    if (savedCode) {
      setCode(savedCode);
      login(savedCode);
    }
  }, []);

  useEffect(() => { if (auth) fetchTab(tab); }, [auth, tab, dealerFilter, fetchTab]);

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
      const payload = {
        ...blogForm,
        focus_keyword: focusKeyword
      };
      const res = editing
        ? await fetch(`${API}/api/v1/blog/admin/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(payload) })
        : await fetch(`${API}/api/v1/blog/admin/create`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(payload) });

      if (res.ok) {
        setEditing(null);
        setShowBlogEditor(false);
        setActiveEditorTab("write");
        setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
        setFocusKeyword("");
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
    setFocusKeyword(post.focus_keyword || "");
    
    // Securely fetch full blog content and keyword from admin endpoint (supports drafts/published posts)
    fetch(`${API}/api/v1/blog/admin/${post.id}`, {
      headers: { "Authorization": `Bearer ${code}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setBlogForm({
            title: d.title,
            content: d.content || "",
            excerpt: d.excerpt || "",
            category: d.category,
            status: d.status,
            read_time: d.read_time || ""
          });
          setFocusKeyword(d.focus_keyword || "");
        }
      });
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

  // ─── Markdown toolbar helpers ───
  const insert = useCallback((prefix: string, suffix = "", placeholder = "text") => {
    const ta = editorRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end) || placeholder;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const newVal = before + prefix + selected + suffix + after;
    setBlogForm(f => ({ ...f, content: newVal }));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }, []);

  const insertHeading = useCallback((level: number) => {
    const ta = editorRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const lineStart = ta.value.lastIndexOf("\n", pos - 1) + 1;
    const lineEnd = ta.value.indexOf("\n", pos);
    const line = ta.value.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    const stripped = line.replace(/^#+\s*/, "");
    const prefix = "#".repeat(level) + " ";
    const newVal = ta.value.slice(0, lineStart) + prefix + stripped + (lineEnd === -1 ? "" : ta.value.slice(lineEnd));
    setBlogForm(f => ({ ...f, content: newVal }));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(lineStart + prefix.length + stripped.length, lineStart + prefix.length + stripped.length); });
  }, []);

  const insertImageFromModal = useCallback(() => {
    if (!imgModal) return;
    const { url, alt } = imgModal;
    if (!url) return;
    insert(`![${alt || "image"}](`, ")", url);
    setImgModal(null);
  }, [imgModal, insert]);

  // ─── B2B export helpers ───
  const exportCountyReport = useCallback(() => {
    const dist: Record<string, number> = stats?.county_distribution || {};
    const entries = Object.entries(dist).sort(([,a],[,b]) => b - a);
    if (!entries.length) return;
    const total = entries.reduce((s, [,n]) => s + n, 0);
    const rows: (string | number)[][] = [["County", "Farmers", "% Share"]];
    entries.forEach(([county, n]) => rows.push([county, n, ((n / total) * 100).toFixed(1)]));
    dlCSV(rows, `shambaiq-county-report-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [stats]);

  const exportCropReport = useCallback(() => {
    const dist: Record<string, number> = stats?.crop_distribution || {};
    const entries = Object.entries(dist).sort(([,a],[,b]) => b - a);
    if (!entries.length) return;
    const total = entries.reduce((s, [,n]) => s + n, 0);
    const rows: (string | number)[][] = [["Crop", "Farmers", "% Share"]];
    entries.forEach(([crop, n]) => rows.push([crop, n, ((n / total) * 100).toFixed(1)]));
    dlCSV(rows, `shambaiq-crop-report-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [stats]);

  const exportNGOReport = useCallback(async () => {
    setB2bExporting("ngo");
    try {
      const [countyData, cropData, priceData, yieldData] = await Promise.all([
        f("/api/v1/analytics/stats"),
        f("/api/v1/analytics/yields/flagged"),
        fetch(`${API}/api/v1/crops/prices/admin`, { headers: { "Authorization": `Bearer ${code}` } }).then(r => r.ok ? r.json() : null),
        f("/api/v1/analytics/stats"),
      ]);
      const rows: (string | number | null)[][] = [
        ["ShambaIQ Impact Report for NGOs / Development Partners"],
        ["Generated", new Date().toISOString()],
        [],
        ["=== FARMER REACH ==="],
        ["Total Farmers", countyData?.total_farmers ?? ""],
        ["Total Agrovets", countyData?.total_agrovets ?? ""],
        ["Total Yield Records", countyData?.total_yields ?? ""],
        [],
        ["=== COUNTY DISTRIBUTION ==="],
        ["County", "Farmers"],
        ...Object.entries(countyData?.county_distribution ?? {}).sort(([,a],[,b]) => (b as number)-(a as number)).map(([county, n]) => [county, n as number]),
        [],
        ["=== CROP FOCUS ==="],
        ["Crop", "Farmers"],
        ...Object.entries(countyData?.crop_distribution ?? {}).sort(([,a],[,b]) => (b as number)-(a as number)).map(([crop, n]) => [crop, n as number]),
        [],
        ["=== CURRENT MARKET PRICES ==="],
        ["Crop", "Price (KES/kg)", "Market", "Updated"],
        ...(priceData?.list ?? []).map((p: any) => [p.crop, p.price_per_kg, p.market, p.updated_at ?? ""]),
        [],
        ["=== FLAGGED YIELD ISSUES ==="],
        ["County", "Crop", "Yield (t/ha)", "Flag", "Notes"],
        ...(yieldData?.records ?? []).map((y: any) => [y.county, y.crop, y.yield_t_ha, y.flag, y.notes ?? ""]),
      ];
      dlCSV(rows, `shambaiq-ngo-impact-${new Date().toISOString().slice(0, 10)}.csv`);
    } finally { setB2bExporting(null); }
  }, [f, code, stats]);

  const exportFullDataset = useCallback(async () => {
    setB2bExporting("full");
    try {
      const res = await fetch(`${API}/api/v1/analytics/yields/export.csv`, {
        headers: { "Authorization": `Bearer ${code}` },
      });
      if (!res.ok) { alert("Export failed"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shambaiq-yields-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally { setB2bExporting(null); }
  }, [code]);

  const exportRecommendationsCSV = useCallback(async () => {
    setB2bExporting("recs");
    try {
      const res = await fetch(`${API}/api/v1/analytics/recommendations/export.csv`, {
        headers: { "Authorization": `Bearer ${code}` },
      });
      if (!res.ok) { alert("Export failed"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shambaiq-recommendations-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally { setB2bExporting(null); }
  }, [code]);

  const exportPartnerSummary = useCallback(async () => {
    setB2bExporting("summary");
    try {
      const res = await fetch(`${API}/api/v1/analytics/summary/export.csv`, {
        headers: { "Authorization": `Bearer ${code}` },
      });
      if (!res.ok) { alert("Export failed"); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shambaiq-partner-summary-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally { setB2bExporting(null); }
  }, [code]);

  const exportDealerGap = useCallback(async () => {
    setB2bExporting("dealer");
    try {
      const [dealerData, cropData] = await Promise.all([
        f("/api/v1/admin/dealers?status=approved"),
        f("/api/v1/analytics/stats"),
      ]);
      const dealerCounties = new Set((dealerData?.dealers ?? []).map((d: any) => d.county));
      const distObj: Record<string, number> = cropData?.county_distribution ?? {};
      const rows: (string | number)[][] = [["County", "Has Dealer", "Farmer Count", "Gap Priority"]];
      Object.entries(distObj).sort(([,a],[,b]) => b - a).forEach(([county, farmerCount]) => {
        const hasDealers = dealerCounties.has(county);
        rows.push([county, hasDealers ? "Yes" : farmerCount, farmerCount, hasDealers ? "Covered" : farmerCount > 50 ? "High Priority" : "Medium"]);
      });
      dlCSV(rows, `shambaiq-dealer-gap-${new Date().toISOString().slice(0, 10)}.csv`);
    } finally { setB2bExporting(null); }
  }, [f]);

  const exportSACCOReport = useCallback(() => {
    if (!stats) return;
    const rows: (string | number | null)[][] = [
      ["ShambaIQ SACCO / Credit Partner Report"],
      ["Generated", new Date().toISOString()],
      [],
      ["Metric", "Value"],
      ["Total Registered Farmers", stats.total_farmers ?? ""],
      ["Counties Active", Object.keys(stats.county_distribution ?? {}).length],
      ["Top Crop", Object.entries(stats.crop_distribution ?? {}).sort(([,a],[,b]) => (b as number)-(a as number))[0]?.[0] ?? ""],
      ["Avg Yield Records per Farmer", stats.total_yields && stats.total_farmers ? (stats.total_yields / stats.total_farmers).toFixed(2) : ""],
      [],
      ["=== COUNTY CREDITWORTHINESS PROXY ==="],
      ["County", "Farmers", "Yield Records", "Risk Proxy"],
      ...Object.entries(stats.county_distribution ?? {}).sort(([,a],[,b]) => (b as number)-(a as number)).map(([county, n]) => [
        county, n as number,
        stats.yield_by_county?.[county] ?? "N/A",
        (n as number) > 100 ? "Low Risk" : (n as number) > 30 ? "Medium Risk" : "High Risk",
      ]),
    ];
    dlCSV(rows, `shambaiq-sacco-report-${new Date().toISOString().slice(0, 10)}.csv`);
  }, [stats]);

  // ─── Login ───
  if (!auth) return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="w-14 h-14 bg-forest-700/10 rounded-xl flex items-center justify-center mx-auto mb-6"><Lock size={28} className="text-forest-700" /></div>
        <h1 className="font-display text-2xl font-bold text-forest-700 text-center mb-2">Admin dashboard</h1>
        <p className="text-soil-500 text-center text-sm mb-8">Enter your officer access code</p>
        <input type="password" placeholder="Access code" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 mb-4" />
        {authErr && <p className="text-sm text-red-600 mb-4 text-center">Invalid access code</p>}
        <button onClick={() => login()} className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl transition-colors">Sign In</button>
      </div>
    </div>
  );

  // ─── Tabs ───
  const tabs: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "stats", label: "Overview", icon: BarChart3 },
    { key: "b2b", label: "B2B Hub", icon: BarChart3 },
    { key: "crops", label: "Crop economics", icon: Wheat },
    { key: "dealers", label: "Dealers", icon: Store, badge: summary?.pending_dealers },
    { key: "yields", label: "Yields", icon: TrendingUp, badge: summary?.flagged_yields },
    { key: "blog", label: "Blog", icon: PenLine },
    { key: "farmers", label: "Farmers", icon: Users, badge: summary?.total_farmers },
    { key: "agrovets", label: "Agrovets CSV", icon: Upload },
    { key: "audit", label: "Audit", icon: FileText },
  ];

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-forest-700">Admin dashboard</h1>
        <div className="flex gap-2">
          <button onClick={() => fetchTab(tab)} className="flex items-center gap-2 px-4 py-2 text-sm text-soil-500 hover:text-forest-700 border border-cream-300 rounded-lg hover:border-gold-400 transition-colors"><RefreshCw size={14} /> Refresh</button>
          <button onClick={() => { localStorage.removeItem("shambaiq_admin_code"); setAuth(false); setCode(""); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 rounded-lg transition-colors"><X size={14} /> Sign Out</button>
        </div>
      </div>

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
          {[
            { l: "Farmers", v: summary.total_farmers },
            { l: "Fields", v: summary.total_fields },
            { l: "Recommendations", v: summary.total_recommendations },
            { l: "Yields", v: summary.total_yields },
            { l: "Pending dealers", v: summary.pending_dealers },
            { l: "Approved dealers", v: summary.approved_dealers },
            { l: "Flagged yields", v: summary.flagged_yields },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-lg p-3 border border-cream-300 text-center">
              <div className="font-display text-xl font-bold text-forest-700">{s.v}</div>
              <div className="text-xs text-soil-500">{s.l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(t => { const Icon = t.icon; return (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === t.key ? "bg-forest-700 text-white" : "bg-white border border-cream-300 text-soil-500 hover:border-gold-400"}`}>
            <Icon size={16} />{t.label}
            {t.badge != null && t.badge > 0 && <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{t.badge}</span>}
          </button>
        );})}
      </div>

      {loading && <div className="flex items-center justify-center py-16"><Loader2 size={24} className="animate-spin text-forest-700" /></div>}

      {/* ═══ STATS ═══ */}
      {!loading && tab === "stats" && stats && (
        stats.total_queries === 0 ? (
          <div className="text-center py-16 text-soil-500">
            <BarChart3 size={32} className="text-cream-300 mx-auto mb-4" />
            <p>No statistics data available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Soil health issues</h3>
              {Object.entries(stats.soil_health || {}).map(([k, v]) => (<div key={k} className="flex justify-between py-1"><span className="text-sm text-soil-500 capitalize">{k.replace(/_/g, " ")}</span><span className="font-semibold text-forest-700">{v as number}</span></div>))}
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Top counties</h3>
              {Object.entries(stats.county_distribution || {}).sort(([,a],[,b]) => (b as number) - (a as number)).slice(0,8).map(([c, n]) => (<div key={c} className="flex justify-between py-1"><span className="text-sm text-soil-500">{c}</span><span className="font-semibold text-forest-700">{n as number}</span></div>))}
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Top crops</h3>
              {Object.entries(stats.crop_distribution || {}).sort(([,a],[,b]) => (b as number) - (a as number)).slice(0,8).map(([c, n]) => (<div key={c} className="flex justify-between py-1"><span className="text-sm text-soil-500">{c}</span><span className="font-semibold text-forest-700">{n as number}</span></div>))}
            </div>
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Feedback</h3>
              <div className="text-center py-4">
                <div className="font-display text-4xl font-bold text-forest-700">{stats.feedback?.average_rating?.toFixed(1) || "—"}</div>
                <div className="text-sm text-soil-500 mt-1">Average rating · {stats.feedback?.total_responses || 0} responses</div>
              </div>
            </div>
          </div>
        )
      )}

      {/* ═══ B2B HUB ═══ */}
      {!loading && tab === "b2b" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-forest-700 to-forest-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 size={22} className="text-gold-300" />
              <h2 className="font-display text-xl font-bold">ShambaIQ B2B data engine</h2>
            </div>
            <p className="text-forest-200 text-sm leading-relaxed">
              Download structured datasets for NGOs, county governments, SACCOs, agri-extensions, and input dealers.
              These reports power B2B partnerships and are exportable as Excel-ready CSV files.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                key: "ngo",
                title: "NGO / dev partner report",
                description: "Farmer reach, county coverage, crop focus, flagged yield issues, and current market prices. Perfect for impact reporting.",
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-100",
                action: exportNGOReport,
              },
              {
                key: "county",
                title: "County distribution",
                description: "Farmer counts per county with percentage share. Useful for county extension offices and targeting underserved areas.",
                icon: MapPin,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-100",
                action: exportCountyReport,
              },
              {
                key: "crop",
                title: "Crop distribution",
                description: "Which crops farmers are growing, ranked by adoption. Useful for seed companies and agri-input dealers.",
                icon: Wheat,
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-100",
                action: exportCropReport,
              },
              {
                key: "dealer",
                title: "Dealer gap analysis",
                description: "Counties with farmers but no approved dealer — shows where input supply is weakest and where to open next.",
                icon: Store,
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-100",
                action: exportDealerGap,
              },
              {
                key: "sacco",
                title: "SACCO / credit partner",
                description: "County-level creditworthiness proxy, farmer counts, and yield activity. For SACCOs designing agri-loan products.",
                icon: TrendingUp,
                color: "text-rose-600",
                bg: "bg-rose-50",
                border: "border-rose-100",
                action: exportSACCOReport,
              },
              {
                key: "full",
                title: "Full yield dataset",
                description: "All yield records with farmer ID, crop, season, bags/acre, status, and flags. For research partners and agri-extension services.",
                icon: FileText,
                color: "text-soil-600",
                bg: "bg-cream-50",
                border: "border-cream-200",
                action: exportFullDataset,
              },
              {
                key: "recs",
                title: "Recommendations CSV",
                description: "All soil recommendation records — county, crop, fertiliser advice, budget, and soil health flags. For agri-input and research partners.",
                icon: Sparkles,
                color: "text-teal-600",
                bg: "bg-teal-50",
                border: "border-teal-100",
                action: exportRecommendationsCSV,
              },
              {
                key: "summary",
                title: "Partner summary",
                description: "Aggregated view — crop × season yield counts and averages, plus county × crop recommendation totals. For boardroom-ready partner briefings.",
                icon: Columns,
                color: "text-indigo-600",
                bg: "bg-indigo-50",
                border: "border-indigo-100",
                action: exportPartnerSummary,
              },
            ].map(({ key, title, description, icon: Icon, color, bg, border, action }) => (
              <div key={key} className={`bg-white rounded-xl border ${border} p-5 flex flex-col gap-4 hover:shadow-md transition-shadow`}>
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                  <Icon size={20} className={color} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-forest-700 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-soil-500 leading-relaxed">{description}</p>
                </div>
                <button
                  onClick={action}
                  disabled={b2bExporting === key}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${b2bExporting === key ? "bg-cream-100 text-soil-500 cursor-wait" : "bg-forest-700 hover:bg-forest-800 text-white"}`}
                >
                  {b2bExporting === key ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} className="rotate-180" />}
                  {b2bExporting === key ? "Exporting…" : "Download CSV"}
                </button>
              </div>
            ))}
          </div>

          {stats?.county_distribution && Object.keys(stats.county_distribution).length > 0 && (
            <div className="bg-white rounded-xl border border-cream-200 p-5">
              <h3 className="font-semibold text-forest-700 mb-4">Top Counties by Farmer Count</h3>
              <div className="space-y-2">
                {Object.entries(stats.county_distribution as Record<string,number>)
                  .sort(([,a],[,b]) => b - a).slice(0, 10).map(([county, n]) => {
                  const max = Math.max(...Object.values(stats.county_distribution as Record<string,number>));
                  const pct = Math.round((n / max) * 100);
                  return (
                    <div key={county} className="flex items-center gap-3">
                      <span className="text-xs text-soil-500 w-28 truncate">{county}</span>
                      <div className="flex-1 bg-cream-100 rounded-full h-2">
                        <div className="bg-forest-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-forest-700 font-semibold w-10 text-right">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {stats?.crop_distribution && Object.keys(stats.crop_distribution).length > 0 && (
            <div className="bg-white rounded-xl border border-cream-200 p-5">
              <h3 className="font-semibold text-forest-700 mb-4">Top Crops by Farmer Adoption</h3>
              <div className="space-y-2">
                {Object.entries(stats.crop_distribution as Record<string,number>)
                  .sort(([,a],[,b]) => b - a).slice(0, 10).map(([crop, n]) => {
                  const max = Math.max(...Object.values(stats.crop_distribution as Record<string,number>));
                  const pct = Math.round((n / max) * 100);
                  return (
                    <div key={crop} className="flex items-center gap-3">
                      <span className="text-xs text-soil-500 w-28 truncate">{crop}</span>
                      <div className="flex-1 bg-cream-100 rounded-full h-2">
                        <div className="bg-gold-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-forest-700 font-semibold w-10 text-right">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
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
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-forest-700">Crop economics ({cropPrices.length})</h3>
                <p className="text-xs text-soil-500 mt-0.5">Click any row to edit. Changes go live on the website immediately.</p>
              </div>
              <button
                onClick={() => setNewPriceForm({ crop: "", price_per_kg: "", unit: "", market: "" })}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-700 text-white rounded-lg text-xs hover:bg-forest-800 transition-colors"
              >
                <Plus size={14} /> Add Crop
              </button>
            </div>

            {cropPrices.length === 0 && !newPriceForm && (
              <p className="text-soil-500 text-sm text-center py-8">Loading crop data from server…</p>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200 text-left">
                    {["Crop","Category","pH","Yield/acre","Price/kg","N","P","K","Texture","Updated",""].map(h => (
                      <th key={h} className="py-2 px-2 text-soil-500 font-semibold text-xs whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newPriceForm && (
                    <tr className="border-b border-green-100 bg-green-50">
                      <td className="py-1.5 px-2"><input autoFocus value={newPriceForm.crop} onChange={e => setNewPriceForm((f: any) => ({...f, crop: e.target.value}))} placeholder="Crop name" className="border border-cream-300 rounded px-2 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-forest-400" /></td>
                      <td className="py-1.5 px-2"><select value={newPriceForm.market} onChange={e => setNewPriceForm((f: any) => ({...f, market: e.target.value}))} className="border border-cream-300 rounded px-1 py-1 text-xs focus:outline-none"><option value="">Category</option>{["Cereals","Legumes","Root & Tuber Crops","Vegetables","Cash Crops","Fruits & Trees"].map(c => <option key={c}>{c}</option>)}</select></td>
                      <td className="py-1.5 px-2 text-xs text-soil-500">auto</td>
                      <td className="py-1.5 px-2"><input type="number" value={newPriceForm.unit} onChange={e => setNewPriceForm((f: any) => ({...f, unit: e.target.value}))} placeholder="kg/acre" className="border border-cream-300 rounded px-2 py-1 text-xs w-20 focus:outline-none" /></td>
                      <td className="py-1.5 px-2"><input type="number" value={newPriceForm.price_per_kg} onChange={e => setNewPriceForm((f: any) => ({...f, price_per_kg: e.target.value}))} placeholder="KES" className="border border-cream-300 rounded px-2 py-1 text-xs w-16 focus:outline-none" /></td>
                      <td colSpan={4} className="py-1.5 px-2 text-xs text-soil-500">medium</td>
                      <td className="py-1.5 px-2 text-xs text-soil-500">—</td>
                      <td className="py-1.5 px-2">
                        <div className="flex gap-1">
                          <button
                            onClick={async () => {
                              if (!newPriceForm.crop) return;
                              setPriceSaving(true); setCropPriceMsg(null);
                              try {
                                const res = await fetch(`${API}/api/v1/crops/admin/economics`, {
                                  method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` },
                                  body: JSON.stringify({ name: newPriceForm.crop, category: newPriceForm.market || "Other", price_per_kg: newPriceForm.price_per_kg ? parseFloat(newPriceForm.price_per_kg) : null, yield_per_acre: newPriceForm.unit ? parseInt(newPriceForm.unit) : null }),
                                });
                                if (res.ok) { setCropPriceMsg({type:"success",text:"Crop added"}); setNewPriceForm(null); fetchTab("crops"); }
                                else { const d = await res.json(); setCropPriceMsg({type:"error",text:d.detail||"Failed"}); }
                              } finally { setPriceSaving(false); }
                            }}
                            disabled={priceSaving || !newPriceForm.crop}
                            className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800 disabled:opacity-50"
                          >
                            {priceSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                          </button>
                          <button onClick={() => setNewPriceForm(null)} className="p-1.5 border border-cream-200 text-soil-500 rounded hover:text-red-500"><X size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {cropPrices.map((p: any, i: number) => (
                    <tr key={p.id} className={`border-b border-cream-100 group ${i % 2 === 0 ? "bg-white" : "bg-cream-50"}`}>
                      {editingPrice?.id === p.id ? (
                        <>
                          <td className="py-1.5 px-2 font-medium text-forest-800 text-xs">{p.name}</td>
                          <td className="py-1.5 px-2"><select value={editingPrice.category} onChange={e => setEditingPrice((prev: any) => ({...prev, category: e.target.value}))} className="border border-cream-300 rounded px-1 py-1 text-xs focus:outline-none">{["Cereals","Legumes","Root & Tuber Crops","Vegetables","Cash Crops","Fruits & Trees","Other"].map(c => <option key={c}>{c}</option>)}</select></td>
                          <td className="py-1.5 px-2"><span className="text-xs text-soil-500"><input type="number" step="0.5" value={editingPrice.ph_min} onChange={e => setEditingPrice((p: any) => ({...p, ph_min: e.target.value}))} className="border border-cream-300 rounded px-1 py-0.5 text-xs w-12 focus:outline-none" />–<input type="number" step="0.5" value={editingPrice.ph_max} onChange={e => setEditingPrice((p: any) => ({...p, ph_max: e.target.value}))} className="border border-cream-300 rounded px-1 py-0.5 text-xs w-12 focus:outline-none" /></span></td>
                          <td className="py-1.5 px-2"><input type="number" value={editingPrice.yield_per_acre} onChange={e => setEditingPrice((p: any) => ({...p, yield_per_acre: e.target.value}))} className="border border-cream-300 rounded px-2 py-1 text-xs w-20 focus:outline-none" /></td>
                          <td className="py-1.5 px-2"><input type="number" value={editingPrice.price_per_kg} onChange={e => setEditingPrice((p: any) => ({...p, price_per_kg: e.target.value}))} className="border border-cream-300 rounded px-2 py-1 text-xs w-16 focus:outline-none" /></td>
                          {["n_need","p_need","k_need"].map(k => (
                            <td key={k} className="py-1.5 px-1"><select value={editingPrice[k]} onChange={e => setEditingPrice((p: any) => ({...p, [k]: e.target.value}))} className="border border-cream-300 rounded px-1 py-1 text-xs focus:outline-none"><option>low</option><option>medium</option><option>high</option></select></td>
                          ))}
                          <td className="py-1.5 px-2"><input value={editingPrice.pref_texture} onChange={e => setEditingPrice((p: any) => ({...p, pref_texture: e.target.value}))} className="border border-cream-300 rounded px-2 py-1 text-xs w-24 focus:outline-none" /></td>
                          <td className="py-1.5 px-2 text-xs text-soil-500">—</td>
                          <td className="py-1.5 px-2">
                            <div className="flex gap-1">
                              <button
                                onClick={async () => {
                                  setPriceSaving(true); setCropPriceMsg(null);
                                  try {
                                    const res = await fetch(`${API}/api/v1/crops/admin/economics/${p.id}`, {
                                      method: "PATCH", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` },
                                      body: JSON.stringify({ category: editingPrice.category, ph_min: parseFloat(editingPrice.ph_min), ph_max: parseFloat(editingPrice.ph_max), price_per_kg: parseFloat(editingPrice.price_per_kg), yield_per_acre: parseInt(editingPrice.yield_per_acre), n_need: editingPrice.n_need, p_need: editingPrice.p_need, k_need: editingPrice.k_need, pref_texture: editingPrice.pref_texture }),
                                    });
                                    if (res.ok) { setCropPriceMsg({type:"success",text:`${p.name} updated`}); setEditingPrice(null); fetchTab("crops"); }
                                    else { const d = await res.json(); setCropPriceMsg({type:"error",text:d.detail||"Failed"}); }
                                  } finally { setPriceSaving(false); }
                                }}
                                disabled={priceSaving}
                                className="p-1.5 bg-forest-700 text-white rounded hover:bg-forest-800 disabled:opacity-50"
                              >
                                {priceSaving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                              </button>
                              <button onClick={() => setEditingPrice(null)} className="p-1.5 border border-cream-200 text-soil-500 rounded hover:text-red-500"><X size={12} /></button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-2 px-2 font-medium text-forest-800 text-xs">{p.name}</td>
                          <td className="py-2 px-2 text-xs text-soil-500">{p.category}</td>
                          <td className="py-2 px-2 text-xs text-soil-500">{p.ph_min}–{p.ph_max}</td>
                          <td className="py-2 px-2 text-xs text-forest-700">{p.yield_per_acre ? p.yield_per_acre.toLocaleString() : "—"}</td>
                          <td className="py-2 px-2 text-xs font-semibold text-green-700">KES {p.price_per_kg ?? "—"}</td>
                          <td className="py-2 px-2 text-xs text-soil-500">{p.n_need}</td>
                          <td className="py-2 px-2 text-xs text-soil-500">{p.p_need}</td>
                          <td className="py-2 px-2 text-xs text-soil-500">{p.k_need}</td>
                          <td className="py-2 px-2 text-xs text-soil-500">{p.pref_texture || "—"}</td>
                          <td className="py-2 px-2 text-xs text-soil-300">{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : "—"}</td>
                          <td className="py-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-1">
                              <button onClick={() => setEditingPrice({...p, price_per_kg: String(p.price_per_kg ?? ""), yield_per_acre: String(p.yield_per_acre ?? ""), ph_min: String(p.ph_min), ph_max: String(p.ph_max), pref_texture: p.pref_texture ?? ""})} className="p-1.5 text-soil-500 hover:text-forest-700 transition-colors"><PenLine size={13} /></button>
                              <button onClick={async () => { if (!confirm(`Delete ${p.name}?`)) return; const res = await fetch(`${API}/api/v1/crops/admin/economics/${p.id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${code}` } }); if (res.ok) { setCropPriceMsg({type:"success",text:`${p.name} deleted`}); fetchTab("crops"); } }} className="p-1.5 text-soil-500 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DEALERS ═══ */}
      {!loading && tab === "dealers" && (
        <div>
          <div className="flex gap-2 mb-6">
            {["pending", "approved", "declined", "all"].map(s => (
              <button key={s} onClick={() => setDealerFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${dealerFilter === s ? "bg-forest-700 text-white" : "bg-white border border-cream-300 text-soil-500"}`}>{s}</button>
            ))}
          </div>
          {dealers.length === 0 ? <p className="text-center py-12 text-soil-500">No {dealerFilter} applications.</p> : (
            <div className="space-y-4">
              {dealers.map(d => (
                <div key={d.id} className="bg-white rounded-xl border border-cream-300 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-forest-700 text-lg">{d.business_name}</h3>
                      <p className="text-sm text-soil-500">{d.town}, {d.county} · {d.phone_number}</p>
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
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex gap-2">
              {(["all", "flagged", "verified", "rejected"] as const).map(s => (
                <button key={s} onClick={() => setYieldsFilter(s)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${yieldsFilter === s ? "bg-forest-700 text-white" : "bg-white border border-cream-300 text-soil-500"}`}>{s}</button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-soil-500">{yieldTotal} records</span>
              <button
                onClick={exportFullDataset}
                className="flex items-center gap-2 px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold rounded-xl"
              >
                <Upload size={14} className="rotate-180" /> Download CSV
              </button>
            </div>
          </div>
          {yields.length === 0 ? (
            <div className="text-center py-16"><CheckCircle size={32} className="text-green-500 mx-auto mb-4" /><p className="text-soil-500">No {yieldsFilter === "all" ? "" : yieldsFilter + " "}yield records.</p></div>
          ) : (
            <div className="space-y-4">
              {yields.map(y => (
                <div key={y.id} className="bg-white rounded-xl border border-cream-300 p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-forest-700">{y.crop} — {y.yield_bags_per_acre} {y.yield_unit || "bags/acre"}</h3>
                    <p className="text-sm text-soil-500">Farmer: {y.farmer_id} · {y.season}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${y.status === "flagged" ? "bg-red-50 text-red-700" : y.status === "verified" ? "bg-green-50 text-green-700" : "bg-cream-100 text-soil-500"}`}>
                        {y.status === "flagged" && <AlertTriangle size={12} />}
                        {y.status === "verified" && <CheckCircle size={12} />}
                        {y.status}
                      </span>
                      {y.flag_reason && <span className="text-xs text-soil-400">{y.flag_reason}</span>}
                    </div>
                  </div>
                  {y.status === "flagged" && (
                    <div className="flex gap-2">
                      <button onClick={() => reviewYield(y.id, "verified")} disabled={actionLoading === String(y.id)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50"><Check size={14} /> Verify</button>
                      <button onClick={() => reviewYield(y.id, "rejected")} disabled={actionLoading === String(y.id)} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl disabled:opacity-50"><X size={14} /> Reject</button>
                    </div>
                  )}
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
                <div>
                  <h2 className="font-display text-lg font-bold text-forest-700">Blog Posts</h2>
                  <p className="text-xs text-soil-500 mt-0.5">AI auto-posts every Monday 08:00 EAT</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      if (!confirm("Generate and publish an AI blog post now?")) return;
                      setAiGenerating(true);
                      try {
                        const res = await fetch(`${API}/api/v1/blog/admin/auto-generate`, {
                          method: "POST",
                          headers: { "Authorization": `Bearer ${code}` },
                        });
                        const data = await res.json();
                        if (res.ok) {
                          alert(`✓ Published: "${data.title}"\n\n/blog/${data.slug}`);
                          fetchTab("blog");
                        } else {
                          alert(data.detail || "AI generation failed");
                        }
                      } catch { alert("Network error"); }
                      finally { setAiGenerating(false); }
                    }}
                    disabled={aiGenerating}
                    className="flex items-center gap-2 px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white text-sm font-semibold rounded-xl disabled:opacity-50"
                  >
                    {aiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {aiGenerating ? "Generating…" : "AI Generate"}
                  </button>
                  <button onClick={() => { setEditing(null); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); setFocusKeyword(""); setShowBlogEditor(true); setActiveEditorTab("write"); }} className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white text-sm font-semibold rounded-xl"><Plus size={14} /> New Post</button>
                </div>
              </div>
              {posts.length === 0 ? <p className="text-center py-12 text-soil-500">No blog posts yet.</p> : (
                <div className="space-y-3">
                  {posts.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border border-cream-300 p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-forest-700">{p.title}</h3>
                        <div className="flex gap-3 mt-1 text-xs text-soil-500">
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
                linkSuggestions.push({ keyword: "maize", text: "Maize farming guide", link: "/crops/maize" });
              }
              if (lowerContent.includes("potato") && !lowerContent.includes("/crops/potato")) {
                linkSuggestions.push({ keyword: "potato", text: "Potato farming guide", link: "/crops/potato" });
              }
              if (lowerContent.includes("tomato") && !lowerContent.includes("/crops/tomato")) {
                linkSuggestions.push({ keyword: "tomato", text: "Tomato farming guide", link: "/crops/tomato" });
              }
              if (lowerContent.includes("nakuru") && !lowerContent.includes("/soil/nakuru")) {
                linkSuggestions.push({ keyword: "nakuru", text: "Nakuru soil report", link: "/soil/nakuru" });
              }
              if (lowerContent.includes("meru") && !lowerContent.includes("/soil/meru")) {
                linkSuggestions.push({ keyword: "meru", text: "Meru soil report", link: "/soil/meru" });
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
                        <h2 className="font-display text-xl font-bold text-forest-700">{editing ? "Edit post" : "Create new post"}</h2>
                        <p className="text-xs text-soil-500">Draft or publish helpful crop guides, seasonal tips, or soil science reports.</p>
                      </div>
                      <button onClick={() => { setEditing(null); setShowBlogEditor(false); setActiveEditorTab("write"); setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" }); setFocusKeyword(""); }} className="text-sm font-medium text-soil-500 hover:text-forest-700 transition-colors">← Back to list</button>
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
                            {["Guide", "Data report", "Soil science", "Fertilizer", "Seasonal", "News"].map(c => <option key={c}>{c}</option>)}
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
                          <span className={`text-xs font-semibold ${isExcerptLenGood ? "text-emerald-600" : "text-soil-500"}`}>
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
                                  : "text-soil-500 hover:text-forest-700"
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
                                  : "text-soil-500 hover:text-forest-700"
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
                                  : "text-soil-500 hover:text-forest-700"
                              }`}
                            >
                              <Columns size={13} />
                              Split View
                            </button>
                          </div>
                          
                          <span className={`text-xs font-semibold ${isWordCountGood ? "text-emerald-600" : "text-soil-500"}`}>
                            {wordCount} words
                          </span>
                        </div>

                        {activeEditorTab === "write" && (
                          <>
                            {/* Markdown toolbar */}
                            <div className="flex flex-wrap items-center gap-1 p-2 border border-cream-300 border-b-0 rounded-t-xl bg-cream-50">
                              {[
                                { label: "B", title: "Bold", action: () => insert("**", "**", "bold text"), className: "font-bold" },
                                { label: "I", title: "Italic", action: () => insert("_", "_", "italic text"), className: "italic" },
                                { label: "H2", title: "Heading 2", action: () => insertHeading(2), className: "font-semibold" },
                                { label: "H3", title: "Heading 3", action: () => insertHeading(3), className: "font-semibold" },
                                { label: "Link", title: "Link", action: () => insert("[", "](url)", "link text"), className: "", icon: Link2 },
                                { label: "Image", title: "Image", action: () => setImgModal({ url: "", alt: "" }), className: "", icon: Image },
                                { label: "Quote", title: "Blockquote", action: () => insert("> ", "", "quoted text"), className: "" },
                                { label: "Code", title: "Inline code", action: () => insert("`", "`", "code"), className: "font-mono" },
                                { label: "—", title: "Divider", action: () => insert("\n\n---\n\n", "", ""), className: "" },
                              ].map(({ label, title, action, className, icon: Icon }) => (
                                <button
                                  key={label}
                                  type="button"
                                  title={title}
                                  onClick={action}
                                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-soil-500 hover:text-forest-700 hover:bg-cream-200 rounded-lg transition-colors"
                                >
                                  {Icon ? <Icon size={13} /> : null}
                                  <span className={className}>{label}</span>
                                </button>
                              ))}
                            </div>
                            <textarea
                              ref={editorRef}
                              value={blogForm.content}
                              onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
                              placeholder="Write your blog post here...&#10;&#10;## Use headings&#10;&#10;**Bold text** and [links](/soil/nakuru) work.&#10;&#10;Link to county pages: [Nakuru soil report](/soil/nakuru)&#10;Link to crop pages: [Maize guide](/crops/maize)&#10;Link to the tool: [Get advice](/app)"
                              rows={18}
                              className="w-full px-4 py-3 border border-cream-300 rounded-b-xl text-forest-700 font-mono text-sm focus:outline-none focus:border-gold-400 resize-y"
                            />
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
                          {editing ? "Update post" : "Create post"}
                        </button>
                        {editing && blogForm.status === "draft" && (
                          <button onClick={async () => {
                            const updatedForm = { ...blogForm, status: "published" };
                            setBlogForm(updatedForm);
                            setBlogSaving(true);
                            try {
                              const payload = { ...updatedForm, focus_keyword: focusKeyword };
                              const res = editing
                                ? await fetch(`${API}/api/v1/blog/admin/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(payload) })
                                : await fetch(`${API}/api/v1/blog/admin/create`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${code}` }, body: JSON.stringify(payload) });
                              if (res.ok) {
                                setEditing(null);
                                setShowBlogEditor(false);
                                setBlogForm({ title: "", content: "", excerpt: "", category: "Guide", status: "draft", read_time: "5 min read" });
                                setFocusKeyword("");
                                alert("Post published successfully!");
                                fetchTab("blog");
                              } else {
                                const err = await res.json().catch(() => ({}));
                                alert(err.detail ? (typeof err.detail === "string" ? err.detail : JSON.stringify(err.detail)) : `Failed (${res.status})`);
                              }
                            } finally {
                              setBlogSaving(false);
                            }
                          }} className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl shadow-sm transition-colors">Publish Now</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: SEO Assistant side panel */}
                  <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
                    {/* Focus Keyword Input Card */}
                    <div className="bg-white rounded-2xl border border-cream-300 p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-gold-50 border border-gold-200 text-gold-700 rounded-lg">
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
                      <p className="text-[11px] text-soil-500 mt-2 leading-relaxed">
                        Specify the search query this post aims to rank for. Real-time checklist matches will sync below.
                      </p>
                    </div>

                    {/* SEO Score Display */}
                    <div className={`bg-white rounded-2xl border p-5 shadow-sm transition-all duration-300`}>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[11px] font-bold text-soil-500 uppercase tracking-wider block">SEO Health Score</span>
                          <span className="font-display text-3xl font-extrabold text-forest-700">{score}<span className="text-sm font-normal text-soil-300">/100</span></span>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                          {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs work"}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-cream-100 rounded-full h-2 mb-3 overflow-hidden border border-cream-200/50">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>

                      <p className="text-[11px] text-soil-500 leading-relaxed">
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
                        <Globe size={15} className="text-soil-500" />
                        <h3 className="font-display font-bold text-forest-700 text-sm">Google SERP Snippet Preview</h3>
                      </div>
                      
                      <div className="bg-cream-50/50 p-4 border border-cream-200 rounded-xl font-sans text-left space-y-1.5 shadow-inner">
                        {/* URL snippet */}
                        <div className="flex items-center gap-1.5 text-xs text-soil-500 truncate">
                          <span className="bg-cream-200 px-1 py-0.5 rounded text-[9px] font-semibold text-forest-700 uppercase tracking-tight">organic</span>
                          <span className="truncate">https://shambaiq.com › blog › {slugPreview}</span>
                        </div>
                        {/* Blue Google link title */}
                        <a href="#" className="font-sans text-[#1a0dab] hover:underline font-normal text-[17px] leading-tight block truncate">
                          {blogForm.title || "Post title preview"}
                        </a>
                        {/* Snippet Description */}
                        <p className="text-xs text-soil-500 font-sans leading-relaxed line-clamp-2">
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
                                <span className="font-semibold text-soil-500">{titleLen}/60 chars</span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                <span className="font-semibold text-soil-500">{h2Count} found</span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                <span className="font-semibold text-soil-500">{wordCount} / 300 words</span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                <span className="font-semibold text-soil-500">{keywordDensity}% ({keywordCount}x)</span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                <span className="font-semibold text-soil-500">{excerptLen}/160 chars</span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                <span className="font-semibold text-soil-500">{internalLinks.length} added</span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                        <Link2 size={10} className="text-soil-500 shrink-0" />
                                        <span className="font-semibold text-forest-700 truncate max-w-[80px]">"{text}"</span>
                                        <span className="text-soil-300 shrink-0">→</span>
                                        <code className="bg-white border px-1 rounded text-[9px] truncate max-w-[90px]">{url}</code>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {linkSuggestions.length > 0 && (
                                <div className="mt-2.5 pl-3 pr-2 py-2 bg-gold-50 border border-gold-200 text-[10px] text-gold-850 rounded-lg space-y-1">
                                  <span className="font-bold flex items-center gap-1 text-gold-800"><Sparkles size={10} className="text-gold-700" /> Link Suggestions:</span>
                                  <p className="text-[9px] text-gold-700 leading-snug">We noticed these keywords. Copy-paste these internal links to boost SEO ranking:</p>
                                  <div className="space-y-1 mt-1">
                                    {linkSuggestions.slice(0, 3).map((s, idx) => (
                                      <div key={idx} className="flex flex-col gap-0.5 bg-white border border-gold-150 p-1.5 rounded">
                                        <span className="font-medium text-forest-700">Keyword: "{s.keyword}"</span>
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
                                <span className="font-semibold text-soil-500">
                                  {hasImages ? `${imageMatches.length} img` : "No images"}
                                </span>
                              </div>
                              <p className="text-[10px] text-soil-500 mt-0.5 leading-snug">
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
                                        <span className="truncate max-w-[100px] font-mono text-soil-500">{url.split('/').pop()}</span>
                                        {isGood ? (
                                          <span className="text-emerald-600 font-medium flex items-center gap-0.5"><Check size={9} /> "{alt}"</span>
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
              <Search size={16} className="absolute left-4 top-3.5 text-soil-500" />
              <input value={farmerSearch} onChange={e => setFarmerSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchTab("farmers")} placeholder="Search by name, phone, or county..." className="w-full pl-10 pr-4 py-3 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:border-gold-400" />
            </div>
            <button onClick={() => fetchTab("farmers")} className="px-6 py-3 bg-forest-700 text-white font-semibold rounded-xl">Search</button>
          </div>
          {farmers.length === 0 ? <p className="text-center py-12 text-soil-500">No farmers found.</p> : (
            <div className="space-y-3">
              {farmers.map(fm => (
                <div key={fm.id} className="bg-white rounded-xl border border-cream-300">
                  <button onClick={() => loadFarmerDetail(fm.id)} className="w-full p-4 flex items-center justify-between text-left">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-forest-700/10 rounded-full flex items-center justify-center text-forest-700 font-bold text-sm">{fm.name?.charAt(0) || "?"}</div>
                      <div>
                        <h3 className="font-semibold text-forest-700">{fm.name || "Unnamed"}</h3>
                        <div className="flex gap-3 text-xs text-soil-500">
                          <span className="flex items-center gap-1"><Phone size={10} /> {fm.phone_number}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} /> {fm.county}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-xs text-soil-500 hidden sm:block">
                        <div>{fm.fields} fields · {fm.recommendations} recs · {fm.yields_logged} yields</div>
                        <div>{new Date(fm.created_at).toLocaleDateString("en-KE")}</div>
                      </div>
                      {farmerDetail?.farmer?.id === fm.id ? <ChevronDown size={16} className="text-soil-500" /> : <ChevronRight size={16} className="text-soil-500" />}
                    </div>
                  </button>
                  {farmerDetail?.farmer?.id === fm.id && (
                    <div className="border-t border-cream-200 p-4 bg-cream-50">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-xs font-semibold text-soil-500 uppercase mb-2">Fields ({farmerDetail.fields.length})</h4>
                          {farmerDetail.fields.length === 0 ? <p className="text-xs text-soil-300">No fields registered</p> : farmerDetail.fields.map((f: any) => (
                            <div key={f.id} className="text-sm mb-2"><span className="font-medium text-forest-700">{f.name}</span><br /><span className="text-xs text-soil-500">{f.size_acres} acres · {f.primary_crop} · {f.ward || f.county}</span></div>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-soil-500 uppercase mb-2">Recent Recommendations ({farmerDetail.recommendations.length})</h4>
                          {farmerDetail.recommendations.slice(0, 5).map((r: any) => (
                            <div key={r.id} className="text-sm mb-2"><span className="font-medium text-forest-700">{r.crop}</span> in {r.county}<br /><span className="text-xs text-soil-500">Score: {r.health_score} · KES {r.total_budget?.toLocaleString()} · {new Date(r.created_at).toLocaleDateString("en-KE")}</span></div>
                          ))}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-soil-500 uppercase mb-2">Yield History ({farmerDetail.yields.length})</h4>
                          {farmerDetail.yields.map((y: any) => (
                            <div key={y.id} className="text-sm mb-2"><span className="font-medium text-forest-700">{y.crop}</span> — {y.yield_bags_per_acre} bags/acre<br /><span className="text-xs text-soil-500">{y.season} · <span className={y.status === "flagged" ? "text-red-500" : "text-green-600"}>{y.status}</span></span></div>
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
                <p className="text-xs text-soil-500">Upload a CSV to add or replace agrovets in the directory. CSV must have at least <code className="bg-cream-100 px-1 rounded">name</code> and <code className="bg-cream-100 px-1 rounded">county</code> columns.</p>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-bold text-forest-700">{agrovetTotal}</div>
                <div className="text-xs text-soil-500">Total Agrovets</div>
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
                  <Upload size={20} className="text-soil-500" />
                  <span className="text-sm text-soil-500">{agrovetUploading ? "Uploading..." : "Drop CSV or click to browse"}</span>
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
                <Search size={16} className="absolute left-4 top-3.5 text-soil-500" />
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
                      <td className="px-4 py-3 text-soil-500">{a.county}</td>
                      <td className="px-4 py-3 text-soil-500">{a.town || "—"}</td>
                      <td className="px-4 py-3 text-soil-500">{a.phone || "—"}</td>
                      <td className="px-4 py-3 text-soil-500">{a.rating || "—"}</td>
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
          {audit.length === 0 ? <p className="text-center py-16 text-soil-500">No audit entries yet.</p> : (
            <div className="bg-white rounded-xl border border-cream-300 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-cream-100"><th className="px-4 py-3 text-left font-semibold text-forest-700">Action</th><th className="px-4 py-3 text-left font-semibold text-forest-700">Target</th><th className="px-4 py-3 text-left font-semibold text-forest-700">Details</th><th className="px-4 py-3 text-left font-semibold text-forest-700">Date</th></tr></thead>
                <tbody>{audit.map(a => (
                  <tr key={a.id} className="border-t border-cream-200">
                    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${a.action.includes("approved") || a.action.includes("verified") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{a.action.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3 text-soil-500">{a.target_type?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-soil-500">{a.details || "—"}</td>
                    <td className="px-4 py-3 text-soil-500 whitespace-nowrap">{new Date(a.created_at).toLocaleDateString("en-KE")}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>

    {/* ═══ IMAGE INSERT MODAL ═══ */}
    {imgModal !== null && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-forest-700 text-lg">Insert Image</h3>
            <button onClick={() => setImgModal(null)} className="p-1.5 text-soil-500 hover:text-red-500 transition-colors"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-soil-500 mb-1">Image URL *</label>
              <input
                autoFocus
                value={imgModal.url}
                onChange={e => setImgModal(m => m ? { ...m, url: e.target.value } : m)}
                placeholder="https://images.example.com/photo.jpg"
                className="w-full px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-soil-500 mb-1">Alt Text (for SEO & accessibility)</label>
              <input
                value={imgModal.alt}
                onChange={e => setImgModal(m => m ? { ...m, alt: e.target.value } : m)}
                placeholder="e.g. Maize farmer harvesting in Nakuru"
                className="w-full px-3 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 focus:outline-none focus:border-gold-400"
              />
            </div>
            {imgModal.url && (
              <div className="rounded-xl border border-cream-200 overflow-hidden bg-cream-50 flex items-center justify-center min-h-[120px]">
                <img
                  src={imgModal.url}
                  alt={imgModal.alt || "preview"}
                  className="max-h-48 max-w-full object-contain"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setImgModal(null)}
                className="flex-1 py-2.5 border border-cream-300 text-soil-500 font-semibold rounded-xl text-sm hover:border-red-300 hover:text-red-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={insertImageFromModal}
                disabled={!imgModal.url}
                className="flex-1 py-2.5 bg-forest-700 text-white font-semibold rounded-xl text-sm hover:bg-forest-800 transition-colors disabled:opacity-40"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
