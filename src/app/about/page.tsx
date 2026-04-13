import type { Metadata } from "next";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { Heart, Award, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn the story behind Ohh My Happiness — India's most trusted corporate and personal gifting brand. Your requirement is our responsibility.",
};

const values = [
  { icon: "💛", title: "Joy in Every Gift", desc: "We pour heart and care into every gift we curate. Joy is not just our product — it's our purpose." },
  { icon: "🌟", title: "Premium Quality", desc: "From sourcing to packaging, we maintain the highest standards so every gift reflects excellence." },
  { icon: "🤝", title: "Your Partner", desc: "We don't just fulfill orders — we become your trusted gifting partner for every occasion." },
  { icon: "🎨", title: "Thoughtful Curation", desc: "Every collection is carefully designed to match emotions, occasions, and individual needs." },
];

const team = [
  { name: "Aisha Khan", role: "Founder & CEO", emoji: "👩‍💼", bio: "Passionate about spreading happiness through thoughtful gifting." },
  { name: "Rahul Verma", role: "Head of Curation", emoji: "👨‍🎨", bio: "Expert at finding and creating gifts that genuinely delight." },
  { name: "Sunita Sharma", role: "Corporate Relations", emoji: "👩‍💻", bio: "Building lasting partnerships with India's top companies." },
  { name: "Amit Patel", role: "Operations Lead", emoji: "👨‍🔧", bio: "Ensuring every order is delivered perfectly and on time." },
];

const milestones = [
  { year: "2019", event: "Founded in Mumbai with 50 products" },
  { year: "2020", event: "Reached 1,000 happy customers" },
  { year: "2021", event: "Launched corporate gifting division" },
  { year: "2022", event: "500+ corporate clients across India" },
  { year: "2023", event: "1 lakh gifts delivered nationwide" },
  { year: "2024", event: "Expanded to 6 gift categories" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#FFB449] to-[#FF8A00] py-20 lg:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/80 bg-white/20 px-4 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight mb-4">
            Ohh My Happiness
          </h1>
          <p className="text-white/90 text-xl font-semibold italic mb-4">
            "Your requirement is our responsibility."
          </p>
          <p className="text-white/80 text-base max-w-2xl mx-auto">
            Born from a simple belief — that every person deserves to feel genuinely celebrated — we've grown into India's most trusted gifting brand.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-[#FFE4C2] px-4 py-1.5 rounded-full mb-5">
                How It Started
              </span>
              <h2 className="text-3xl font-black text-[#1A1A1A] leading-tight mb-5">
                A Gift That Changed <span className="text-gradient">Everything</span>
              </h2>
              <div className="space-y-4 text-[#6B6B6B] text-sm leading-relaxed">
                <p>
                  Ohh My Happiness was born in 2019 when our founder, Aisha, struggled to find a gifting company that truly understood what she needed for her company's annual Diwali celebration. She wanted quality, customization, and care — but found only generic catalogs and impersonal service.
                </p>
                <p>
                  So she created what she couldn't find. Starting from her living room in Mumbai, she began curating premium, thoughtful gifts for friends and family. Word spread. Companies noticed. And Ohh My Happiness was born.
                </p>
                <p>
                  Today, we serve thousands of happy customers and 500+ corporate partners across India — all built on one promise:
                </p>
                <p className="font-black text-[#FF8A00] text-base italic">
                  "Your requirement is our responsibility."
                </p>
              </div>
            </div>

            {/* Visual stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Heart className="text-[#FFB449]" size={24} />, value: "10,000+", label: "Happy Customers" },
                { icon: <Award className="text-[#FFB449]" size={24} />, value: "500+", label: "Corporate Partners" },
                { icon: <Users className="text-[#FFB449]" size={24} />, value: "1L+", label: "Gifts Delivered" },
                { icon: <Star className="text-[#FFB449]" size={24} />, value: "4.9★", label: "Average Rating" },
              ].map(({ icon, value, label }) => (
                <div key={label} className="bg-[#FFF9EE] rounded-3xl p-6 text-center border border-[#FFE4C2]">
                  <div className="flex justify-center mb-2">{icon}</div>
                  <p className="text-2xl font-black text-[#1A1A1A]">{value}</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Values"
            title="What We "
            highlight="Stand For"
            subtitle="Every gift we create, every order we fulfill, is guided by these core principles."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-6 border border-[#FFE4C2] text-center hover:border-[#FFB449] hover:shadow-md transition-all">
                <div className="text-5xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#1A1A1A] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Our Journey"
            title="5 Years of "
            highlight="Spreading Happiness"
          />

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#FFE4C2]" />
            <div className="space-y-6">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex items-start gap-6 relative">
                  <div className="w-16 h-16 bg-[#FFB449] rounded-2xl flex items-center justify-center text-sm font-black text-white shrink-0 z-10">
                    {m.year}
                  </div>
                  <div className="flex-1 bg-[#FFF9EE] rounded-2xl p-4 border border-[#FFE4C2] mt-2">
                    <p className="text-sm text-[#1A1A1A] font-medium">{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Our Team"
            title="The People Behind "
            highlight="Every Gift"
            subtitle="A passionate team dedicated to making gifting effortless and joyful."
          />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-3xl p-6 text-center border border-[#FFE4C2] hover:border-[#FFB449] hover:shadow-md transition-all">
                <div className="text-6xl mb-4">{member.emoji}</div>
                <h3 className="font-bold text-[#1A1A1A] mb-1">{member.name}</h3>
                <p className="text-xs text-[#FF8A00] font-semibold mb-3">{member.role}</p>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#FFB449] to-[#FF8A00] py-14 px-4 text-center">
        <h2 className="text-3xl font-black text-white mb-3">Ready to Create Something Special?</h2>
        <p className="text-white/90 mb-6 italic">"Your requirement is our responsibility." — Let's work together.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/store" className="bg-white text-[#FF8A00] font-bold py-3 px-8 rounded-full hover:shadow-lg transition-all text-sm">
            Browse Gifts
          </Link>
          <Link href="/custom-orders" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white hover:text-[#FF8A00] transition-all text-sm">
            Get Custom Quote
          </Link>
        </div>
      </section>
    </>
  );
}
