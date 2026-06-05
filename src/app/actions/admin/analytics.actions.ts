"use server";

import { createClient } from "@/lib/supabase/server";

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  monthRevenue: number;
  monthOrders: number;
  newCustomers: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    contact_name: string;
    contact_email: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  type OrderTotalRow = { total: number };
  type IdRow = { id: string };

  const [
    { data: allOrders },
    { data: monthOrders },
    { data: monthCustomers },
    { data: recentOrders },
  ] = (await Promise.all([
    supabase.from("orders").select("total").neq("status", "cancelled"),
    supabase
      .from("orders")
      .select("total")
      .gte("created_at", monthStart)
      .neq("status", "cancelled"),
    supabase
      .from("profiles")
      .select("id")
      .eq("role", "customer")
      .gte("created_at", monthStart),
    supabase
      .from("orders")
      .select("id, order_number, contact_name, contact_email, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(10),
  ])) as [
    { data: OrderTotalRow[] | null; error: unknown },
    { data: OrderTotalRow[] | null; error: unknown },
    { data: IdRow[] | null; error: unknown },
    { data: DashboardMetrics["recentOrders"] | null; error: unknown },
  ];

  // Revenue by month (last 6 months)
  const revenueByMonth: Array<{ month: string; revenue: number }> = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString();
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).toISOString();
    const { data: monthData } = (await supabase
      .from("orders")
      .select("total")
      .gte("created_at", start)
      .lt("created_at", end)
      .neq("status", "cancelled")) as { data: { total: number }[] | null; error: unknown };

    revenueByMonth.push({
      month: d.toLocaleString("default", { month: "short" }),
      revenue: (monthData ?? []).reduce((s, o) => s + (o.total ?? 0), 0),
    });
  }

  return {
    totalRevenue: (allOrders ?? []).reduce((s, o) => s + (o.total ?? 0), 0),
    totalOrders: (allOrders ?? []).length,
    monthRevenue: (monthOrders ?? []).reduce((s, o) => s + (o.total ?? 0), 0),
    monthOrders: (monthOrders ?? []).length,
    newCustomers: (monthCustomers ?? []).length,
    recentOrders: (recentOrders ?? []) as DashboardMetrics["recentOrders"],
    revenueByMonth,
  };
}
