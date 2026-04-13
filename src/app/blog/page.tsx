import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/products";
import SectionHeader from "@/components/ui/SectionHeader";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog & Gift Guides",
  description: "Gifting tips, occasion guides, corporate gifting insights, and inspiration from the team at Ohh My Happiness.",
};

const blogCategories = ["All", "Corporate Gifting", "Festival Gifts", "Gift Guides"];

export default function BlogPage() {
  const featured = blogPosts.find((b) => b.isFeatured);
  const rest = blogPosts.filter((b) => !b.isFeatured);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-b from-[#FFE4C2] to-[#FFF9EE] py-16 px-4 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-white px-4 py-1.5 rounded-full mb-5">
          Blog & Gift Guides
        </span>
        <h1 className="text-4xl font-black text-[#1A1A1A] mb-3">
          Gifting <span className="text-gradient">Inspiration</span>
        </h1>
        <p className="text-[#6B6B6B] max-w-xl mx-auto">
          Tips, guides, and ideas to help you make every gift moment unforgettable.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          {blogCategories.map((c) => (
            <button
              key={c}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                c === "All"
                  ? "bg-[#FFB449] border-[#FFB449] text-[#1A1A1A]"
                  : "border-[#FFE4C2] text-[#6B6B6B] hover:border-[#FFB449] hover:text-[#FF8A00]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {featured && (
          <div className="mb-12">
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-5 gap-6 bg-white rounded-3xl overflow-hidden border border-[#FFE4C2] hover:border-[#FFB449] hover:shadow-xl transition-all">
              <div className="lg:col-span-3 bg-gradient-to-br from-[#FFE4C2] to-[#FFB449] aspect-video lg:aspect-auto flex items-center justify-center text-8xl min-h-52">
                📖
              </div>
              <div className="lg:col-span-2 p-6 flex flex-col justify-center">
                <span className="inline-block bg-[#FFB449] text-[#1A1A1A] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  Featured · {featured.category}
                </span>
                <h2 className="font-black text-xl text-[#1A1A1A] leading-tight mb-3 group-hover:text-[#FF8A00] transition-colors">
                  {featured.title}
                </h2>
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-[#6B6B6B] mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {featured.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {featured.readTime} min read
                  </span>
                </div>
                <span className="text-[#FF8A00] font-bold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read Article <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* Article Grid */}
        <SectionHeader
          eyebrow="Latest Articles"
          title="More Gift "
          highlight="Guides"
          centered={false}
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-3xl overflow-hidden border border-[#FFE4C2] hover:border-[#FFB449] hover:shadow-lg transition-all"
            >
              <div className="bg-gradient-to-br from-[#FFF9EE] to-[#FFE4C2] aspect-video flex items-center justify-center text-6xl">
                {post.category === "Corporate Gifting" ? "🏆" : post.category === "Festival Gifts" ? "🪔" : "✨"}
              </div>
              <div className="p-5">
                <span className="inline-block bg-[#FFE4C2] text-[#FF8A00] text-xs font-bold px-3 py-1 rounded-full mb-3">
                  {post.category}
                </span>
                <h3 className="font-bold text-[#1A1A1A] mb-2 leading-tight group-hover:text-[#FF8A00] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-[#6B6B6B]">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> {post.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {post.readTime} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-16 bg-gradient-to-r from-[#FFB449] to-[#FF8A00] rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-black text-white mb-2">Get Gift Ideas in Your Inbox</h3>
          <p className="text-white/90 text-sm mb-6">
            Subscribe to our newsletter for gifting tips, seasonal guides, and exclusive offers.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-full text-sm focus:outline-none min-w-0"
            />
            <button className="bg-white text-[#FF8A00] font-bold px-6 py-3 rounded-full text-sm hover:bg-[#FFF9EE] transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
