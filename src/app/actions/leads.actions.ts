"use server";

import { createClient } from "@/lib/supabase/server";
import { createLead, updateLeadStatus, updateLeadNotes } from "@/lib/services/leads.service";
import type { LeadStatus } from "@/lib/supabase/types";
import { headers } from "next/headers";
import { RateLimiter } from "@/lib/rate-limit";

import { sendWhatsAppMessage } from "@/lib/services/whatsapp.service";

const actionLimiter = new RateLimiter({
  limit: 10,
  windowMs: 60 * 1000,
});

export interface CustomOrderFormData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  category?: string;
  occasion?: string;
  quantity?: number;
  budget?: string;
  deadline?: string;
  requirements: string;
  has_logo: boolean;
}

export async function createLeadAction(
  form: CustomOrderFormData
): Promise<{ error?: string }> {
  try {
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "anonymous";
    const rateLimit = actionLimiter.check(`lead_${ip}`);
    if (!rateLimit.success) {
      return { error: "Too Many Requests. Please try again later." };
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await createLead({
      profile_id: user?.id ?? null,
      name: form.name,
      company: form.company || null,
      email: form.email,
      phone: form.phone,
      category: form.category || null,
      occasion: form.occasion || null,
      quantity: form.quantity ?? null,
      budget: form.budget || null,
      deadline: form.deadline || null,
      requirements: form.requirements,
      has_logo: form.has_logo,
      status: "new",
    });

    if (form.phone) {
      try {
        await sendWhatsAppMessage({
          recipientPhone: form.phone,
          templateName: "custom_request_received",
          parameters: [
            form.name,
            form.category || "Custom Gifting",
            form.quantity ? String(form.quantity) : "Not Specified",
          ],
        });
      } catch (wsErr) {
        console.error("WhatsApp trigger error for custom request:", wsErr);
      }
    }

    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Submission failed" };
  }
}

export async function updateLeadStatusAction(
  id: string,
  status: LeadStatus
): Promise<{ error?: string }> {
  try {
    await updateLeadStatus(id, status);
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
    return {};
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Update failed" };
  }
}
