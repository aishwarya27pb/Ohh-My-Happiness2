import { getCustomersAction } from "@/app/actions/admin/customers.actions";
import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await getCustomersAction();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-[#1A1A1A]">Customers</h1>
        <p className="text-[#6B6B6B] text-sm mt-1">{customers.length} registered customers</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF9EE] flex items-center justify-center mb-4">
              <Users size={24} className="text-[#FFB449]" />
            </div>
            <p className="font-bold text-[#1A1A1A]">No customers yet</p>
            <p className="text-sm text-[#6B6B6B] mt-1">Customers appear here after they sign up.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F0F0F0] text-xs text-[#6B6B6B] uppercase tracking-widest">
                <th className="text-left px-5 py-3.5 font-semibold">Name</th>
                <th className="text-left px-5 py-3.5 font-semibold">Phone</th>
                <th className="text-left px-5 py-3.5 font-semibold">Joined</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {customers.map((c) => {
                const name = [c.first_name, c.last_name].filter(Boolean).join(" ") || "—";
                return (
                  <tr key={c.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFB449] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {(c.first_name?.[0] ?? c.phone?.[0] ?? "?").toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#1A1A1A]">{name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#6B6B6B]">{c.phone ?? "—"}</td>
                    <td className="px-5 py-4 text-[#6B6B6B]">
                      {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-4">
                      <Link href={`/admin/customers/${c.id}`} className="flex items-center justify-end text-[#C4C4C4] hover:text-[#FFB449]">
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}
