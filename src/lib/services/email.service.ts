import { env } from "@/env";
import type { OrderWithItems, OrderStatus } from "@/lib/supabase/types";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email using Resend API (HTTP POST).
 */
export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    const apiKey = env.RESEND_API_KEY;
    const sender = env.NEXT_PUBLIC_RESEND_SENDER || "onboarding@resend.dev";

    if (!apiKey) {
      console.warn("⚠️ Resend API Key is missing. Skipping email send operation.");
      return { success: false, error: "Missing RESEND_API_KEY." };
    }

    console.log(`✉️ Sending email to ${to} with subject "${subject}"...`);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Ohh My Happiness <${sender}>`,
        to: [to],
        subject,
        html,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Resend API returned an error");
    }

    console.log(`✅ Email sent successfully via Resend. ID: ${data.id}`);
    return { success: true };
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    console.error(`❌ Failed to send email to ${to}:`, errMsg);
    return { success: false, error: errMsg };
  }
}

/**
 * Helper to generate HTML email layout for order status tracking.
 */
export function generateOrderStatusEmailHTML(
  order: OrderWithItems,
  status: OrderStatus
): { subject: string; html: string } {
  let subject = "";
  let statusTitle = "";
  let statusDescription = "";
  let statusColor = "#FF8A00";

  switch (status) {
    case "confirmed":
      subject = `Order Confirmed - #${order.order_number}`;
      statusTitle = "Your Order is Confirmed!";
      statusDescription = `Thank you for shopping with us! We have received your order #${order.order_number} and are getting it ready.`;
      break;
    case "processing":
      subject = `Order is Processing - #${order.order_number}`;
      statusTitle = "Your Order is being Prepared!";
      statusDescription = `Exciting news! We are hand-packing your luxury gifting hamper for order #${order.order_number}. We will notify you as soon as it ships.`;
      statusColor = "#FFB449";
      break;
    case "shipped":
      subject = `Order Shipped - #${order.order_number}`;
      statusTitle = "Your Order has been Shipped!";
      statusDescription = `Great news! Your luxury gifting package for order #${order.order_number} is on its way. You can track your shipment using your registered contact details.`;
      statusColor = "#8A3FFC";
      break;
    case "delivered":
      subject = `Order Delivered - #${order.order_number}`;
      statusTitle = "Your Order is Delivered!";
      statusDescription = `Success! Your order #${order.order_number} has been delivered. We hope the unwrapping experience brings immense happiness!`;
      statusColor = "#198038";
      break;
    case "cancelled":
      subject = `Order Cancelled - #${order.order_number}`;
      statusTitle = "Your Order has been Cancelled";
      statusDescription = `Order #${order.order_number} has been cancelled. If you believe this was done in error or would like to request a refund, please contact support.`;
      statusColor = "#DA1E28";
      break;
    case "returned":
      subject = `Order Returned - #${order.order_number}`;
      statusTitle = "Your Order is Returned";
      statusDescription = `We have processed the return for order #${order.order_number}. If applicable, your refund is being initiated.`;
      statusColor = "#FF8A00";
      break;
    case "refunded":
      subject = `Order Refunded - #${order.order_number}`;
      statusTitle = "Refund Processed";
      statusDescription = `The refund for order #${order.order_number} has been successfully processed. Please allow 5-7 business days for the funds to reflect in your account.`;
      statusColor = "#0F62FE";
      break;
    default:
      subject = `Order Update - #${order.order_number}`;
      statusTitle = "Order Update";
      statusDescription = `There has been a status update on your order #${order.order_number} to status: ${status}.`;
  }

  const shipping = order.shipping_address as Record<string, string>;
  const addressString = `${shipping.address}, ${shipping.city}, ${shipping.state} - ${shipping.pincode}`;

  const itemsListHTML = (order.order_items || [])
    .map(
      (item) => `
      <tr class="item-row">
        <td>
          <div class="item-name">${item.product_name}</div>
          <div class="item-qty">Quantity: ${item.quantity}</div>
        </td>
        <td class="item-total">₹${Number(item.line_total).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #FAFAFA;
          color: #1A1A1A;
          margin: 0;
          padding: 0;
        }
        .wrapper {
          max-width: 600px;
          margin: 40px auto;
          background-color: #FFFFFF;
          border: 1px solid #E5E5E5;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .header {
          background-color: #FFF9EE;
          padding: 32px;
          text-align: center;
          border-bottom: 1px solid #FFE4C2;
        }
        .logo {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #FF8A00;
        }
        .content {
          padding: 40px 32px;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 14px;
          background-color: ${statusColor};
          color: #FFFFFF;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-radius: 99px;
          margin-bottom: 24px;
        }
        .title {
          font-size: 22px;
          font-weight: 900;
          color: #1A1A1A;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }
        .description {
          font-size: 15px;
          line-height: 1.6;
          color: #4A4A4A;
          margin-bottom: 32px;
        }
        .order-details {
          background-color: #FAFAFA;
          border: 1px solid #EEEEEE;
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 32px;
        }
        .details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 13px;
        }
        .details-row:last-child {
          margin-bottom: 0;
        }
        .details-label {
          color: #6B6B6B;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.05em;
        }
        .details-value {
          color: #1A1A1A;
          font-weight: 900;
          text-align: right;
          max-width: 60%;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
        }
        .items-header th {
          text-align: left;
          font-size: 10px;
          font-weight: 900;
          color: #6B6B6B;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding-bottom: 12px;
          border-bottom: 2px solid #EEEEEE;
        }
        .item-row td {
          padding: 16px 0;
          border-bottom: 1px solid #EEEEEE;
          font-size: 14px;
        }
        .item-name {
          font-weight: bold;
          color: #1A1A1A;
        }
        .item-qty {
          color: #6B6B6B;
          font-size: 11px;
          margin-top: 4px;
        }
        .item-total {
          font-weight: 900;
          color: #1A1A1A;
          text-align: right;
        }
        .pricing-summary {
          width: 100%;
          max-width: 300px;
          margin-left: auto;
          margin-bottom: 40px;
          font-size: 13px;
        }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .pricing-label {
          color: #6B6B6B;
        }
        .pricing-value {
          font-weight: 900;
          color: #1A1A1A;
        }
        .pricing-row.total {
          font-size: 16px;
          font-weight: 900;
          color: #FF8A00;
          border-top: 2px solid #FFE4C2;
          padding-top: 14px;
          margin-top: 14px;
        }
        .footer {
          background-color: #FAFAFA;
          padding: 32px;
          text-align: center;
          border-top: 1px solid #EEEEEE;
          font-size: 12px;
          color: #888888;
          line-height: 1.5;
        }
        .footer a {
          color: #FF8A00;
          text-decoration: none;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo">Ohh My Happiness</div>
        </div>
        <div class="content">
          <div class="status-badge">${status}</div>
          <div class="title">${statusTitle}</div>
          <div class="description">${statusDescription}</div>
          
          <div class="order-details">
            <div class="details-row">
              <span class="details-label">Order Number</span>
              <span class="details-value">#${order.order_number}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Delivery To</span>
              <span class="details-value">${order.contact_name}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Shipping Address</span>
              <span class="details-value">${addressString}</span>
            </div>
            <div class="details-row">
              <span class="details-label">Payment Method</span>
              <span class="details-value" style="text-transform: uppercase;">${order.payment_method}</span>
            </div>
          </div>

          <table class="items-table">
            <thead>
              <tr class="items-header">
                <th>Gifts</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsListHTML}
            </tbody>
          </table>

          <div class="pricing-summary">
            <div class="pricing-row">
              <span class="pricing-label">Subtotal</span>
              <span class="pricing-value">₹${Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div class="pricing-row">
              <span class="pricing-label">Shipping</span>
              <span class="pricing-value">${Number(order.shipping) === 0 ? "FREE" : `₹${Number(order.shipping)}`}</span>
            </div>
            ${
              Number(order.discount) > 0
                ? `
            <div class="pricing-row" style="color: #198038;">
              <span class="pricing-label" style="color: #198038;">Discount</span>
              <span class="pricing-value" style="color: #198038;">−₹${Number(order.discount).toLocaleString()}</span>
            </div>`
                : ""
            }
            <div class="pricing-row total">
              <span>Total Paid</span>
              <span>₹${Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <p>Questions? We're here to help. Contact us at <a href="mailto:support@ohhmyhappiness.com">support@ohhmyhappiness.com</a></p>
          <p>&copy; ${new Date().getFullYear()} Ohh My Happiness. Premium Luxury Gifting.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, html };
}
