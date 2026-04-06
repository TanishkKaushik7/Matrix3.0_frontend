import React from 'react';
// Corrected import: motion (runtime component) and HTMLMotionProps (type)
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge tailwind classes safely
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children' | 'className'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}, ref) => {
  
  const variants = {
    // Solid accent with multi-layer shadow and glow
    primary: "bg-[#5E6AD2] hover:bg-[#6872D9] text-white shadow-[0_0_0_1px_rgba(94,106,210,0.5),0_4px_12px_rgba(94,106,210,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)]",
    
    // Translucent glass effect
    secondary: "bg-white/[0.05] hover:bg-white/[0.08] text-[#EDEDEF] border border-white/10",
    
    // Minimalist ghost style
    ghost: "bg-transparent hover:bg-white/[0.05] text-[#8A8F98] hover:text-[#EDEDEF]",
    
    // Dangerous actions like "Revoke Certificate" 
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || isLoading}
      className={cn(
        "relative overflow-hidden inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group",
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Interactive Shimmer Effect (Primary only) */}
      {variant === 'primary' && !disabled && (
        <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out pointer-events-none" />
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="relative z-10">{children}</span>
          {rightIcon && <span className="shrink-0 transition-transform group-hover:translate-x-0.5">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = "Button";

export default Button;