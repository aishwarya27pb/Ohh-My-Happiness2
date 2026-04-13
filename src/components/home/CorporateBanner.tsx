import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function CorporateBanner() {
  const features = [
    "Minimum 10 units",
    "Custom branding & packaging",
    "Bulk discounts up to 35%",
    "Dedicated account manager",
    "Pan-India delivery",
    "GST invoice",
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB449] opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#FF8A00] opacity-10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FFB449] mb-4 bg-[#FFB449]/10 px-4 py-1.5 rounded-full">
              Corporate Gifting Solutions
            </span>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
              Gifting at Scale —{" "}
              <span className="text-[#FFB449]">Done Right</span>
            </h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              From 10 to 10,000 gifts — we handle bulk corporate orders with precision, quality, and customization that reflects your brand values. Your requirement is our responsibility.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#FFB449] shrink-0" />
                  <span className="text-sm text-white/80">{f}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/corporate-gifting"
                className="btn-primary flex items-center justify-center gap-2"
              >
                Explore Corporate Gifting <ArrowRight size={16} />
              </Link>
              <Link
                href="/custom-orders"
                className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#1A1A1A] text-center"
              >
                Request Bulk Quote
              </Link>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🏆", value: "500+", label: "Corporate Partners" },
              { icon: "📦", value: "1L+", label: "Gifts Delivered" },
              { icon: "⭐", value: "4.9/5", label: "Client Satisfaction" },
              { icon: "🚀", value: "48hrs", label: "Bulk Dispatch" },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:bg-white/10 transition-colors"
              >
                <div className="text-4xl mb-2">{icon}</div>
                <p className="text-2xl font-black text-[#FFB449]">{value}</p>
                <p className="text-xs text-white/60 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
