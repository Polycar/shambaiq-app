"use client";

import { useState } from "react";
import { Search, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface Application {
  id: string;
  business_name: string;
  county: string;
  town: string;
  phone_number: string;
  status: "pending" | "approved" | "declined";
  created_at: string;
}

const STATUS_CONFIG = {
  pending: { icon: Clock, color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "Pending review" },
  approved: { icon: CheckCircle, color: "#16a34a", bg: "bg-green-50", border: "border-green-200", text: "text-green-700", label: "Approved" },
  declined: { icon: XCircle, color: "#dc2626", bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "Declined" },
};

export default function DealerStatusPage() {
  const [phone, setPhone] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const encodedPhone = encodeURIComponent(phone.trim());
      const res = await fetch(`${API_BASE}/api/v1/dealers/status/${encodedPhone}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      } else {
        setApplications([]);
      }
    } catch {
      setError("Could not connect to the server. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dealers", href: "/dealers" }, { label: "Status" }]} />

      <h1 className="font-display text-3xl font-bold text-forest-700 mb-2">
        Check application status
      </h1>
      <p className="text-soil-500 mb-8">
        Enter the phone number you used when registering your agrovet.
      </p>

      <div className="bg-white rounded-2xl border border-cream-300 p-6 mb-8">
        <label className="text-sm font-semibold text-forest-700 mb-2 block">
          Phone number
        </label>
        <div className="flex gap-3">
          <input
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Check
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {searched && !loading && applications.length === 0 && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={24} className="text-soil-500" />
          </div>
          <p className="text-soil-500 mb-4">No applications found for this phone number.</p>
          <a
            href="/dealers/apply"
            className="inline-block px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl transition-colors"
          >
            Register your agrovet →
          </a>
        </div>
      )}

      {applications.length > 0 && (
        <div className="space-y-4">
          {applications.map((app) => {
            const config = STATUS_CONFIG[app.status];
            const Icon = config.icon;
            return (
              <div key={app.id} className={`${config.bg} ${config.border} border rounded-2xl p-6`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-forest-700 text-lg">{app.business_name}</h3>
                    <p className="text-sm text-soil-500">{app.town}, {app.county} County</p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-semibold`}>
                    <Icon size={16} />
                    {config.label}
                  </div>
                </div>
                <p className="text-xs text-soil-500">
                  Submitted: {new Date(app.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
