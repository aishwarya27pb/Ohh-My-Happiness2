"use client";

import { useState } from "react";
import { CheckCircle, Upload, Phone, Mail, Building2, Package, MessageSquare } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { createLeadAction } from "@/app/actions/leads.actions";

const features = [
  { icon: "🎨", title: "Full Customization", desc: "Your logo, colors, message, and design on every item" },
  { icon: "📦", title: "Bulk Pricing", desc: "Significant discounts for orders of 10 units and above" },
  { icon: "🚀", title: "Quick Turnaround", desc: "Sample within 72 hours, bulk in 5–7 business days" },
  { icon: "✅", title: "Quality Assured", desc: "Premium quality checked before every dispatch" },
];

const categories = [
  "Corporate Hampers", "Onboarding Kits", "Festival Gifts", "Personalized Gifts",
  "Wellness Kits", "Branded Merchandise", "Luxury Collections", "Other",
];

const occasions = [
  "Diwali", "Christmas", "New Year", "Holi", "Employee Anniversary",
  "Client Appreciation", "Product Launch", "Conference/Event", "Other",
];

export default function CustomOrdersPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "",
    category: "", occasion: "", quantity: "",
    budget: "", deadline: "", requirements: "",
    hasLogo: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone || form.phone.length < 10) e.phone = "Valid phone required";
    if (!form.quantity) e.quantity = "Quantity is required";
    if (!form.requirements) e.requirements = "Please describe your requirements";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError(null);
    const result = await createLeadAction({
      name: form.name,
      company: form.company || undefined,
      email: form.email,
      phone: form.phone,
      category: form.category || undefined,
      occasion: form.occasion || undefined,
      quantity: form.quantity ? parseInt(form.quantity) : undefined,
      budget: form.budget || undefined,
      deadline: form.deadline || undefined,
      requirements: form.requirements,
      has_logo: form.hasLogo,
    });
    if (result.error) {
      setSubmitError(result.error);
      setIsSubmitting(false);
    } else {
      setSubmitted(true);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-2xl border-2 text-sm focus:outline-none transition-colors bg-white ${
      errors[field] ? "border-red-300 focus:border-red-400" : "border-[#FFE4C2] focus:border-[#FFB449]"
    }`;

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-[#FFE4C2] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#FFB449]" />
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-3">Request Submitted!</h2>
        <p className="text-[#6B6B6B] mb-4">
          Thank you, <span className="font-bold text-[#1A1A1A]">{form.name}</span>! Our team will get back to you within 24 hours with a detailed quote.
        </p>
        <div className="bg-[#FFF9EE] rounded-2xl p-5 mb-8 text-left border border-[#FFE4C2]">
          <p className="text-sm font-bold text-[#1A1A1A] mb-1">What happens next?</p>
          <ul className="text-sm text-[#6B6B6B] space-y-1.5">
            <li>✅ You'll receive an email confirmation shortly</li>
            <li>📞 Our team will call you within 24 hours</li>
            <li>📋 We'll share a detailed quote and samples</li>
            <li>🎁 Upon approval, production begins immediately</li>
          </ul>
        </div>
        <div className="flex gap-3 justify-center">
          <a href="/" className="btn-primary text-sm px-6 py-3">Back to Home</a>
          <button onClick={() => setSubmitted(false)} className="btn-outline text-sm px-6 py-3">Submit Another</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FFE4C2] to-[#FFF9EE] py-16 px-4 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#FF8A00] bg-white px-4 py-1.5 rounded-full mb-5">
          Custom Orders
        </span>
        <h1 className="text-4xl font-black text-[#1A1A1A] mb-3 max-w-2xl mx-auto">
          Tell Us What You Need — <span className="text-gradient">We'll Create It</span>
        </h1>
        <p className="text-[#6B6B6B] max-w-xl mx-auto">
          "Your requirement is our responsibility." Share your gifting vision and we'll craft the perfect solution for you.
        </p>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="text-center p-5 bg-[#FFF9EE] rounded-3xl border border-[#FFE4C2]">
                <div className="text-4xl mb-3">{f.icon}</div>
                <p className="font-bold text-sm text-[#1A1A1A] mb-1">{f.title}</p>
                <p className="text-xs text-[#6B6B6B]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-[#FFF9EE]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeader
            eyebrow="Get a Quote"
            title="Request Custom "
            highlight="Gift Quote"
            subtitle="Fill in the details below and our team will respond within 24 hours."
          />

          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FFE4C2] space-y-6 shadow-sm">
            {/* Contact Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-[#FFB449]" />
                <h3 className="font-bold text-[#1A1A1A]">Your Details</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Your Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Priya Sharma" className={inputClass("name")} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Company Name</label>
                  <input name="company" value={form.company} onChange={handleChange} placeholder="TechCorp India" className={inputClass("company")} />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="priya@company.com" className={inputClass("email")} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Phone *</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" className={inputClass("phone")} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t border-[#FFE4C2] pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Package size={18} className="text-[#FFB449]" />
                <h3 className="font-bold text-[#1A1A1A]">Order Details</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Gift Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inputClass("category")}>
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Occasion</label>
                  <select name="occasion" value={form.occasion} onChange={handleChange} className={inputClass("occasion")}>
                    <option value="">Select occasion</option>
                    {occasions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Quantity *</label>
                  <input name="quantity" type="number" min="10" value={form.quantity} onChange={handleChange} placeholder="e.g. 100" className={inputClass("quantity")} />
                  {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
                  <p className="text-xs text-[#6B6B6B] mt-1">Minimum 10 units</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Budget per Unit</label>
                  <select name="budget" value={form.budget} onChange={handleChange} className={inputClass("budget")}>
                    <option value="">Select budget</option>
                    <option>Under ₹500</option>
                    <option>₹500 – ₹1,000</option>
                    <option>₹1,000 – ₹2,500</option>
                    <option>₹2,500 – ₹5,000</option>
                    <option>Above ₹5,000</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Required By</label>
                  <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className={inputClass("deadline")} />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="border-t border-[#FFE4C2] pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-[#FFB449]" />
                <h3 className="font-bold text-[#1A1A1A]">Your Requirements</h3>
              </div>
              <div>
                <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Describe your requirements *</label>
                <textarea
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  placeholder="Describe what you're looking for — type of gifts, branding requirements, special instructions, delivery locations, etc."
                  rows={5}
                  className={`${inputClass("requirements")} resize-none`}
                />
                {errors.requirements && <p className="text-xs text-red-500 mt-1">{errors.requirements}</p>}
              </div>

              {/* Logo Upload */}
              <div className="mt-4">
                <label className="text-xs font-bold text-[#1A1A1A] mb-1 block">Upload Logo / Reference (optional)</label>
                <div className="border-2 border-dashed border-[#FFE4C2] rounded-2xl p-6 text-center hover:border-[#FFB449] transition-colors cursor-pointer">
                  <Upload size={24} className="text-[#FFB449] mx-auto mb-2" />
                  <p className="text-sm text-[#6B6B6B]">Drag & drop or click to upload</p>
                  <p className="text-xs text-[#6B6B6B] mt-1">PNG, JPG, PDF up to 10MB</p>
                  <input type="file" className="hidden" accept=".png,.jpg,.jpeg,.pdf" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="hasLogo"
                  name="hasLogo"
                  checked={form.hasLogo}
                  onChange={handleChange}
                  className="accent-[#FFB449] w-4 h-4"
                />
                <label htmlFor="hasLogo" className="text-sm text-[#6B6B6B]">
                  I want custom branding / logo on the gifts
                </label>
              </div>
            </div>

            {submitError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {submitError}
              </div>
            )}
            <button type="submit" className="btn-primary w-full text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Request — Get Free Quote"}
            </button>

            <p className="text-center text-xs text-[#6B6B6B]">
              Or reach us directly:{" "}
              <a href="tel:+919999999999" className="text-[#FF8A00] font-bold hover:underline">+91 99999 99999</a>
              {" · "}
              <a href="mailto:hello@ohhmyhappiness.com" className="text-[#FF8A00] font-bold hover:underline">hello@ohhmyhappiness.com</a>
            </p>
          </form>
        </div>
      </section>

      {/* Direct contact */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <a href="tel:+919999999999" className="flex items-center gap-4 p-5 bg-[#FFF9EE] rounded-3xl border border-[#FFE4C2] hover:border-[#FFB449] transition-colors group">
              <div className="w-12 h-12 bg-[#FFB449] rounded-2xl flex items-center justify-center">
                <Phone size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A] group-hover:text-[#FF8A00]">Call Us</p>
                <p className="text-sm text-[#6B6B6B]">+91 99999 99999</p>
                <p className="text-xs text-[#6B6B6B]">Mon–Sat, 9am–7pm</p>
              </div>
            </a>
            <a href="mailto:hello@ohhmyhappiness.com" className="flex items-center gap-4 p-5 bg-[#FFF9EE] rounded-3xl border border-[#FFE4C2] hover:border-[#FFB449] transition-colors group">
              <div className="w-12 h-12 bg-[#FFB449] rounded-2xl flex items-center justify-center">
                <Mail size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[#1A1A1A] group-hover:text-[#FF8A00]">Email Us</p>
                <p className="text-sm text-[#6B6B6B]">hello@ohhmyhappiness.com</p>
                <p className="text-xs text-[#6B6B6B]">Response within 24 hours</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
