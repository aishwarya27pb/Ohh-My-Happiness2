"use server";

import {
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  updateLeadNotes,
} from "@/lib/services/leads.service";
import type { CustomOrderRequest, LeadStatus } from "@/lib/supabase/types";
import { revalidatePath } from "next/cache";

export async function getLeadsAction(filters?: {
  status?: string;
  search?: string;
}): Promise<CustomOrderRequest[]> {
  return getAllLeads(filters);
}

export async function getLeadAction(
  id: string
): Promise<CustomOrderRequest | null> {
  return getLeadById(id);
}

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<{ error?: string }> {
  try {
    await updateLeadStatus(id, status);
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${id}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}

export async function updateLeadNotesAction(
  id: string,
  adminNotes: string,
  quotedAmount?: number | null
): Promise<{ error?: string }> {
  try {
    await updateLeadNotes(id, adminNotes, quotedAmount);
    revalidatePath(`/admin/leads/${id}`);
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
