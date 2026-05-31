"use client";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "shambaiq_pwa_dismissed";

export default function PWAInstaller() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Don't show if already dismissed or installed
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    setPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install ShambaIQ"
      className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:w-80 bg-forest-700 text-white rounded-2xl shadow-2xl px-4 py-3.5 flex items-center gap-3 animate-slide-up"
    >
      <img src="/icon-192.png" alt="ShambaIQ" className="w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight">Install ShambaIQ</p>
        <p className="text-xs text-green-200 leading-tight mt-0.5">Add to home screen. Works offline.</p>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={install}
          className="bg-white text-forest-700 text-xs font-bold px-3 py-1.5 rounded-lg"
        >
          Install
        </button>
        <button
          onClick={dismiss}
          className="text-green-300 text-xs px-3 py-1 rounded-lg"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
