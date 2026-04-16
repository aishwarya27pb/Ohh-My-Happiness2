import type { Metadata } from "next";
import Link from "next/link";
import { corporatePackages, products, testimonials } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { CheckCircle, ArrowRight, Phone, Mail, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Corporate Gifting Solutions",
  description:
    "Premium bulk corporate gifting solutions with custom branding. Onboarding kits, festival hampers, and branded merchandise for 10 to 10,000+ employees.",
};

const solutions = [
  { icon: "🤝", title: "Onboarding Kits", desc: "Make every new hire feel valued from day one with premium branded welcome kits." },
  { icon: "🎁", title: "Festival Hampers", desc: "Celebrate Diwali, Holi, Christmas & more with premium festive gift hampers." },
  { icon: "🏆", title: "Client Gifting", desc: "Strengthen relationships with premium gifts that reflect your brand's values." },
  { icon: "🎓", title: "Milestone Gifts", desc: "Work anniversaries, promotions, retirements — mark every milestone." },
  { icon: "📦", title: "Branded Merchandise", desc: "Custom-branded merchandise sets with your logo on premium products." },
  { icon: "🌿", title: "Wellness Gifts", desc: "Employee wellness kits to show care for your team's health & wellbeing." },
];

const process = [
  { step: "01", title: "Share Requirements", desc: "Tell us your budget, quantity, branding needs, and delivery timeline." },
  { step: "02", title: "Get a Quote", desc: "Receive a detailed quote with options and bulk pricing within 24 hours." },
  { step: "03", title: "Approve & Customize", desc: "Finalize design, approve samples, and confirm your order details." },
  { step: "04", title: "We Deliver", desc: "Pan-India delivery with tracking. Bulk orders dispatched within 48 hours." },
];

export default function CorporateGiftingPage() {
  const corporateProducts = products.filter((p) => p.category === "corporate-hampers" || p.category === "onboarding-kits");

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB449] rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF8A00] rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FFB449] bg-[#FFB449]/10 px-4 py-1.5 rounded-full mb-6">
                Corporate Gifting Solutions
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
                Gifting at Scale,{" "}
                <span className="text-[#FFB449]">Done Right</span>
              </h1>
              <p className="text-white/70 text-lg mb-3 leading-relaxed">
                From 10 to 10,000 — we handle every corporate gifting need with precision, quality, and your brand identity front and center.
              </p>
              <p className="text-[#FFB449] italic font-semibold mb-8">
                "Your requirement is our responsibility."
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/custom-orders" className="btn-primary flex items-center justify-center gap-2">
                  Request Bulk Quote <ArrowRight size={16} />
                </Link>
                <a href="tel:+919999999999" className="btn-outline border-white/30 text-white hover:bg-white hover:text-[#1A1A1A] flex items-center justify-center gap-2">
                  <Phone size={16} /> Call Us Now
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🏆", value: "500+", label: "Corporate Partners" },
                { icon: "📦", value: "1L+", label: "Gifts Delivered" },
                { icon: "⭐", value: "4.9/5", label: "Satisfaction Rate" },
                { icon: "🚀", value: "48hrs", label: "Bulk Dispatch" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center">
                  <div className="text-4xl mb-2">{icon}</div>
                  <p className="text-2xl font-black text-[#FFB449]">{value}</p>
                  <p className="text-xs text-white/60 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Solutions"
            title="Corporate Gifting for "
            highlight="Every Occasion"
            subtitle="From onboarding to festivals, milestones to appreciation — we have a gift for every moment that matters."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s) => (
              <div key={s.title} className="bg-white rounded-3xl p-6 border border-[#FFE4C2] hover:border-[#FFB449] hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-base mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Pricing"
            title="Choose Your "
            highlight="Package"
            subtitle="Transparent pricing with amazing value. Bigger orders mean better savings."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {corporatePackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-8 border-2 transition-all ${
                  pkg.popular
                    ? "border-[#FFB449] bg-gradient-to-b from-[#FFB449]/5 to-white shadow-xl"
                    : "border-[#FFE4C2] bg-white hover:border-[#FFB449]"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-[#FFB449] text-[#1A1A1A] text-xs font-black px-5 py-1.5 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="font-black text-xl text-[#1A1A1A] mb-1">{pkg.name}</h3>
                <p className="text-sm text-[#6B6B6B] mb-5">{pkg.description}</p>

                <div className="mb-5">
                  <span className="text-3xl font-black text-[#FF8A00]">₹{pkg.pricePerUnit}</span>
                  <span className="text-sm text-[#6B6B6B]">/unit</span>
                  <p className="text-xs text-[#6B6B6B] mt-1">Minimum {pkg.minQuantity} units</p>
                </div>

                <ul className="space-y-2.5 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={15} className="text-[#FFB449] shrink-0" />
                      <span className="text-[#1A1A1A]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/custom-orders"
                  className={`w-full text-center block py-3 rounded-full font-bold text-sm transition-all ${
                    pkg.popular
                      ? "bg-[#FFB449] text-[#1A1A1A] hover:bg-[#FF8A00] hover:text-white"
                      : "border-2 border-[#FFB449] text-[#FF8A00] hover:bg-[#FFB449] hover:text-[#1A1A1A]"
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Products"
            title="Popular Corporate "
            highlight="Gift Sets"
            subtitle="Trusted by 500+ companies across India."
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {corporateProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Process"
            title="How We Handle "
            highlight="Bulk Orders"
            subtitle="Simple, transparent, and always on time."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((s, i) => (
              <div key={s.step} className="text-center p-6">
                <div className="w-16 h-16 bg-[#FFB449] rounded-2xl flex items-center justify-center text-2xl font-black text-white mx-auto mb-4">
                  {s.step}
                </div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies / Testimonials */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Client Stories"
            title="Why Companies "
            highlight="Choose Us"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.filter(t => t.company !== "Personal Client").slice(0, 3).map((t) => (
              <div key={t.id} className="bg-white rounded-3xl p-6 border border-[#FFE4C2] shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} className="fill-[#FFB449] text-[#FFB449]" />)}
                </div>
                <p className="text-sm text-[#1A1A1A] leading-relaxed mb-4">"{t.content}"</p>
                <div>
                  <p className="font-bold text-sm text-[#1A1A1A]">{t.name}</p>
                  <p className="text-xs text-[#FF8A00]">{t.role}, {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#FFB449] to-[#FF8A00] py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Get Started?</h2>
          <p className="text-white/90 mb-6">Share your requirements and get a customized quote within 24 hours.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/custom-orders" className="bg-white text-[#FF8A00] font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all text-sm">
              Request Bulk Quote
            </Link>
            <a href="mailto:hello@ohhmyhappiness.com" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-[#FF8A00] transition-all text-sm flex items-center justify-center gap-2">
              <Mail size={16} /> Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
