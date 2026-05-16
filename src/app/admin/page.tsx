"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Lock, Store, BarChart3, AlertTriangle, FileText,
  Check, CheckCircle, X, Loader2, RefreshCw, Users, TrendingUp, MapPin, Wheat,
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

type Tab = "stats" | "dealers" | "yields" | "audit";

interface DealerApp {
  id: string;
  business_name: string;
  county: string;
  town: string;
  phone_number: string;
  products_stocked: string;
  status: string;
  created_at: string;
}

interface FlaggedYield {
  id: number;
  farmer_id: string;
  crop: string;
  season: string;
  yield_bags_per_acre: number;
  flag_reason: string;
  timestamp: string;
}

interface Stats {
  total_queries: number;
  soil_health: Record<string, number>;
  county_distribution: Record<string, number>;
  crop_distribution: Record<string, number>;
  feedback: { total_responses: number; average_rating: number | null };
  pending_dealer_applications: number;
  flagged_yields: number;
}

interface AuditEntry {
  id: string;
  officer_id: string;
  action: string;
  target_type: string;
  target_id: string;
  details: string | null;
  created_at: string;
}

export default function AdminDashboard() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [tab, setTab] = useState<Tab>("stats");
  const [loading, setLoading] = useState(false);

  // Data states
  const [stats, setStats] = useState<Stats | null>(null);
  const [dealers, setDealers] = useState<DealerApp[]>([]);
  const [yields, setYields] = useState<FlaggedYield[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async (activeTab: Tab) => {
    setLoading(true);
    try {
      if (activeTab === "stats") {
        const res = await fetch(`${API_BASE}/api/v1/analytics/stats?access_code=${code}`);
        if (res.ok) setStats(await res.json());
      } else if (activeTab === "dealers") {
        const res = await fetch(`${API_BASE}/api/v1/dealers/applications?status=pending&access_code=${code}`);
        if (res.ok) {
          const data = await res.json();
          setDealers(data.applications || []);
        }
      } else if (activeTab === "yields") {
        const res = await fetch(`${API_BASE}/api/v1/analytics/yields/flagged?access_code=${code}`);
        if (res.ok) {
          const data = await res.json();
          setYields(data.records || []);
        }
      } else if (activeTab === "audit") {
        const res = await fetch(`${API_BASE}/api/v1/analytics/audit-log?access_code=${code}`);
        if (res.ok) {
          const data = await res.json();
          setAudit(data.logs || []);
        }
      }
    } catch { /* Network error — silently handle */ }
    setLoading(false);
  }, [code]);

  const handleLogin = async () => {
    setAuthError(false);
    try {
      const res = await fetch(`${API_BASE}/api/v1/analytics/stats?access_code=${code}`);
      if (res.ok) {
        setAuthenticated(true);
        setStats(await res.json());
      } else {
        setAuthError(true);
      }
    } catch {
      setAuthError(true);
    }
  };

  useEffect(() => {
    if (authenticated) fetchData(tab);
  }, [authenticated, tab, fetchData]);

  const reviewDealer = async (id: string, status: "approved" | "declined") => {
    setActionLoading(id);
    try {
      await fetch(`${API_BASE}/api/v1/dealers/applications/${id}?access_code=${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, officer_id: "admin" }),
      });
      setDealers((prev) => prev.filter((d) => d.id !== id));
    } catch { /* Error handling */ }
    setActionLoading(null);
  };

  const reviewYield = async (id: number, status: "verified" | "rejected") => {
    setActionLoading(String(id));
    try {
      await fetch(`${API_BASE}/api/v1/analytics/yields/${id}/review?access_code=${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, officer_id: "admin" }),
      });
      setYields((prev) => prev.filter((y) => y.id !== id));
    } catch { /* Error handling */ }
    setActionLoading(null);
  };

  // ─── Login gate ───
  if (!authenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="w-14 h-14 bg-forest-700/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-forest-700" />
          </div>
          <h1 className="font-display text-2xl font-bold text-forest-700 text-center mb-2">
            Admin Dashboard
          </h1>
          <p className="text-soil-400 text-center text-sm mb-8">
            Enter your officer access code
          </p>
          <input
            type="password"
            placeholder="Access code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 mb-4"
          />
          {authError && (
            <p className="text-sm text-red-600 mb-4 text-center">Invalid access code</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───
  const tabs: { key: Tab; label: string; icon: typeof BarChart3; badge?: number }[] = [
    { key: "stats", label: "Overview", icon: BarChart3 },
    { key: "dealers", label: "Dealers", icon: Store, badge: stats?.pending_dealer_applications },
    { key: "yields", label: "Yields", icon: AlertTriangle, badge: stats?.flagged_yields },
    { key: "audit", label: "Audit Log", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-forest-700">Admin Dashboard</h1>
        <button
          onClick={() => fetchData(tab)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-soil-400 hover:text-forest-700 border border-cream-300 rounded-lg hover:border-gold-400 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                tab === t.key
                  ? "bg-forest-700 text-white"
                  : "bg-white border border-cream-300 text-soil-400 hover:border-gold-400"
              }`}
            >
              <Icon size={16} />
              {t.label}
              {t.badge != null && t.badge > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {t.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-forest-700" />
        </div>
      )}

      {/* ─── Stats tab ─── */}
      {!loading && tab === "stats" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Queries", value: stats.total_queries, icon: Users, color: "#16a34a" },
              { label: "Pending Dealers", value: stats.pending_dealer_applications, icon: Store, color: "#f59e0b" },
              { label: "Flagged Yields", value: stats.flagged_yields, icon: AlertTriangle, color: "#dc2626" },
              { label: "Avg Rating", value: stats.feedback.average_rating ? `${stats.feedback.average_rating}/5` : "—", icon: TrendingUp, color: "#2563eb" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl p-5 border border-cream-300">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                      <Icon size={20} style={{ color: s.color }} />
                    </div>
                  </div>
                  <div className="font-display text-2xl font-bold text-forest-700">{s.value}</div>
                  <div className="text-xs text-soil-400 mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Soil Health */}
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Soil Health Issues</h3>
              <div className="space-y-3">
                {Object.entries(stats.soil_health).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-soil-400 capitalize">{key.replace(/_/g, " ")}</span>
                    <span className="font-semibold text-forest-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Counties */}
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Top Counties</h3>
              <div className="space-y-3">
                {Object.entries(stats.county_distribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([county, count]) => (
                    <div key={county} className="flex items-center justify-between">
                      <span className="text-sm text-soil-400 flex items-center gap-2">
                        <MapPin size={14} /> {county}
                      </span>
                      <span className="font-semibold text-forest-700">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Crops */}
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Top Crops</h3>
              <div className="space-y-3">
                {Object.entries(stats.crop_distribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([crop, count]) => (
                    <div key={crop} className="flex items-center justify-between">
                      <span className="text-sm text-soil-400 flex items-center gap-2">
                        <Wheat size={14} /> {crop}
                      </span>
                      <span className="font-semibold text-forest-700">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="bg-white rounded-xl p-6 border border-cream-300">
              <h3 className="font-display font-bold text-forest-700 mb-4">Farmer Feedback</h3>
              <div className="text-center py-4">
                <div className="font-display text-4xl font-bold text-forest-700">
                  {stats.feedback.average_rating ? stats.feedback.average_rating.toFixed(1) : "—"}
                </div>
                <div className="text-sm text-soil-400 mt-1">Average rating out of 5</div>
                <div className="text-xs text-soil-300 mt-2">{stats.feedback.total_responses} responses</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Dealers tab ─── */}
      {!loading && tab === "dealers" && (
        <div>
          {dealers.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle size={32} className="text-green-500 mx-auto mb-4" />
              <p className="text-soil-400">No pending dealer applications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dealers.map((d) => (
                <div key={d.id} className="bg-white rounded-xl border border-cream-300 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-forest-700 text-lg">{d.business_name}</h3>
                      <p className="text-sm text-soil-400 mt-1">
                        {d.town}, {d.county} County
                      </p>
                      <p className="text-sm text-soil-400 mt-1">
                        Phone: {d.phone_number}
                      </p>
                      {d.products_stocked && (
                        <p className="text-sm text-soil-300 mt-1">
                          Products: {d.products_stocked}
                        </p>
                      )}
                      <p className="text-xs text-soil-300 mt-2">
                        Submitted: {new Date(d.created_at).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewDealer(d.id, "approved")}
                        disabled={actionLoading === d.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {actionLoading === d.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Approve
                      </button>
                      <button
                        onClick={() => reviewDealer(d.id, "declined")}
                        disabled={actionLoading === d.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        <X size={16} /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Flagged yields tab ─── */}
      {!loading && tab === "yields" && (
        <div>
          {yields.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle size={32} className="text-green-500 mx-auto mb-4" />
              <p className="text-soil-400">No flagged yields to review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {yields.map((y) => (
                <div key={y.id} className="bg-white rounded-xl border border-cream-300 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-forest-700">
                        {y.crop} — {y.yield_bags_per_acre} bags/acre
                      </h3>
                      <p className="text-sm text-soil-400 mt-1">
                        Farmer: {y.farmer_id} · Season: {y.season}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full">
                        <AlertTriangle size={12} /> {y.flag_reason}
                      </div>
                      <p className="text-xs text-soil-300 mt-2">
                        Reported: {new Date(y.timestamp).toLocaleDateString("en-KE")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => reviewYield(y.id, "verified")}
                        disabled={actionLoading === String(y.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        {actionLoading === String(y.id) ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Verify
                      </button>
                      <button
                        onClick={() => reviewYield(y.id, "rejected")}
                        disabled={actionLoading === String(y.id)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── Audit log tab ─── */}
      {!loading && tab === "audit" && (
        <div>
          {audit.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={32} className="text-soil-300 mx-auto mb-4" />
              <p className="text-soil-400">No audit entries yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-cream-300 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cream-100 text-left">
                      <th className="px-4 py-3 font-semibold text-forest-700">Action</th>
                      <th className="px-4 py-3 font-semibold text-forest-700">Target</th>
                      <th className="px-4 py-3 font-semibold text-forest-700">Details</th>
                      <th className="px-4 py-3 font-semibold text-forest-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {audit.map((a) => (
                      <tr key={a.id} className="border-t border-cream-200">
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            a.action.includes("approved") || a.action.includes("verified")
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}>
                            {a.action.includes("approved") || a.action.includes("verified") ? <Check size={12} /> : <X size={12} />}
                            {a.action.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-soil-400">{a.target_type?.replace(/_/g, " ")}</td>
                        <td className="px-4 py-3 text-soil-400">{a.details || "—"}</td>
                        <td className="px-4 py-3 text-soil-400 whitespace-nowrap">
                          {new Date(a.created_at).toLocaleDateString("en-KE")}
                        </td>
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
  );
}

