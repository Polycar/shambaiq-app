import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-cream-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display text-cream-100 font-bold text-lg mb-4">ShambaIQ</h3>
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
              <li><Link href="/soil" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">All 47 →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cream-200 mb-3 text-sm uppercase tracking-wider">Crop Guides</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/crops/maize" className="hover:text-gold-400 transition-colors">Maize</Link></li>
              <li><Link href="/crops/beans" className="hover:text-gold-400 transition-colors">Beans</Link></li>
              <li><Link href="/crops/potatoes" className="hover:text-gold-400 transition-colors">Potatoes</Link></li>
              <li><Link href="/crops/tea" className="hover:text-gold-400 transition-colors">Tea</Link></li>
              <li><Link href="/crops" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">All 25 →</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cream-200 mb-3 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/zones" className="hover:text-gold-400 transition-colors">Agroecological Zones</Link></li>
              <li><Link href="/dealers" className="hover:text-gold-400 transition-colors">Agrovet Directory</Link></li>
              <li><Link href="/blog" className="hover:text-gold-400 transition-colors">Blog</Link></li>
              <li><Link href="/app" className="hover:text-gold-400 transition-colors">Get Advice</Link></li>
              <li><Link href="/admin" className="hover:text-gold-400 transition-colors">Admin Login</Link></li>
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
