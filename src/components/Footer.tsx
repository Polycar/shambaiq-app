import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-cream-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/">
              <h3 className="font-display text-cream-100 font-bold text-lg mb-4 hover:text-gold-400 transition-colors inline-block">ShambaIQ</h3>
            </Link>
            <p className="text-sm text-cream-500 leading-relaxed">
              Precision agriculture for every Kenyan farmer. 47 counties, 25 crops, satellite soil data.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-cream-200 mb-3 text-sm uppercase tracking-wider">Soil Reports</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/soil/nakuru" className="hover:text-gold-400 transition-colors">Nakuru</Link></li>
              <li><Link href="/soil/kiambu" className="hover:text-gold-400 transition-colors">Kiambu</Link></li>
              <li><Link href="/soil/kakamega" className="hover:text-gold-400 transition-colors">Kakamega</Link></li>
              <li><Link href="/soil/uasin-gishu" className="hover:text-gold-400 transition-colors">Uasin Gishu</Link></li>
              <li><Link href="/soil" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">All 47 Counties →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cream-200 mb-3 text-sm uppercase tracking-wider">Crops &amp; Zones</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/crops/maize" className="hover:text-gold-400 transition-colors">Maize Guide</Link></li>
              <li><Link href="/crops/beans" className="hover:text-gold-400 transition-colors">Beans Guide</Link></li>
              <li><Link href="/crops" className="hover:text-gold-400 transition-colors">All 25 Crops</Link></li>
              <li><Link href="/zones" className="hover:text-gold-400 transition-colors text-gold-400 font-medium">Agroecological Zones</Link></li>
              <li><Link href="/dealers" className="hover:text-gold-400 transition-colors">Agrovet Directory</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cream-200 mb-3 text-sm uppercase tracking-wider">Support &amp; Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@shambaiq.com" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span>✉️</span> info@shambaiq.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/254748042633" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <span>💬</span> +254 748 042 633
                </a>
              </li>
              <li><Link href="/blog" className="hover:text-gold-400 transition-colors">ShambaIQ Blog</Link></li>
              <li><Link href="/agronomy" className="hover:text-gold-400 transition-colors">Ask AI Agronomist</Link></li>
              <li><Link href="/admin" className="hover:text-gold-400 transition-colors opacity-60">Admin Portal</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-gold-400 transition-colors opacity-60">Sitemap (XML)</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-forest-600 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-500">
            © {new Date().getFullYear()} ShambaIQ. Soil data powered by iSDAsoil &amp; ISRIC SoilGrids.
          </p>
          <p className="text-xs text-cream-500">
            Built for Kenyan farmers 🇰🇪
          </p>
        </div>
      </div>
    </footer>
  );
}
