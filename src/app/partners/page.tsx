"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Code, 
  MapPin, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  FileText, 
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

export default function PartnersPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    partnerType: "API Integration (B2B SaaS)",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/v1/partners/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          partner_type: formData.partnerType,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        let errData: any = {};
        try {
          errData = await res.json();
        } catch {}
        throw new Error(errData.detail || errData.message || "Failed to submit proposal. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Could not reach the server. Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-cream-50 flex flex-col font-body">
      {/* Hero Section */}
      <section className="bg-forest-700 py-16 md:py-24 px-4 text-center grain relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="px-3 py-1 bg-gold-400/20 text-gold-300 text-xs font-semibold rounded-full uppercase tracking-wider">
            B2B &amp; Govtech Solutions
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-cream-100 mt-6 mb-6">
            Partner with <span className="text-gold-400">ShambaIQ</span>
          </h1>
          <p className="text-cream-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Powering precision agriculture across Kenya. License our soil intelligence database, integrate our predictive crop algorithms, or sponsor hyper-local placement to grow your agribusiness.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 -mt-10 relative z-20">
        {/* Core Value Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center text-gold-700 mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-forest-900 mb-3">1. B2B Precision API</h3>
            <p className="text-forest-600 text-sm leading-relaxed mb-4">
              Query our dynamic soil diagnostics and crop suitability matrix via a secure, sub-second JSON API. Ideal for powering WhatsApp bots, USSD channels, or credit-scoring models.
            </p>
            <span className="text-xs text-soil-500 font-semibold uppercase tracking-wider block">API Tiers available</span>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-forest-600 mb-6">
              <Building2 size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-forest-900 mb-3">2. White-Label Portals</h3>
            <p className="text-forest-600 text-sm leading-relaxed mb-4">
              Get a co-branded subdomain portal (e.g. <i>coop.shambaiq.com</i>) complete with custom crop lists and local agrovets to support extension workers and county initiatives.
            </p>
            <span className="text-xs text-soil-500 font-semibold uppercase tracking-wider block">Annual licensing model</span>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="font-display font-bold text-xl text-forest-900 mb-3">3. Agrovet & Input Placements</h3>
            <p className="text-forest-600 text-sm leading-relaxed mb-4">
              Feature your premium seeds, fertilizers, or agrovet locations as the verified recommendation when farmers search their specific county soil conditions.
            </p>
            <span className="text-xs text-soil-500 font-semibold uppercase tracking-wider block">Lead generation program</span>
          </div>
        </div>

        {/* Form and Context */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-cream-100">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <CheckCircle2 size={48} />
                </div>
                <h2 className="font-display text-2xl font-bold text-forest-900 mb-4">Inquiry Received Successfully</h2>
                <p className="text-forest-600 text-sm max-w-md mx-auto mb-8">
                  Thank you for your interest in ShambaIQ. A member of our licensing team will contact you within 24 hours to schedule an introductory call.
                </p>
                <div className="p-4 bg-cream-50 rounded-xl border border-cream-200 text-xs text-soil-500 mb-6">
                  Reference: <strong>SIQ-L-{Math.floor(1000 + Math.random() * 9000)}</strong> · A copy of our standard Mutual NDA has been prepared for your review.
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 border border-forest-600 text-forest-700 font-semibold rounded-xl text-sm hover:bg-cream-50 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-bold text-forest-900 mb-2">Licensing Inquiry</h2>
                <p className="text-soil-500 text-sm mb-8">
                  Tell us about your organization and how you'd like to integrate our agronomic solutions.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm"
                        placeholder="e.g. David Kiprop"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">Company / Organization</label>
                      <input 
                        type="text" 
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm"
                        placeholder="e.g. Yara Kenya"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">Business Email</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm"
                        placeholder="name@organization.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm"
                        placeholder="e.g. +254 712..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">Partnership Focus</label>
                    <select 
                      value={formData.partnerType}
                      onChange={(e) => setFormData({...formData, partnerType: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234a5d4e%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option>API Integration (B2B SaaS)</option>
                      <option>White-Label Subdomain License</option>
                      <option>Agrovet / Input Placement Sponsorship</option>
                      <option>Custom Enterprise Integration</option>
                      <option>Other / Advisory Support</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-forest-700 mb-2">Integration or Placement Details</label>
                    <textarea 
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all text-sm resize-none"
                      placeholder="e.g. We wish to query your soil pH metrics inside our farmer SMS chatbot..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-xl p-4">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-forest-200 flex items-center justify-center gap-2 group disabled:opacity-75"
                  >
                    {isSubmitting ? "Processing..." : "Submit Proposal"} 
                    {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* Right Column: IP Security & Proof */}
          <div className="space-y-12">
            <div>
              <span className="text-gold-700 font-bold tracking-widest uppercase text-xs block mb-3">IP Protection Framework</span>
              <h2 className="font-display text-3xl font-bold text-forest-900 mb-6 leading-tight">
                Partner with total peace of mind.
              </h2>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex-shrink-0 flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest-900 mb-1">Standard Mutual NDA Policy</h4>
                    <p className="text-forest-600 text-sm leading-relaxed">
                      We require a fully signed Mutual Non-Disclosure Agreement before discussing any architectural details or integration pathways. Your data and our code remain strictly confidential.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-700 flex-shrink-0 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest-900 mb-1">Safe API Delivery</h4>
                    <p className="text-forest-600 text-sm leading-relaxed">
                      All calculations take place inside our secure, proprietary cloud servers. Partners query endpoints and receive formatted JSON payloads, meaning our database algorithms are never exposed or cloned.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex-shrink-0 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-forest-900 mb-1">Non-Exclusive Freedom</h4>
                    <p className="text-forest-600 text-sm leading-relaxed">
                      Our commercial agreements are structured on a non-exclusive basis, granting you complete liberty to work with multiple input networks, cooperatives, and county governments simultaneously.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-forest-900 rounded-3xl p-8 text-cream-100 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-display font-bold text-xl mb-2">Prefer direct B2B discussion?</h4>
                <p className="text-cream-400 text-sm mb-6">Skip the form and email our licensing team directly with your specifications.</p>
                <div className="space-y-3 mb-6">
                  <a href="mailto:info@shambaiq.com" className="flex items-center gap-3 text-sm text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                    <Mail size={16} /> info@shambaiq.com
                  </a>
                  <a href="https://wa.me/254748042633" className="flex items-center gap-3 text-sm text-green-400 hover:text-green-300 font-semibold transition-colors">
                    <MessageCircle size={16} /> +254 748 042 633
                  </a>
                </div>
              </div>
              <svg className="absolute top-0 right-0 opacity-10" width="180" height="180" viewBox="0 0 100 100">
                <path d="M0 100 Q50 0 100 100" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
