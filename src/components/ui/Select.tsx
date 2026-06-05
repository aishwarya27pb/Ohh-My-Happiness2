"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-bold text-[#1A1A1A] mb-1.5 block uppercase tracking-widest">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 text-sm transition-all text-left bg-white ${
          error 
            ? "border-red-300 focus:border-red-400" 
            : isOpen 
              ? "border-[#FFB449] shadow-sm" 
              : "border-[#FFE4C2] hover:border-[#FFB449]"
        }`}
      >
        <span className={selectedOption ? "text-[#1A1A1A] font-medium" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          size={18} 
          className={`text-[#FFB449] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#FFE4C2] overflow-hidden py-2"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors text-left ${
                    value === option.value 
                      ? "bg-[#FFF9EE] text-[#FF8A00] font-bold" 
                      : "text-[#1A1A1A] hover:bg-[#FFF9EE] hover:text-[#FF8A00]"
                  }`}
                >
                  {option.label}
                  {value === option.value && <Check size={16} className="text-[#FF8A00]" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
