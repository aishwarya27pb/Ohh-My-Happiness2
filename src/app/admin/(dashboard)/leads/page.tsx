import { getLeadsAction } from "@/app/actions/admin/leads.actions";
import ClickableRow from "@/components/admin/ClickableRow";
import Link from "next/link";
import { ChevronRight, MessageSquare, Search, Filter } from "lucide-react";
import type { LeadStatus } from "@/lib/supabase/types";

const LEAD_STATUS_STYLES: Record<string, string> = {
  new:       "bg-blue-50 text-blue-700 border-blue-100",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-100",
  quoted:    "bg-purple-50 text-purple-700 border-purple-100",
  won:       "bg-green-50 text-green-700 border-green-100",
  lost:      "bg-red-50 text-red-700 border-red-100",
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status;
  const search = params.search;

  // Retrieve leads from Supabase using the server action (admin-protected)
  const leads = await getLeadsAction({ status, search });

  // Calculate quick stats
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const wonLeads = leads.filter((l) => l.status === "won").length;
  const activeLeads = leads.filter((l) => ["new", "contacted", "quoted"].includes(l.status)).length;
  const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

  const statuses: { label: string; value?: LeadStatus | "all" }[] = [
    { label: "All Requests", value: "all" },
    { label: "New", value: "new" },
    { label: "Contacted", value: "contacted" },
    { label: "Quoted", value: "quoted" },
    { label: "Won", value: "won" },
    { label: "Lost", value: "lost" },
  ];

  const activeStatus = status || "all";

  return (
    <div className="p-4 sm:p-8 bg-[#FAFAFA] min-h-screen">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A1A] tracking-tight">Custom Requests</h1>
          <p className="text-[#6B6B6B] text-sm mt-1">Manage bulk corporate quotes and custom gifting orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Requests", value: totalLeads, desc: "All lifetime requests", color: "text-[#FF8A00]" },
          { label: "New Leads", value: newLeads, desc: "Awaiting first response", color: "text-blue-600" },
          { label: "Active Pipeline", value: activeLeads, desc: "In discussion/quoted", color: "text-purple-600" },
          { label: "Conversion Rate", value: `${conversionRate}%`, desc: "Percentage of won requests", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-[#E5E5E5] p-5 shadow-sm">
            <p className="text-xs font-black uppercase tracking-wider text-black/40 mb-1">{s.label}</p>
            <p className={`text-2xl font-black ${s.color} tracking-tight`}>{s.value}</p>
            <p className="text-[10px] text-[#6B6B6B] mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {statuses.map((st) => {
            const isSelected = activeStatus === st.value;
            const targetUrl = st.value === "all" 
              ? "/admin/leads" 
              : `/admin/leads?status=${st.value}${search ? `&search=${search}` : ""}`;

            return (
              <Link
                key={st.label}
                href={targetUrl}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? "bg-[#FFB449] border-[#FFB449] text-white shadow-sm"
                    : "bg-white border-[#E5E5E5] text-[#6B6B6B] hover:border-[#FFB449] hover:text-[#FF8A00]"
                }`}
              >
                {st.label}
              </Link>
            );
          })}
        </div>

        {/* Search Input */}
        <form className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30" size={16} />
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="search"
            defaultValue={search || ""}
            placeholder="Search by name, email, company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E5E5] text-xs focus:outline-none focus:border-[#FFB449] bg-white text-[#1A1A1A] placeholder:text-black/30"
          />
        </form>
      </div>

      {/* Table Listing */}
      <div className="bg-white rounded-3xl border border-[#E5E5E5] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#F0F0F0] flex items-center justify-between">
          <h3 className="font-black text-[#1A1A1A] text-sm uppercase tracking-widest">Inquiries List</h3>
          <span className="text-[10px] font-bold text-[#6B6B6B] bg-[#F0F0F0] px-2.5 py-1 rounded-lg">LEADS BOARD</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#F0F0F0] text-[10px] text-[#6B6B6B] uppercase font-black tracking-widest">
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Gift Category</th>
                <th className="text-center px-6 py-4">Qty</th>
                <th className="text-left px-6 py-4">Budget</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2.5">
                      <MessageSquare size={40} className="text-black/10" />
                      <p className="text-[#6B6B6B] font-bold text-sm">No custom requests found</p>
                      <p className="text-xs text-[#6B6B6B]">New quote inquiries submitted by clients appear here.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <ClickableRow 
                    key={lead.id} 
                    href={`/admin/leads/${lead.id}`} 
                    className="hover:bg-[#FFF9EE]/50 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1A1A1A]">{lead.name}</span>
                        {lead.company ? (
                          <span className="text-[10px] text-[#6B6B6B] font-semibold">{lead.company}</span>
                        ) : (
                          <span className="text-[10px] text-black/30 font-medium">Individual</span>
                        )}
                        <span className="text-[10px] text-[#6B6B6B] mt-0.5">{lead.email}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-5 text-[#6B6B6B] text-xs">
                      {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-5 text-[#1A1A1A] font-medium capitalize">
                      {lead.category || "General"}
                    </td>

                    {/* Qty */}
                    <td className="px-6 py-5 text-center font-bold text-[#1A1A1A]">
                      {lead.quantity ?? "—"}
                    </td>

                    {/* Budget */}
                    <td className="px-6 py-5 text-[#6B6B6B] text-xs font-semibold">
                      {lead.budget || "Not Specified"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${LEAD_STATUS_STYLES[lead.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                        {lead.status}
                      </span>
                    </td>

                    {/* Chevron Arrow */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end text-[#C4C4C4] group-hover:text-[#FFB449] transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </td>
                  </ClickableRow>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
