import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts } from "@/data/products";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((b) => b.slug === slug);
  if (!post) notFound();

  const related = blogPosts.filter((b) => b.category === post.category && b.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#FF8A00] font-bold mb-8 hover:underline">
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-block bg-[#FFE4C2] text-[#FF8A00] text-xs font-bold px-3 py-1 rounded-full mb-4">
          {post.category}
        </span>
        <h1 className="text-3xl lg:text-4xl font-black text-[#1A1A1A] leading-tight mb-4">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B6B6B]">
          <span>By {post.author}</span>
          <span className="flex items-center gap-1"><Calendar size={14} /> {post.publishedAt}</span>
          <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime} min read</span>
        </div>
      </div>

      {/* Hero image */}
      <div className="aspect-video bg-gradient-to-br from-[#FFE4C2] to-[#FFB449] rounded-3xl flex items-center justify-center text-9xl mb-10">
        🎁
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none text-[#1A1A1A]">
        <p className="text-lg text-[#6B6B6B] leading-relaxed mb-6">{post.excerpt}</p>

        <h2 className="text-2xl font-black text-[#1A1A1A] mt-8 mb-4">Why This Matters</h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-4">
          At Ohh My Happiness, we believe that every gift tells a story. Whether you're celebrating a personal milestone or strengthening professional relationships, the right gift can make all the difference. Our team has curated insights from thousands of gifting experiences to bring you the most actionable advice.
        </p>

        <h2 className="text-2xl font-black text-[#1A1A1A] mt-8 mb-4">Key Takeaways</h2>
        <ul className="space-y-3 mb-6">
          {[
            "Think about the recipient's personality and preferences",
            "Consider the occasion and the message you want to convey",
            "Quality always wins over quantity",
            "Personalization makes any gift 10x more memorable",
            "Presentation is half the experience",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-[#6B6B6B]">
              <span className="text-[#FFB449] mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="bg-[#FFE4C2] rounded-3xl p-6 my-8 border-l-4 border-[#FFB449]">
          <p className="font-black text-[#1A1A1A] text-lg italic">
            "Your requirement is our responsibility." — At Ohh My Happiness, we make every gifting experience effortless and memorable.
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#FFE4C2]">
        <span className="flex items-center gap-1 text-sm text-[#6B6B6B]"><Tag size={14} /> Tags:</span>
        {post.tags.map((tag) => (
          <span key={tag} className="bg-[#FFF9EE] border border-[#FFE4C2] text-xs text-[#6B6B6B] px-3 py-1 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 bg-gradient-to-r from-[#FFB449] to-[#FF8A00] rounded-3xl p-8 text-center">
        <h3 className="text-2xl font-black text-white mb-2">Ready to Gift with Confidence?</h3>
        <p className="text-white/90 text-sm mb-5">Browse our curated collections and find the perfect gift today.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/store" className="bg-white text-[#FF8A00] font-bold py-3 px-8 rounded-full text-sm hover:shadow-lg">Browse Store</Link>
          <Link href="/custom-orders" className="border-2 border-white text-white font-bold py-3 px-8 rounded-full text-sm hover:bg-white hover:text-[#FF8A00]">Custom Order</Link>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="font-black text-xl text-[#1A1A1A] mb-6">Related Articles</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white rounded-2xl p-4 border border-[#FFE4C2] hover:border-[#FFB449] transition-all">
                <p className="text-xs text-[#FF8A00] font-bold mb-1">{p.category}</p>
                <h4 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#FF8A00] leading-tight">{p.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
