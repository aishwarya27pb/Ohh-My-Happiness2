"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ClickableRowProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ClickableRow({ href, children, className = "" }: ClickableRowProps) {
  const router = useRouter();

  const handleRowClick = (e: React.MouseEvent) => {
    // If the click is on an interactive element inside the row (like a button or link), let it handle itself
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("a") ||
      target.closest("input") ||
      target.closest("select") ||
      target.closest("textarea")
    ) {
      return;
    }
    router.push(href);
  };

  return (
    <tr
      onClick={handleRowClick}
      className={`cursor-pointer transition-colors ${className}`}
    >
      {children}
    </tr>
  );
}
