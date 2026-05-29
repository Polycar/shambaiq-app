"use client";

import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Clock,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://api.shambaiq.com";

interface Product {
  name: string;
  price_kes: string;
}

interface DiagnosisResult {
  condition: string;
  confidence: number;
  severity?: string;
  treatment_steps?: string[];
  products?: Product[];
  prevention?: string;
  notes?: string;
  // legacy
  treatment?: string;
}

interface HistoryRecord {
  id: string;
  condition: string;
  confidence: number;
  county: string | null;
  crop: string | null;
  created_at: string | null;
  treatment?: string;
  prevention?: string;
}

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match.split("=").slice(1).join("="))); }
  catch { return null; }
}

function SeverityBadge({ severity }: { severity?: string }) {
  if (!severity) return null;
  const colors: Record<string, string> = {
    Low: "bg-green-100 text-green-700 border-green-300",
    Moderate: "bg-amber-100 text-amber-700 border-amber-300",
    High: "bg-orange-100 text-orange-700 border-orange-300",
    Critical: "bg-red-100 text-red-700 border-red-300",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${colors[severity] ?? "bg-cream-100 text-soil-500 border-cream-300"}`}>
      {severity}
    </span>
  );
}

export default function DoctorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [crop, setCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const session = getCookie("shambaiq_session") as { token?: string } | null;
        const token = session?.token;
        if (!token) return;
        const res = await fetch(`${BACKEND}/api/v1/diagnosis/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch {
        // silently skip
      } finally {
        setHistoryLoading(false);
      }
    }
    loadHistory();
  }, []);

  const handleFile = (file: File) => {
    setResult(null);
    setError("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let { width, height } = img;
        if (width > MAX_WIDTH) { height = height * (MAX_WIDTH / width); width = MAX_WIDTH; }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        setImage(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/doctor/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image.split(",")[1], crop: crop.trim() || undefined }),
      });

      if (res.ok) {
        const data: DiagnosisResult = await res.json();
        setResult(data);
        setHistory((prev) => [
          {
            id: Date.now().toString(),
            condition: data.condition,
            confidence: data.confidence,
            county: null,
            crop: crop.trim() || null,
            created_at: new Date().toISOString(),
            treatment: data.treatment_steps?.join(" ") || data.treatment,
            prevention: data.prevention,
          },
          ...prev,
        ]);
      } else {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        setError(errData.error || `Error ${res.status} — please try again.`);
      }
    } catch {
      setError("Network error — could not reach the API.");
    } finally {
      setLoading(false);
    }
  };

  const isHealthy = result?.condition?.toLowerCase() === "healthy";

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-700 to-red-800 text-center py-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Stethoscope size={28} className="text-white" />
          <h1 className="font-display text-2xl font-bold text-white">Plant Doctor</h1>
        </div>
        <p className="text-red-200 text-sm">AI Pest & Disease Diagnostics</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: upload ── */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300">
              <p className="text-sm text-soil-400 mb-5">
                Take a photo of a sick leaf or stem. The AI identifies the disease and gives you exact treatment steps with product names and dosages.
              </p>

              {!image ? (
                <div className="space-y-3">
                  <button
                    onClick={() => cameraRef.current?.click()}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
                  >
                    <Camera size={24} /> Open Camera
                  </button>
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="w-full py-4 bg-cream-100 hover:bg-cream-200 text-forest-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-3 border border-cream-300"
                  >
                    <Upload size={20} /> Upload from Gallery
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Plant sample" className="w-full max-h-64 object-cover" />
                    <button
                      onClick={() => { setImage(null); setResult(null); setFileName(""); }}
                      className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white text-xs rounded-lg"
                    >
                      ✕ Remove
                    </button>
                    {fileName && (
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                        {fileName}
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Crop name (optional — e.g. Maize)"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-4 py-2.5 border border-cream-300 rounded-xl text-sm text-forest-700 placeholder-soil-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                  />

                  <button
                    onClick={analyze}
                    disabled={loading}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
                      : <>🔍 Analyze with AI</>}
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>

          {/* ── Right: result + history ── */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {result && (
              <div className={`bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden border-l-4 ${isHealthy ? "border-l-green-500" : "border-l-red-500"}`}>
                {/* Condition header */}
                <div className="px-6 pt-5 pb-4 border-b border-cream-100">
                  <div className="flex items-start gap-3">
                    {isHealthy
                      ? <CheckCircle2 size={22} className="text-green-500 shrink-0 mt-0.5" />
                      : <AlertTriangle size={22} className="text-red-500 shrink-0 mt-0.5" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-bold text-forest-700 leading-tight">{result.condition}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {result.confidence > 0 && (
                          <span className="text-xs text-soil-400">{result.confidence.toFixed(0)}% confidence</span>
                        )}
                        <SeverityBadge severity={result.severity} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 space-y-5 text-sm">
                  {/* Treatment steps */}
                  {result.treatment_steps && result.treatment_steps.length > 0 && (
                    <div>
                      <h4 className="font-bold text-forest-700 mb-2">🩺 Treatment</h4>
                      <ol className="space-y-2">
                        {result.treatment_steps.map((step, i) => (
                          <li key={i} className="flex gap-2.5 text-soil-600 leading-relaxed">
                            <span className="shrink-0 w-5 h-5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                            <span>{step.replace(/^Step \d+:\s*/i, "")}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Legacy single-string treatment fallback */}
                  {!result.treatment_steps && result.treatment && (
                    <div>
                      <h4 className="font-bold text-forest-700 mb-1">🩺 Treatment</h4>
                      <p className="text-soil-500 leading-relaxed">{result.treatment}</p>
                    </div>
                  )}

                  {/* Products */}
                  {result.products && result.products.length > 0 && (
                    <div>
                      <h4 className="font-bold text-forest-700 mb-2 flex items-center gap-1.5">
                        <ShoppingBag size={14} /> Where to buy
                      </h4>
                      <div className="space-y-1.5">
                        {result.products.map((p, i) => (
                          <div key={i} className="flex items-center justify-between bg-cream-50 border border-cream-200 rounded-xl px-3 py-2">
                            <span className="text-forest-700 font-medium text-xs">{p.name}</span>
                            <span className="text-gold-700 font-bold text-xs">{p.price_kes}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prevention */}
                  {result.prevention && (
                    <div>
                      <h4 className="font-bold text-forest-700 mb-1">🛡️ Prevention</h4>
                      <p className="text-soil-500 leading-relaxed">{result.prevention}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {result.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <p className="text-amber-800 text-xs leading-relaxed">⚠️ {result.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Past diagnoses */}
            {(history.length > 0 || historyLoading) && (
              <div className="bg-white rounded-2xl shadow-sm border border-cream-300 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-cream-200">
                  <Clock size={16} className="text-soil-400" />
                  <h2 className="font-display font-bold text-forest-700 text-sm">Past Diagnoses</h2>
                </div>

                {historyLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 size={20} className="animate-spin text-soil-300" />
                  </div>
                ) : (
                  <ul className="divide-y divide-cream-200">
                    {history.map((rec) => {
                      const isOpen = expandedId === rec.id;
                      const date = rec.created_at
                        ? new Date(rec.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })
                        : "";
                      return (
                        <li key={rec.id}>
                          <button
                            onClick={() => setExpandedId(isOpen ? null : rec.id)}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cream-50 transition-colors"
                          >
                            <div>
                              <p className="text-sm font-semibold text-forest-700 leading-tight">{rec.condition}</p>
                              <p className="text-xs text-soil-400 mt-0.5">
                                {[rec.crop, rec.county ? `${rec.county} County` : null, date].filter(Boolean).join(" · ")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-3">
                              {rec.confidence != null && (
                                <span className="text-xs text-soil-400">{rec.confidence.toFixed(0)}%</span>
                              )}
                              {isOpen ? <ChevronUp size={14} className="text-soil-400" /> : <ChevronDown size={14} className="text-soil-400" />}
                            </div>
                          </button>
                          {isOpen && (
                            <div className="px-5 pb-4 text-sm space-y-3 bg-cream-50">
                              {rec.treatment && (
                                <div>
                                  <p className="font-semibold text-forest-700 mb-0.5">🩺 Treatment</p>
                                  <p className="text-soil-500 leading-relaxed">{rec.treatment}</p>
                                </div>
                              )}
                              {rec.prevention && (
                                <div>
                                  <p className="font-semibold text-forest-700 mb-0.5">🛡️ Prevention</p>
                                  <p className="text-soil-500 leading-relaxed">{rec.prevention}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
