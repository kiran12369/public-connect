"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LanguageGate({ children }: { children: React.ReactNode }) {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleSelect = (lang: "en" | "te" | "ur") => {
    setLanguage(lang);
    router.push("/login");
  };

  if (!language) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Choose your language</h1>
          <p className="text-gray-600 text-sm">
            Please select a language to continue. You can change this later in settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-xl">
          <button
            onClick={() => handleSelect("te")}
            className="p-4 rounded-2xl border border-purple-200 bg-purple-50 hover:bg-purple-100 transition text-center"
          >
            <div className="text-lg font-semibold">తెలుగు</div>
            <div className="text-xs text-gray-600 mt-1">Telugu</div>
          </button>

          <button
            onClick={() => handleSelect("en")}
            className="p-4 rounded-2xl border border-blue-200 bg-blue-50 hover:bg-blue-100 transition text-center"
          >
            <div className="text-lg font-semibold">English</div>
          </button>

          <button
            onClick={() => handleSelect("ur")}
            className="p-4 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition text-center"
          >
            <div className="text-lg font-semibold">اُردُو</div>
            <div className="text-xs text-gray-600 mt-1">Urdu</div>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

