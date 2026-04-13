import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Personal Gifting",
  description: "Discover thoughtful personal gifts for every occasion — birthdays, anniversaries, festivals, and more. Personalized and premium.",
};

const occasions = [
  { icon: "🎂", label: "Birthday", slug: "birthday" },
  { icon: "💍", label: "Anniversary", slug: "anniversary" },
  { icon: "🪔", label: "Diwali", slug: "diwali" },
  { icon: "🎄", label: "Christmas", slug: "christmas" },
  { icon: "🎊", label: "New Year", slug: "new-year" },
  { icon: "🌈", label: "Holi", slug: "holi" },
  { icon: "🧡", label: "Raksha Bandhan", slug: "raksha-bandhan" },
  { icon: "💝", label: "Just Because", slug: "general" },
];

const collections = [
  { icon: "✨", title: "For Her", desc: "Luxury beauty, wellness, and personalized keepsakes for the women you love.", href: "/store?for=her" },
  { icon: "🎩", title: "For Him", desc: "Sophisticated grooming kits, premium accessories, and gourmet gifts.", href: "/store?for=him" },
  { icon: "👶", title: "For Kids", desc: "Fun, creative, and educational gifts that bring genuine joy to little ones.", href: "/store?for=kids" },
  { icon: "👴", title: "For Parents", desc: "Heartfelt gifts that show appreciation for the people who gave you everything.", href: "/store?for=parents" },
  { icon: "👫", title: "For Couples", desc: "Romantic and memorable gifts for special moments together.", href: "/store?for=couples" },
  { icon: "🤝", title: "For Friends", desc: "Fun, quirky, and thoughtful gifts to celebrate your best friendships.", href: "/store?for=friends" },
];

export default function PersonalGiftingPage() {
  const personalProducts = products.filter((p) =>
    ["personalized-gifts", "festival-gifts", "luxury-collections", "wellness-kits"].includes(p.category)
  );

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFE4C2] to-[#FFF9EE] py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFB449] opacity-20 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-white px-4 py-1.5 rounded-full mb-6">
            Personal Gifting
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-[#1A1A1A] leading-tight mb-4 max-w-3xl mx-auto">
            Every Person Deserves a{" "}
            <span className="text-gradient">Perfect Gift</span>
          </h1>
          <p className="text-[#6B6B6B] text-lg mb-8 max-w-xl mx-auto">
            Thoughtfully curated gifts for every person, every occasion, every emotion. Because your loved ones deserve the best.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/store" className="btn-primary flex items-center justify-center gap-2">
              Explore All Gifts <ArrowRight size={16} />
            </Link>
            <Link href="/custom-orders" className="btn-outline flex items-center justify-center gap-2">
              Customize a Gift
            </Link>
          </div>
        </div>
      </section>

      {/* Occasions */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="By Occasion"
            title="Gift by "
            highlight="Occasion"
            subtitle="Find the ideal gift matched to the moment that matters most."
          />

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                href={`/store?occasion=${o.slug}`}
                className="group flex flex-col items-center gap-2 text-center"
              >
                <div className="w-14 h-14 bg-[#FFF9EE] rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#FFE4C2] group-hover:scale-110 transition-all border-2 border-transparent group-hover:border-[#FFB449]">
                  {o.icon}
                </div>
                <span className="text-xs font-semibold text-[#1A1A1A] group-hover:text-[#FF8A00] transition-colors">
                  {o.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated collections */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Gift Collections"
            title="Gifts Curated "
            highlight="For Everyone"
            subtitle="Thoughtfully selected collections for every person in your life."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group bg-white rounded-3xl p-6 border-2 border-[#FFE4C2] hover:border-[#FFB449] hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-[#FFE4C2] rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                  {c.icon}
                </div>
                <h3 className="font-bold text-[#1A1A1A] text-base mb-2 group-hover:text-[#FF8A00] transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-3">{c.desc}</p>
                <span className="text-[#FF8A00] text-sm font-bold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Popular Picks"
            title="Most "
            highlight="Gifted"
            subtitle="Gifts that consistently bring joy and smiles to recipients."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {personalProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/store" className="btn-primary inline-flex items-center gap-2">
              View All Personal Gifts <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Personalization CTA */}
      <section className="bg-gradient-to-r from-[#FFE4C2] to-[#FFB449] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">
            Want Something Truly Unique?
          </h2>
          <p className="text-[#1A1A1A]/70 mb-6">
            Our custom order service lets you create completely personalized gifts — your design, your message, your way.
          </p>
          <Link href="/custom-orders" className="bg-[#1A1A1A] text-white font-bold py-3 px-8 rounded-full hover:bg-[#FF8A00] transition-colors inline-flex items-center gap-2">
            Create Custom Gift <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
