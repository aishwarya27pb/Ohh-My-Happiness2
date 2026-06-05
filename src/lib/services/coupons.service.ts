import { createClient } from "@/lib/supabase/client";

export interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
  isActive: boolean;
}

export const couponsService = {
  /**
   * Validates a coupon code against the database
   */
  async validateCoupon(code: string, subtotal: number): Promise<{ coupon?: Coupon; error?: string }> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("isActive", true)
      .single();

    if (error || !data) {
      // Fallback for demo/hardcoded if table doesn't exist yet
      if (code.toUpperCase() === "HAPPY10") {
        return {
          coupon: {
            id: "happy10",
            code: "HAPPY10",
            type: "percentage",
            value: 10,
            isActive: true,
          }
        };
      }
      return { error: "Invalid or expired coupon code" };
    }

    const coupon = data as Coupon;

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return { error: "This coupon has expired" };
    }

    // Check min order amount
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return { error: `Minimum order amount of ₹${coupon.minOrderAmount} required` };
    }

    return { coupon };
  },

  /**
   * Calculates the discount amount based on coupon type
   */
  calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (coupon.type === "percentage") {
      let discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
      return Math.round(discount);
    } else {
      return Math.min(coupon.value, subtotal);
    }
  }
};
