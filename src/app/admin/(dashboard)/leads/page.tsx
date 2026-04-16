import { getLeadsAction } from "@/app/actions/admin/leads.actions";
import Link from "next/link";
import { ChevronRight, MessageSquare } from "lucide-react";

const LEAD_STATUS_STYLES: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700",
  contacted: "bg-yellow-50 text-yellow-700",
  quoted:    "bg-purple-50 text-purple-700",
  won:       "bg-green-50 text-green-700",
  lost:      "bg-red-50 text-red-700",
};

export default async function AdminLeadsPage() {
  const leads = await getLeadsAction();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1A1A1A]">Custom Order Leads</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{leads.length} total leads</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF9EE] flex items-center justify-center mb-4">
              <MessageSquare size={24} className="text-[#FFB449]" />
            </div>
            <p className="font-bold text-[#1A1A1A]">No leads yet</p>
            <p className="text-sm text-[#6B6B6B] mt-1">Custom order requests will appear here.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0F0F0] text-xs text-[#6B6B6B] uppercase tracking-widest">
                <th className="text-left px-5 py-3.5 font-semibold">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold">Category</th>
                <th className="text-left px-5 py-3.5 font-semibold">Quantity</th>
                <th className="text-left px-5 py-3.5 font-semibold">Date</th>
                <th className="text-left px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[#1A1A1A]">{lead.name}</p>
                    {lead.company && <p className="text-xs text-[#6B6B6B]">{lead.company}</p>}
                    <p className="text-xs text-[#6B6B6B]">{lead.email}</p>
                  </td>
                  <td className="px-5 py-4 text-[#6B6B6B] capitalize">{lead.category ?? "—"}</td>
                  <td className="px-5 py-4 text-[#6B6B6B]">{lead.quantity ?? "—"}</td>
                  <td className="px-5 py-4 text-[#6B6B6B]">
                    {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${LEAD_STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="flex items-center justify-end text-[#C4C4C4] hover:text-[#FFB449]">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
