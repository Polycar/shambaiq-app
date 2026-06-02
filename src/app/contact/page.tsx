import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react";
import { BASE_URL } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact ShambaIQ — Get Farming Support & Partnership Enquiries",
  description: "Contact ShambaIQ via WhatsApp, email, or our form. Farming support, soil data, fertilizer advice — and open to agribusiness partnership enquiries.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact ShambaIQ",
    description: "Reach Kenya's precision soil intelligence platform. Get farming support or discuss partnership opportunities.",
    url: `${BASE_URL}/contact`,
    images: [{ url: `${BASE_URL}/api/og`, width: 1200, height: 630, alt: "Contact ShambaIQ" }],
  },
  twitter: { card: "summary_large_image", title: "Contact ShambaIQ", description: "Reach Kenya's precision soil intelligence platform for farming support or partnerships.", images: [`${BASE_URL}/api/og`] },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-forest-700 py-16 md:py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-6">
              How can we help your <span className="text-gold-400">Shamba?</span>
            </h1>
            <p className="text-cream-300 text-lg md:text-xl max-w-2xl mx-auto">
              Whether you are a farmer looking for advice or a partner interested in our technology, we are here to support you.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 -mt-10">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Cards */}
            <a 
              href="https://wa.me/254748042633" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200 hover:border-green-500 transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-bold text-xl text-forest-900 mb-2">WhatsApp Us</h3>
              <p className="text-forest-600 text-sm mb-4">Fastest way to get agronomic support.</p>
              <span className="text-green-600 font-semibold">+254 748 042 633</span>
            </a>

            <a 
              href="mailto:info@shambaiq.com"
              className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200 hover:border-gold-500 transition-all group"
            >
              <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center text-gold-700 mb-6 group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-xl text-forest-900 mb-2">Email Inquiries</h3>
              <p className="text-forest-600 text-sm mb-4">For partnerships and detailed reports.</p>
              <span className="text-gold-700 font-semibold">info@shambaiq.com</span>
            </a>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-cream-200">
              <div className="w-12 h-12 bg-forest-100 rounded-xl flex items-center justify-center text-forest-600 mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-xl text-forest-900 mb-2">Our Location</h3>
              <p className="text-forest-600 text-sm mb-4">Serving all 47 counties across Kenya.</p>
              <span className="text-forest-600 font-semibold italic">Nairobi, Kenya 🇰🇪</span>
            </div>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-16 items-start">
            {/* Contact Form */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-cream-100">
              <h2 className="text-2xl font-bold text-forest-900 mb-8">Send us a message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                      placeholder="e.g. John Kamau"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                      placeholder="07..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Subject</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all appearance-none">
                    <option>General Inquiry</option>
                    <option>Soil Report Help</option>
                    <option>Partnership Interest</option>
                    <option>Technical Issue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-2">Message</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-cream-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-200 outline-none transition-all resize-none"
                    placeholder="How can we help your farm today?"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-forest-200 flex items-center justify-center gap-2 group"
                >
                  Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>

            {/* Content Side */}
            <div className="space-y-12 pt-8">
              <div>
                <h3 className="text-gold-700 font-bold tracking-widest uppercase text-sm mb-4">Why Reach Out?</h3>
                <h2 className="text-3xl font-bold text-forest-900 mb-6 leading-tight">We are building the future of Kenyan Agriculture.</h2>
                <div className="space-y-6">
                  {[
                    { title: "Personalized Support", desc: "Our agronomists are available to help you interpret your precision soil data." },
                    { title: "Custom Solutions", desc: "For large-scale farms, we provide tailored mapping and integration services." },
                    { title: "Media & Inquiries", desc: "We love sharing our story and the impact we are making for Kenyan smallholders." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center text-xs font-bold mt-1">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-forest-900">{item.title}</h4>
                        <p className="text-forest-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-forest-900 rounded-3xl p-8 text-cream-100 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="font-bold text-xl mb-2">Need an answer now?</h4>
                  <p className="text-cream-400 text-sm mb-6">Our WhatsApp support is active 7 days a week.</p>
                  <a 
                    href="https://wa.me/254748042633" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all"
                  >
                    <MessageCircle size={20} /> Chat with us
                  </a>
                </div>
                {/* Decorative SVG */}
                <svg className="absolute top-0 right-0 opacity-10" width="200" height="200" viewBox="0 0 100 100">
                  <path d="M0 100 Q50 0 100 100" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
