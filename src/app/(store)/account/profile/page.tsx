"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfileAction } from "@/app/actions/account.actions";
import { User, Save } from "lucide-react";

export default function ProfilePage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      const { data: profile } = (await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", user.id)
        .single()) as { data: { first_name: string | null; last_name: string | null; phone: string | null } | null; error: unknown };
      if (profile) {
        setForm({
          firstName: profile.first_name ?? "",
          lastName: profile.last_name ?? "",
          phone: profile.phone ?? "",
        });
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    const result = await updateProfileAction({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
    });
    setIsSaving(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1A1A1A] mb-6">My Profile</h1>
      <div className="bg-white rounded-3xl border border-[#FFE4C2] p-6 max-w-lg">
        <div className="flex items-center gap-2 mb-5">
          <User size={16} className="text-[#FFB449]" />
          <h2 className="font-bold text-[#1A1A1A] text-sm">Personal Details</h2>
        </div>

        {message && (
          <div className={`mb-5 px-4 py-3 rounded-xl text-sm border ${
            message.type === "success"
              ? "bg-green-50 border-green-100 text-green-700"
              : "bg-red-50 border-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5 block">
                First Name
              </label>
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none text-sm bg-transparent"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5 block">
                Last Name
              </label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none text-sm bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] text-sm bg-[#FFF9EE] text-[#6B6B6B] cursor-not-allowed"
            />
            <p className="text-xs text-[#6B6B6B] mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#6B6B6B] uppercase tracking-widest mb-1.5 block">
              Phone
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-2xl border-2 border-[#FFE4C2] focus:border-[#FFB449] focus:outline-none text-sm bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save size={15} />
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
