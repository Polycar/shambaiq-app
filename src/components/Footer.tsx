import Link from "next/link";
import { Satellite, Mail, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-forest-800 text-cream-400 mt-auto relative grain">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <h3 className="font-display text-cream-100 font-bold text-xl mb-4 hover:text-gold-400 transition-colors inline-block">
                Shamba<span className="text-gold-400">IQ</span>
              </h3>
            </Link>
            <p className="text-sm text-cream-500 leading-relaxed mb-4">
              Precision agriculture for every Kenyan farmer. 47 counties, over 40 crops, satellite soil data.
            </p>
            <div className="flex items-center gap-2 text-xs text-cream-500">
              <Satellite size={12} />
              <span>Powered by satellite soil data</span>
            </div>
          </div>

          {/* Soil Reports */}
          <div>
            <h4 className="font-semibold text-cream-200 mb-4 text-sm uppercase tracking-wider">Soil Reports</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/soil/nakuru" className="hover:text-gold-400 transition-colors">Nakuru</Link></li>
              <li><Link href="/soil/kiambu" className="hover:text-gold-400 transition-colors">Kiambu</Link></li>
              <li><Link href="/soil/kakamega" className="hover:text-gold-400 transition-colors">Kakamega</Link></li>
              <li><Link href="/soil/uasin-gishu" className="hover:text-gold-400 transition-colors">Uasin Gishu</Link></li>
              <li><Link href="/soil" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">All 47 Counties →</Link></li>
            </ul>
          </div>

          {/* Crops & Zones */}
          <div>
            <h4 className="font-semibold text-cream-200 mb-4 text-sm uppercase tracking-wider">Crops &amp; Zones</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/crops/maize" className="hover:text-gold-400 transition-colors">Maize Guide</Link></li>
              <li><Link href="/crops/beans" className="hover:text-gold-400 transition-colors">Beans Guide</Link></li>
              <li><Link href="/crops" className="hover:text-gold-400 transition-colors">All 40+ Crops</Link></li>
              <li><Link href="/zones" className="hover:text-gold-400 transition-colors">Agroecological Zones</Link></li>
              <li><Link href="/dealers" className="hover:text-gold-400 transition-colors">Agrovet Directory</Link></li>
              <li><Link href="/dealers/apply" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Become a Dealer →</Link></li>
              <li><Link href="/dealer/login" className="hover:text-gold-400 transition-colors">Dealer Login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-cream-200 mb-4 text-sm uppercase tracking-wider">Support &amp; Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="mailto:info@shambaiq.com" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <Mail size={13} aria-hidden="true" /> info@shambaiq.com
                </a>
              </li>
              <li>
                <a href="https://wa.me/254748042633" target="_blank" rel="noopener noreferrer" className="hover:text-gold-400 transition-colors flex items-center gap-2">
                  <MessageCircle size={13} aria-hidden="true" /> +254 748 042 633
                </a>
              </li>
              <li><Link href="/blog" className="hover:text-gold-400 transition-colors">ShambaIQ Blog</Link></li>
              <li><Link href="/agronomy" className="hover:text-gold-400 transition-colors">Ask AI Agronomist</Link></li>
              <li><Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/partners" className="hover:text-gold-400 transition-colors">Partnership &amp; Licensing</Link></li>
              <li><Link href="/impact" className="hover:text-gold-400 transition-colors">Our Impact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-forest-600 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream-500">
            © {new Date().getFullYear()} ShambaIQ. Soil data powered by 30m precision satellite mapping.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-cream-500 hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-cream-500 hover:text-gold-400 transition-colors">Terms of Service</Link>
            <p className="text-xs text-cream-500">Built for Kenyan farmers 🇰🇪</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
