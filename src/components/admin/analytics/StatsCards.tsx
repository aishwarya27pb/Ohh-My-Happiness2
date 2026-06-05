"use client";

import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, CreditCard, RefreshCw } from "lucide-react";

interface StatsCardsProps {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  returnRate: number;
}

export default function StatsCards({ totalOrders, totalRevenue, avgOrderValue, returnRate }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag className="text-blue-600" size={20} />,
      bg: "bg-blue-50",
      change: "+5.2%",
      isPositive: true
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: <CreditCard className="text-green-600" size={20} />,
      bg: "bg-green-50",
      change: "+12.1%",
      isPositive: true
    },
    {
      title: "Avg. Order Value",
      value: `₹${Math.round(avgOrderValue).toLocaleString()}`,
      icon: <TrendingUp className="text-purple-600" size={20} />,
      bg: "bg-purple-50",
      change: "+2.4%",
      isPositive: true
    },
    {
      title: "Return Rate",
      value: `${returnRate}%`,
      icon: <RefreshCw className="text-orange-600" size={20} />,
      bg: "bg-orange-50",
      change: "-0.8%",
      isPositive: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white p-5 rounded-3xl border border-[#E5E5E5] shadow-sm hover:border-[#FFB449] transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${card.isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
              {card.change}
            </span>
          </div>
          <h4 className="text-[#6B6B6B] text-[10px] font-black uppercase tracking-widest">{card.title}</h4>
          <p className="text-2xl font-black text-[#1A1A1A] mt-1">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
