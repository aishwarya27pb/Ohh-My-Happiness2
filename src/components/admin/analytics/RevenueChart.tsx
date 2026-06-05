"use client";

import { motion } from "framer-motion";

interface RevenueData {
  date: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount), 1000);
  const height = 200;
  const padding = 20;

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-black text-[#1A1A1A] text-sm uppercase tracking-widest">Revenue Trends</h3>
          <p className="text-[#6B6B6B] text-xs mt-1">Last 7 days performance</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
        </div>
      </div>

      <div className="relative h-[200px] w-full flex items-end justify-between gap-2 mt-4">
        {data.map((item, i) => {
          const barHeight = (item.amount / maxAmount) * height;
          return (
            <div key={item.date} className="flex-1 flex flex-col items-center group relative">
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                ₹{item.amount.toLocaleString()}
              </div>
              
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barHeight }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                className="w-full bg-gradient-to-t from-[#FF8A00] to-[#FFB449] rounded-t-lg group-hover:from-[#FF9500] group-hover:to-[#FFC470] transition-colors"
                style={{ minHeight: item.amount > 0 ? '4px' : '0px' }}
              />
              <span className="text-[10px] text-[#6B6B6B] mt-2 font-medium">
                {new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
