"use client";

import { useState } from "react";
import { Store, MapPin, Phone, Package, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://shambaiq-backend-production.up.railway.app";

const COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu",
  "Siaya","Taita Taveta","Tana River","Tharaka Nithi","Trans Nzoia","Turkana",
  "Uasin Gishu","Vihiga","Wajir","West Pokot"
];

export default function DealerApplyPage() {
  const [form, setForm] = useState({
    business_name: "",
    county: "",
    town: "",
    phone_number: "",
    email: "",
    products_stocked: "",
    lat: null as number | null,
    lon: null as number | null,
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "done">("idle");

  const captureGPS = () => {
    if (!navigator.geolocation) return;
    setGpsStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lon: pos.coords.longitude }));
        setGpsStatus("done");
      },
      () => setGpsStatus("idle"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async () => {
    if (!form.business_name || !form.county || !form.town || !form.phone_number) {
      setStatus("error");
      setMessage("Please fill in all required fields.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`${API_BASE}/api/v1/dealers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Application submitted successfully!");
      } else {
        setStatus("error");
        setMessage(data.message || data.detail || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="font-display text-2xl font-bold text-forest-700 mb-3">Application submitted!</h1>
        <p className="text-soil-400 mb-2">{message}</p>
        <p className="text-sm text-soil-300 mb-8">
          Our team will review your application and notify you by email once approved.
          This usually takes 1-3 business days.
        </p>
        <a
          href="/dealers/status"
          className="inline-block px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-xl transition-colors"
        >
          Check Application Status →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dealers", href: "/dealers" }, { label: "Register" }]} />

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-forest-700 mb-2">
          Register your agrovet
        </h1>
        <p className="text-soil-400">
          List your agricultural input shop on ShambaIQ and connect with farmers in your area.
        </p>
      </div>

      <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 mb-8 flex gap-3 items-start">
        <AlertCircle size={20} className="text-gold-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gold-700">
          All submissions are reviewed by ShambaIQ before going live. You'll be notified by email when your listing is approved.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-cream-300 p-6 md:p-8 space-y-6">
        {/* Business name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700 mb-2">
            <Store size={16} /> Business Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Kangemi Agrovet"
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
          />
        </div>

        {/* County + Town */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-forest-700 mb-2">
              <MapPin size={16} /> County *
            </label>
            <select
              value={form.county}
              onChange={(e) => setForm({ ...form, county: e.target.value })}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 bg-white transition-colors"
            >
              <option value="">Select county...</option>
              {COUNTIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-forest-700 mb-2 block">
              Town *
            </label>
            <input
              type="text"
              placeholder="e.g. Kangemi"
              value={form.town}
              onChange={(e) => setForm({ ...form, town: e.target.value })}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>
        </div>

        {/* Phone & Email */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-forest-700 mb-2">
              <Phone size={16} /> Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+254 7XX XXX XXX"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-forest-700 mb-2 block">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="e.g. hello@agrovet.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>
        </div>

        {/* Products */}
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700 mb-2">
            <Package size={16} /> Products Stocked
          </label>
          <input
            type="text"
            placeholder="e.g. DAP, CAN, seeds, pesticides..."
            value={form.products_stocked}
            onChange={(e) => setForm({ ...form, products_stocked: e.target.value })}
            className="w-full px-4 py-3 border border-cream-300 rounded-xl text-forest-700 placeholder:text-soil-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
          />
        </div>

        {/* GPS */}
        <div>
          <label className="text-sm font-semibold text-forest-700 mb-2 block">
            Shop Location (optional)
          </label>
          <button
            onClick={captureGPS}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-cream-300 rounded-xl text-soil-400 hover:border-gold-400 hover:text-forest-700 transition-colors"
          >
            {gpsStatus === "loading" ? (
              <><Loader2 size={16} className="animate-spin" /> Capturing location...</>
            ) : gpsStatus === "done" ? (
              <><CheckCircle size={16} className="text-green-600" /> Location captured: {form.lat?.toFixed(4)}, {form.lon?.toFixed(4)}</>
            ) : (
              <><MapPin size={16} /> Capture shop GPS location</>
            )}
          </button>
        </div>

        {/* Error message */}
        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={status === "loading"}
          className="w-full py-4 bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-bold rounded-xl text-lg transition-all flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <><Loader2 size={20} className="animate-spin" /> Submitting...</>
          ) : (
            "Submit for Review"
          )}
        </button>
      </div>
    </div>
  );
}
