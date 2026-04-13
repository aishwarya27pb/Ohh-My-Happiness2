"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { getLeadAction, updateLeadStatusAction, updateLeadNotesAction } from "@/app/actions/admin/leads.actions";
import type { CustomOrderRequest, LeadStatus } from "@/lib/supabase/types";

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "quoted", "won", "lost"];

const LEAD_STATUS_STYLES: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700",
  contacted: "bg-yellow-50 text-yellow-700",
  quoted:    "bg-purple-50 text-purple-700",
  won:       "bg-green-50 text-green-700",
  lost:      "bg-red-50 text-red-700",
};

export default function AdminLeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<CustomOrderRequest | null>(null);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [quotedAmount, setQuotedAmount] = useState("");
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    getLeadAction(id).then((l) => {
      if (l) {
        setLead(l);
        setNotes(l.admin_notes ?? "");
        setQuotedAmount(l.quoted_amount != null ? String(l.quoted_amount) : "");
      }
    });
  }, [id]);

  if (!lead) {
    return <div className="p-8 text-[#6B6B6B]">Loading…</div>;
  }

  async function handleStatusChange(status: LeadStatus) {
    setUpdating(true);
    setSaveMsg(null);
    const result = await updateLeadStatusAction(lead!.id, status);
    if (result.error) {
      setSaveMsg({ text: result.error, ok: false });
    } else {
      setLead((l) => l ? { ...l, status } : l);
      setSaveMsg({ text: "Status updated.", ok: true });
    }
    setUpdating(false);
  }

  async function handleSaveNotes() {
    setUpdating(true);
    setSaveMsg(null);
    const amount = quotedAmount ? parseFloat(quotedAmount) : null;
    const result = await updateLeadNotesAction(lead!.id, notes, amount);
    if (result.error) {
      setSaveMsg({ text: result.error, ok: false });
    } else {
      setLead((l) => l ? { ...l, admin_notes: notes, quoted_amount: amount } : l);
      setSaveMsg({ text: "Notes saved.", ok: true });
    }
    setUpdating(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/leads" className="p-2 rounded-full hover:bg-[#F0F0F0] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-[#1A1A1A]">{lead.name}</h1>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${LEAD_STATUS_STYLES[lead.status] ?? "bg-gray-100"}`}>
            {lead.status}
          </span>
        </div>
      </div>

      {saveMsg && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm border ${saveMsg.ok ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`}>
          {saveMsg.text}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Lead details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Requirements */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#1A1A1A] mb-4 text-sm">Requirements</h2>
            <p className="text-sm text-[#4A4A4A] leading-relaxed whitespace-pre-wrap">{lead.requirements}</p>
          </div>

          {/* Order details */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#1A1A1A] mb-4 text-sm">Order Details</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {lead.category && (
                <div><span className="text-[#6B6B6B]">Category: </span><span className="capitalize font-medium">{lead.category}</span></div>
              )}
              {lead.occasion && (
                <div><span className="text-[#6B6B6B]">Occasion: </span><span className="capitalize font-medium">{lead.occasion}</span></div>
              )}
              {lead.quantity && (
                <div><span className="text-[#6B6B6B]">Quantity: </span><span className="font-medium">{lead.quantity}</span></div>
              )}
              {lead.budget && (
                <div><span className="text-[#6B6B6B]">Budget: </span><span className="font-medium">{lead.budget}</span></div>
              )}
              {lead.deadline && (
                <div><span className="text-[#6B6B6B]">Deadline: </span><span className="font-medium">{new Date(lead.deadline).toLocaleDateString("en-IN")}</span></div>
              )}
              <div><span className="text-[#6B6B6B]">Has Logo: </span><span className="font-medium">{lead.has_logo ? "Yes" : "No"}</span></div>
            </div>
          </div>

          {/* Admin notes */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <h2 className="font-bold text-[#1A1A1A] mb-4 text-sm">Admin Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this lead…"
              rows={4}
              className="w-full text-sm border border-[#E5E5E5] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FFB449] resize-none text-[#1A1A1A] placeholder:text-[#C4C4C4]"
            />
            <div className="flex items-center gap-4 mt-3">
              <div className="flex-1">
                <label className="text-xs text-[#6B6B6B] mb-1 block">Quoted Amount (₹)</label>
                <input
                  type="number"
                  value={quotedAmount}
                  onChange={(e) => setQuotedAmount(e.target.value)}
                  placeholder="0"
                  className="w-full text-sm border border-[#E5E5E5] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFB449] text-[#1A1A1A]"
                />
              </div>
              <button
                onClick={handleSaveNotes}
                disabled={updating}
                className="flex items-center gap-2 px-5 py-2.5 mt-5 bg-[#FFB449] text-white text-sm font-bold rounded-xl hover:bg-[#FF8A00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={14} />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Right: Contact + Status */}
        <div className="space-y-4">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 text-sm">
            <p className="font-bold text-[#1A1A1A] mb-3">Contact</p>
            <p className="font-semibold text-[#1A1A1A]">{lead.name}</p>
            {lead.company && <p className="text-[#6B6B6B]">{lead.company}</p>}
            <p className="text-[#6B6B6B] mt-1">{lead.email}</p>
            <p className="text-[#6B6B6B]">{lead.phone}</p>
            <p className="text-xs text-[#C4C4C4] mt-3">
              Submitted {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
            <p className="font-bold text-[#1A1A1A] mb-3 text-sm">Update Status</p>
            <div className="flex flex-col gap-2">
              {LEAD_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={updating || lead.status === s}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed border ${
                    lead.status === s
                      ? "bg-[#FFB449] border-[#FFB449] text-white"
                      : "bg-white border-[#E5E5E5] text-[#6B6B6B] hover:border-[#FFB449] hover:text-[#FF8A00]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
