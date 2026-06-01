"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const isNetworkError =
    error.message.includes("timed out") ||
    error.message.includes("could not reach") ||
    error.message.includes("server is experiencing");

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-5xl">{isNetworkError ? "📡" : "🌱"}</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          {isNetworkError ? "Connection problem" : "Something went wrong"}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          {error.message || "An unexpected error occurred. Your data is safe."}
        </p>
        <button
          onClick={reset}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
