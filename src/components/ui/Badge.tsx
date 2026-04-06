import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** * Utility to merge tailwind classes safely 
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
  dot?: boolean;
  className?: string;
}

const Badge = ({ 
  children, 
  variant = 'default', 
  dot = false, 
  className 
}: BadgeProps) => {
  
  // Design Token Mapping based on Linear / Modern System
  const variants = {
    default: "bg-white/[0.05] border-white/10 text-[#8A8F98]",
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    outline: "bg-transparent border-[#5E6AD2]/30 text-[#5E6AD2]",
  };

  const dots = {
    default: "bg-[#8A8F98]",
    success: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
    warning: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]",
    error: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
    outline: "bg-[#5E6AD2] shadow-[0_0_8px_rgba(94,106,210,0.4)]",
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-medium uppercase tracking-widest transition-all",
      variants[variant],
      className
    )}>
      {dot && (
        <motion.span 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className={cn("w-1.5 h-1.5 rounded-full", dots[variant])} 
        />
      )}
      {children}
    </div>
  );
};

export default Badge;