"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Lang, t as translate, TranslationKey } from "@/lib/i18n";

interface LangContextValue {
  lang: Lang;
  toggle: () => void;
  t: (key: TranslationKey) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  toggle: () => {},
  t: (key) => translate(key, "en"),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const toggle = useCallback(() => {
    setLang((prev) => (prev === "en" ? "sw" : "en"));
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translate(key, lang),
    [lang]
  );

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
