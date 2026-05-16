"use client";

import { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shambaiq-backend-production.up.railway.app";

interface DiagnosisResult {
  condition: string;
  confidence: number;
  treatment: string;
  prevention: string;
}

export default function DoctorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setResult(null);
    setError("");
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Resize to max 800px width to keep base64 payload under Vercel's 4.5MB limit
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        // Compress to 70% quality jpeg
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
      // Call our Next.js API route powered by Gemini
      const res = await fetch(`/api/doctor/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: image.split(",")[1] }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        // Fallback: show user guidance
        setResult({
          condition: "Analysis Unavailable",
          confidence: 0,
          treatment:
            "The Plant Doctor AI is being calibrated. For now, visit your nearest agricultural extension office with a sample of the affected plant for diagnosis.",
          prevention:
            "Practice crop rotation, use certified seeds, maintain proper spacing, and scout your fields weekly for early signs of pest or disease pressure.",
        });
      }
    } catch {
      setResult({
        condition: "Offline Mode",
        confidence: 0,
        treatment:
          "Could not reach the ShambaIQ server. Check your internet connection and try again, or visit your county agricultural extension officer.",
        prevention:
          "Good practices: remove infected plants, avoid overhead irrigation, apply approved fungicides as prevention during the rainy season.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Hero */}
      <div className="bg-gradient-to-br from-red-700 to-red-800 text-center py-8 px-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Stethoscope size={28} className="text-white" />
          <h1 className="font-display text-2xl font-bold text-white">
            Plant Doctor
          </h1>
        </div>
        <p className="text-red-200 text-sm">
          AI Pest & Disease Diagnostics
        </p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-300">
          <p className="text-sm text-soil-400 mb-5">
            Snap a photo of a sick plant leaf or stem to get instant localized
            troubleshooting advice.
          </p>

          {!image ? (
            <div className="space-y-3">
              {/* Camera button */}
              <button
                onClick={() => cameraRef.current?.click()}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-3 text-lg"
              >
                <Camera size={24} />
                Open Camera
              </button>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />

              {/* Upload button */}
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-4 bg-cream-100 hover:bg-cream-200 text-forest-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-3 border border-cream-300"
              >
                <Upload size={20} />
                Upload from Gallery
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          ) : (
            <>
              {/* Preview */}
              <div className="relative rounded-xl overflow-hidden mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt="Plant sample"
                  className="w-full max-h-64 object-cover"
                />
                <button
                  onClick={() => {
                    setImage(null);
                    setResult(null);
                  }}
                  className="absolute top-2 right-2 px-3 py-1 bg-black/50 text-white text-xs rounded-lg"
                >
                  ✕ Remove
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-lg">
                  {fileName}
                </div>
              </div>

              <button
                onClick={analyze}
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>🔍 Analyze with AI</>
                )}
              </button>
            </>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="mt-5 space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500 border border-cream-300">
              <div className="flex items-start gap-3 mb-4">
                {result.confidence > 70 ? (
                  <AlertTriangle size={24} className="text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={24} className="text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-display text-lg font-bold text-forest-700">
                    {result.condition}
                  </h3>
                  {result.confidence > 0 && (
                    <span className="text-xs text-soil-400">
                      Confidence: {result.confidence.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-forest-700 mb-1">
                    🩺 Treatment
                  </h4>
                  <p className="text-soil-500 leading-relaxed">
                    {result.treatment}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-forest-700 mb-1">
                    🛡️ Prevention
                  </h4>
                  <p className="text-soil-500 leading-relaxed">
                    {result.prevention}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
