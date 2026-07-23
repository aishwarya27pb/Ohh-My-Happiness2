import { env } from "@/env";

interface WhatsAppSendParams {
  recipientPhone: string; // Will be cleaned and formatted (e.g. 10-digit Indian phone gets prepended with '91')
  templateName: string;
  languageCode?: string;
  parameters: string[]; // Sequential template variables {{1}}, {{2}}, etc.
}

/**
 * Clean phone number to WhatsApp international standard (e.g., '919999999999' for India).
 */
export function formatWhatsAppPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  // Default to pre-pending India country code (91) if it's a standard 10-digit local number
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  return cleaned;
}

/**
 * Send template messages via Meta WhatsApp Cloud API.
 */
export async function sendWhatsAppMessage({
  recipientPhone,
  templateName,
  languageCode = "en_US",
  parameters,
}: WhatsAppSendParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
    const token = env.WHATSAPP_API_TOKEN;
    const baseUrl = env.WHATSAPP_API_URL || "https://graph.facebook.com/v21.0";

    if (!phoneId || !token) {
      console.warn("⚠️ WhatsApp API not fully configured. Skipping send message operation.");
      return { success: false, error: "Missing WhatsApp configurations in server environment." };
    }

    const cleanedPhone = formatWhatsAppPhone(recipientPhone);
    if (!cleanedPhone) {
      throw new Error(`Invalid phone number supplied for WhatsApp notification: ${recipientPhone}`);
    }

    const apiUrl = `${baseUrl}/${phoneId}/messages`;

    // Map template parameters to Meta Graph API components format
    const components = parameters.length > 0 ? [
      {
        type: "body",
        parameters: parameters.map((val) => ({
          type: "text",
          text: val,
        })),
      },
    ] : [];

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanedPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        ...(components.length > 0 ? { components } : {}),
      },
    };

    console.log(`✉️ Sending WhatsApp message via template "${templateName}" to ${cleanedPhone}...`);

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Meta API responded with an error");
    }

    console.log(`✅ WhatsApp message sent successfully. Msg ID: ${data.messages?.[0]?.id}`);
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Failed to send WhatsApp message to ${recipientPhone}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
