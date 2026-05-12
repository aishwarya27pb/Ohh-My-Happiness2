/**
 * SINGLE SOURCE OF TRUTH for all database types.
 *
 * When the schema changes:
 *   1. Run: npx supabase gen types typescript --project-id siotvawafzrxnchssebk > src/lib/supabase/types.ts
 *   2. TypeScript will surface every broken service function at compile time.
 *   3. Fix only the service functions — no component changes needed.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "customer" | "admin";
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: "customer" | "admin";
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "customer" | "admin";
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          profile_id: string;
          label: string | null;
          first_name: string;
          last_name: string;
          phone: string | null;
          address: string;
          city: string;
          state: string;
          pincode: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          label?: string | null;
          first_name: string;
          last_name: string;
          phone?: string | null;
          address: string;
          city: string;
          state: string;
          pincode: string;
          is_default?: boolean;
          created_at?: string;
        };
        Update: {
          label?: string | null;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          address?: string;
          city?: string;
          state?: string;
          pincode?: string;
          is_default?: boolean;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          profile_id: string | null;
          status:
            | "confirmed"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | "refunded";
          subtotal: number;
          shipping: number;
          discount: number;
          total: number;
          coupon_code: string | null;
          payment_method: string;
          payment_status: string;
          gift_message: string | null;
          shipping_address: Json;
          contact_email: string;
          contact_phone: string;
          contact_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          profile_id?: string | null;
          status?: string;
          subtotal: number;
          shipping?: number;
          discount?: number;
          total: number;
          coupon_code?: string | null;
          payment_method: string;
          payment_status?: string;
          gift_message?: string | null;
          shipping_address: Json;
          contact_email: string;
          contact_phone: string;
          contact_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          payment_status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_slug: string;
          product_price: number;
          quantity: number;
          selected_variants: Json;
          line_total: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          product_name: string;
          product_slug: string;
          product_price: number;
          quantity: number;
          selected_variants?: Json;
          line_total: number;
        };
        Update: {
          quantity?: number;
          line_total?: number;
        };
        Relationships: [];
      };
      custom_order_requests: {
        Row: {
          id: string;
          profile_id: string | null;
          name: string;
          company: string | null;
          email: string;
          phone: string;
          category: string | null;
          occasion: string | null;
          quantity: number | null;
          budget: string | null;
          deadline: string | null;
          requirements: string;
          has_logo: boolean;
          logo_url: string | null;
          status: "new" | "contacted" | "quoted" | "won" | "lost";
          admin_notes: string | null;
          quoted_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id?: string | null;
          name: string;
          company?: string | null;
          email: string;
          phone: string;
          category?: string | null;
          occasion?: string | null;
          quantity?: number | null;
          budget?: string | null;
          deadline?: string | null;
          requirements: string;
          has_logo?: boolean;
          logo_url?: string | null;
          status?: string;
          admin_notes?: string | null;
          quoted_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: string;
          admin_notes?: string | null;
          quoted_amount?: number | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          product_count: number;
          icon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          product_count?: number;
          icon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          product_count?: number;
          icon?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          price: number;
          original_price: number | null;
          images: string[];
          category_id: string | null;
          category_slug: string | null;
          occasion: string[];
          description: string;
          short_description: string | null;
          variants: Json;
          customizable: boolean;
          in_stock: boolean;
          rating: number;
          review_count: number;
          tags: string[];
          is_bestseller: boolean;
          is_featured: boolean;
          is_new: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          price: number;
          original_price?: number | null;
          images?: string[];
          category_id?: string | null;
          category_slug?: string | null;
          occasion?: string[];
          description: string;
          short_description?: string | null;
          variants?: Json;
          customizable?: boolean;
          in_stock?: boolean;
          rating?: number;
          review_count?: number;
          tags?: string[];
          is_bestseller?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          price?: number;
          original_price?: number | null;
          images?: string[];
          category_id?: string | null;
          category_slug?: string | null;
          occasion?: string[];
          description?: string;
          short_description?: string | null;
          variants?: Json;
          customizable?: boolean;
          in_stock?: boolean;
          rating?: number;
          review_count?: number;
          tags?: string[];
          is_bestseller?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Views: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Convenience row types — derived from the Database type, never duplicated.
// ---------------------------------------------------------------------------

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Address = Database["public"]["Tables"]["addresses"]["Row"];
export type AddressInsert = Database["public"]["Tables"]["addresses"]["Insert"];
export type AddressUpdate = Database["public"]["Tables"]["addresses"]["Update"];

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
export type OrderUpdate = Database["public"]["Tables"]["orders"]["Update"];

export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type OrderItemInsert =
  Database["public"]["Tables"]["order_items"]["Insert"];

export type CustomOrderRequest =
  Database["public"]["Tables"]["custom_order_requests"]["Row"];
export type CustomOrderInsert =
  Database["public"]["Tables"]["custom_order_requests"]["Insert"];
export type LeadUpdate =
  Database["public"]["Tables"]["custom_order_requests"]["Update"];

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

// ---------------------------------------------------------------------------
// Composite types used across the app
// ---------------------------------------------------------------------------

export type OrderWithItems = Order & { order_items: OrderItem[] };

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type LeadStatus = "new" | "contacted" | "quoted" | "won" | "lost";

export type UserRole = "customer" | "admin";
