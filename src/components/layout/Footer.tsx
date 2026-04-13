import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#FFB449] to-[#FF8A00] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
            Ready to Make Someone Happy?
          </h2>
          <p className="text-white/90 mb-6 text-sm md:text-base">
            "Your requirement is our responsibility." — Let us handle every gifting need.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/store" className="bg-white text-[#FF8A00] font-bold py-3 px-8 rounded-full hover:bg-[#FFF9EE] transition-colors text-sm">
              Shop Now
            </Link>
            <Link href="/custom-orders" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-[#FF8A00] transition-colors text-sm">
              Get Bulk Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-[#FFB449]/40 transition-all">
                <Image
                  src="/logo.jpg"
                  alt="Ohh My Happiness"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover"
                />
              </div>
              <div>
                <p className="font-black text-[#FFB449] leading-tight text-base" style={{ fontFamily: "var(--font-playfair), serif" }}>Ohh My Happiness</p>
                <p className="text-xs text-white/40 italic">Your requirement is our responsibility.</p>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              India's most trusted gifting brand. Bringing joy, warmth, and smiles through thoughtfully curated gifts for every occasion.
            </p>
            <div className="flex gap-3">
              {["IG", "FB", "TW", "YT"].map((s, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#FFB449] hover:text-[#1A1A1A] transition-all text-xs font-bold">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {[
                ["Home", "/"],
                ["Corporate Gifting", "/corporate-gifting"],
                ["Personal Gifting", "/personal-gifting"],
                ["Store", "/store"],
                ["Custom Orders", "/custom-orders"],
                ["About Us", "/about"],
                ["Blog", "/blog"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-[#FFB449] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Gift Categories</h4>
            <ul className="space-y-3">
              {[
                ["Corporate Hampers", "/store?category=corporate-hampers"],
                ["Festival Gifts", "/store?category=festival-gifts"],
                ["Personalized Gifts", "/store?category=personalized-gifts"],
                ["Luxury Collections", "/store?category=luxury-collections"],
                ["Wellness Kits", "/store?category=wellness-kits"],
                ["Onboarding Kits", "/store?category=onboarding-kits"],
                ["Bestsellers", "/store?filter=bestseller"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-[#FFB449] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#FFB449] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-white/70">+91 99999 99999</p>
                  <p className="text-xs text-white/40">Mon–Sat, 9am–7pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#FFB449] mt-0.5 shrink-0" />
                <a href="mailto:hello@ohhmyhappiness.com" className="text-sm text-white/70 hover:text-[#FFB449]">
                  hello@ohhmyhappiness.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#FFB449] mt-0.5 shrink-0" />
                <p className="text-sm text-white/70">
                  Mumbai, Maharashtra<br />India — 400001
                </p>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-white/50 mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 rounded-full px-3 py-2 text-xs text-white placeholder-white/30 outline-none focus:bg-white/20 min-w-0"
                />
                <button className="bg-[#FFB449] text-[#1A1A1A] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#FF8A00] hover:text-white transition-colors shrink-0">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Ohh My Happiness. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Refund Policy", "/refund"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-xs text-white/40 hover:text-[#FFB449]">
                {label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {["visa", "mastercard", "upi", "razorpay"].map((p) => (
              <div key={p} className="bg-white/10 rounded px-2 py-1 text-xs text-white/40 uppercase tracking-wide">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
