"use client";

import { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

const COUNTIES = [
  "Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa",
  "Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi",
  "Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos",
  "Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a",
  "Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri",
  "Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans-Nzoia",
  "Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot",
];

const CROPS = [
  "Maize","Beans","Potato","Wheat","Sorghum","Millet","Tea",
  "Coffee (Arabica)","Coffee (Robusta)","Banana","Cassava","Sweet Potato","Groundnuts","Soybeans",
  "Sunflower","Onion","Tomato","Cabbage","Kale (Sukuma Wiki)","Carrot","Avocado",
  "Watermelon","Green Grams","Sugarcane","Capsicum","Chilies","Dhania",
  "Garlic","Cashew Nuts","Coconuts","Lucerne","Snow Peas","Arrow Root",
  "Passion Fruit","Pixie Oranges","Pawpaw","Wambugu Apples","Rice (Lowland/Paddy)",
  "Rice (Upland)","Finger Millet","Spinach","Carrot","Napier Grass","Mango",
  "Macadamia","Pigeon Peas","Cowpeas","Sisal","Pyrethrum","Cotton"
];

const CHALLENGES = [
  { value: "soil", label: "Soil fertility", icon: "🌱", desc: "My soil isn't producing well" },
  { value: "pests", label: "Pests & disease", icon: "🐛", desc: "Crop damage from insects or disease" },
  { value: "yield", label: "Low yield", icon: "📉", desc: "Not getting enough harvest" },
  { value: "money", label: "Input costs", icon: "💰", desc: "Fertilizer and seeds are too expensive" },
];

export default function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0); // 0=county, 1=crop, 2=challenge
  const [county, setCounty] = useState("");
  const [crop, setCrop] = useState("");
  const [challenge, setChallenge] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Don't show if already onboarded
    if (localStorage.getItem("shambaiq_onboarded")) return;
    // Don't show for logged-in users (they already have a profile)
    const match = document.cookie.split("; ").find(c => c.startsWith("shambaiq_session="));
    if (match) { setIsLoggedIn(true); return; }
    // Small delay so the page loads first
    const t = setTimeout(() => setShow(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    localStorage.setItem("shambaiq_onboarded", "1");
    setShow(false);
  };

  const next = () => {
    if (step === 0 && !county) return;
    if (step === 1 && !crop) return;
    setStep(s => s + 1);
  };

  const finish = () => {
    localStorage.setItem("shambaiq_onboarded", "1");
    localStorage.setItem("shambaiq_prefs", JSON.stringify({ county, crop, challenge }));
    setShow(false);
    // Navigate to /app — RecommendTool reads prefs from localStorage
    window.location.href = "/app";
  };

  if (!show || isLoggedIn) return null;

  const steps = ["Your location", "Your crop", "Your challenge"];

  return (
    <div className="fixed inset-0 z-[100] bg-forest-900/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.3s_ease]">
        {/* Header */}
        <div className="bg-gradient-to-br from-forest-800 to-forest-700 px-6 py-5 relative">
          <button onClick={dismiss} className="absolute top-4 right-4 text-cream-400 hover:text-cream-200 transition-colors">
            <X size={18} />
          </button>
          <p className="text-gold-300 text-xs font-semibold uppercase tracking-widest mb-1">
            Welcome to ShambaIQ
          </p>
          <h2 className="font-display text-xl font-bold text-cream-100 leading-tight">
            30 seconds to your<br />free farm plan
          </h2>
          {/* Step dots */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? "w-8 bg-gold-400" : i < step ? "w-4 bg-gold-600/60" : "w-4 bg-cream-400/30"
                }`}
              />
            ))}
            <span className="text-cream-400 text-xs ml-2">{step + 1} / 3</span>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Step 0 — County */}
          {step === 0 && (
            <div>
              <label className="block text-sm font-bold text-forest-700 mb-1">
                📍 What county is your farm in?
              </label>
              <p className="text-xs text-soil-400 mb-4">We'll look up your local soil data.</p>
              <select
                value={county}
                onChange={e => setCounty(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                <option value="">— Select your county —</option>
                {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Step 1 — Crop */}
          {step === 1 && (
            <div>
              <label className="block text-sm font-bold text-forest-700 mb-1">
                🌾 What are you growing this season?
              </label>
              <p className="text-xs text-soil-400 mb-4">We'll match fertilizer to your crop's requirements.</p>
              <select
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-300 rounded-xl text-forest-800 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                <option value="">— Select your crop —</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Step 2 — Challenge */}
          {step === 2 && (
            <div>
              <label className="block text-sm font-bold text-forest-700 mb-1">
                🎯 What's your main challenge right now?
              </label>
              <p className="text-xs text-soil-400 mb-4">Your plan will prioritize this.</p>
              <div className="grid grid-cols-2 gap-3">
                {CHALLENGES.map(ch => (
                  <button
                    key={ch.value}
                    onClick={() => setChallenge(ch.value)}
                    className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                      challenge === ch.value
                        ? "border-forest-600 bg-forest-50"
                        : "border-cream-300 hover:border-forest-400 hover:bg-cream-50"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{ch.icon}</span>
                    <p className="text-xs font-bold text-forest-700">{ch.label}</p>
                    <p className="text-[10px] text-soil-400 leading-tight mt-0.5">{ch.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 rounded-xl border border-cream-300 text-sm font-semibold text-soil-500 hover:bg-cream-50 transition-colors"
            >
              Back
            </button>
          )}
          {step < 2 ? (
            <button
              onClick={next}
              disabled={step === 0 ? !county : !crop}
              className="flex-[2] py-3 rounded-xl bg-forest-700 hover:bg-forest-600 disabled:opacity-40 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={finish}
              className="flex-[2] py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              Get My Free Farm Plan <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
