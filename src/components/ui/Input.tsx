import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, type, ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[11px] font-mono font-medium uppercase tracking-widest text-[#8A8F98] ml-1">
            {label}
          </label>
        )}
        
        <div className="relative group">
          {/* Left Icon Container */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A8F98] group-focus-within:text-[#5E6AD2] transition-colors duration-200">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              "flex h-11 w-full rounded-lg border border-white/10 bg-[#0F0F12] px-4 py-2 text-sm text-[#EDEDEF] transition-all duration-200",
              "placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#5E6AD2]/50 focus:border-[#5E6AD2]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              error && "border-red-500/50 focus:ring-red-500/30 focus:border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />

          {/* Right Icon Container */}
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8A8F98] group-focus-within:text-[#EDEDEF] transition-colors duration-200">
              {rightIcon}
            </div>
          )}

          {/* Bottom Glow Line - Subtle detail for depth */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[95%] h-[1px] bg-gradient-to-r from-transparent via-[#5E6AD2]/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Error Message with Motion */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-medium text-red-500 ml-1"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;