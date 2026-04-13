import { createServiceClient } from "@/lib/supabase/service";
import { createClient } from "@/lib/supabase/server";
import type {
  CustomOrderRequest,
  CustomOrderInsert,
  LeadStatus,
} from "@/lib/supabase/types";

export async function createLead(
  data: CustomOrderInsert
): Promise<CustomOrderRequest> {
  const supabase = createServiceClient();
  const { data: lead, error } = await supabase
    .from("custom_order_requests")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return lead;
}

export async function getLeadById(
  id: string
): Promise<CustomOrderRequest | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("custom_order_requests")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export async function getAllLeads(filters?: {
  status?: string;
  search?: string;
}): Promise<CustomOrderRequest[]> {
  const supabase = await createClient();
  let query = supabase
    .from("custom_order_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status as LeadStatus);
  if (filters?.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,company.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateLeadStatus(
  id: string,
  status: LeadStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_order_requests")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function updateLeadNotes(
  id: string,
  adminNotes: string,
  quotedAmount?: number | null
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("custom_order_requests")
    .update({ admin_notes: adminNotes, ...(quotedAmount !== undefined ? { quoted_amount: quotedAmount } : {}) })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
