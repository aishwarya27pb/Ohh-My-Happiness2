"use client";

import { motion } from "framer-motion";

interface StatusData {
  status: string;
  count: number;
  color: string;
}

interface StatusPieChartProps {
  data: StatusData[];
}

export default function StatusPieChart({ data }: StatusPieChartProps) {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  let cumulativePercent = 0;

  function getCoordinatesForPercent(percent: number) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm flex flex-col h-full">
      <div className="mb-6">
        <h3 className="font-black text-[#1A1A1A] text-sm uppercase tracking-widest">Order Status</h3>
        <p className="text-[#6B6B6B] text-xs mt-1">Distribution by stage</p>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-[180px]">
        <svg viewBox="-1 -1 2 2" className="w-32 h-32 -rotate-90">
          {data.map((slice, i) => {
            if (total === 0) return null;
            const startPercent = cumulativePercent;
            const slicePercent = slice.count / total;
            cumulativePercent += slicePercent;

            const [startX, startY] = getCoordinatesForPercent(startPercent);
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);

            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(" ");

            return (
              <motion.path
                key={slice.status}
                d={pathData}
                fill={slice.color}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          {/* Inner circle for donut effect */}
          <circle cx="0" cy="0" r="0.6" fill="white" />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <span className="text-xl font-black text-[#1A1A1A]">{total}</span>
          <span className="text-[10px] text-[#6B6B6B] uppercase font-bold">Orders</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-[10px] font-bold text-[#1A1A1A] capitalize">{item.status}</span>
            <span className="text-[10px] text-[#6B6B6B]">({item.count})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
