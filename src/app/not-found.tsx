import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-8xl font-bold text-cream-300 mb-4">
          404
        </div>
        <h1 className="font-display text-2xl font-bold text-forest-700 mb-3">
          Page not found
        </h1>
        <p className="text-soil-500 mb-8 max-w-md mx-auto">
          This soil plot doesn&apos;t exist. Try exploring our county reports or
          crop guides instead.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/soil"
            className="px-6 py-2.5 bg-forest-700 hover:bg-forest-600 text-white font-semibold rounded-xl transition-colors"
          >
            Soil reports
          </Link>
          <Link
            href="/crops"
            className="px-6 py-2.5 bg-cream-300 hover:bg-cream-400 text-forest-700 font-semibold rounded-xl transition-colors"
          >
            Crop guides
          </Link>
        </div>
      </div>
    </div>
  );
}
