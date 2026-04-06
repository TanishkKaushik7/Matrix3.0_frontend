import React, { useState, useRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Omit standard children/className to avoid conflict with motion props
interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children' | 'className'> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  interactive?: boolean;
}

const Card = ({ 
  children, 
  className, 
  spotlightColor = "rgba(94,106,210,0.15)",
  interactive = true,
  ...props // Capture all other props like onClick
}: CardProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || !interactive) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => { setOpacity(1); setIsFocused(true); }}
      onMouseLeave={() => { setOpacity(0); setIsFocused(false); }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.08] to-white/[0.02] transition-colors duration-500",
        isFocused ? "border-white/[0.12]" : "border-white/[0.06]",
        className
      )}
      {...props} // Spread standard attributes (like onClick) here
    >
      {/* Interactive Spotlight Overlay */}
      {interactive && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
          }}
        />
      )}

      {/* Internal Glow Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default Card;