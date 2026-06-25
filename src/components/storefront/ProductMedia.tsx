import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ProductMedia({
  emoji,
  gradient,
  className,
  size = "md",
}: {
  emoji: string;
  gradient: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-4xl",
    md: "text-6xl",
    lg: "text-7xl",
    xl: "text-9xl",
  };
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-br",
        gradient,
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
      <motion.div
        whileHover={{ scale: 1.08, rotate: -2 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={cn("relative z-10 grid h-full w-full place-items-center", sizes[size])}
      >
        <span className="drop-shadow-sm">{emoji}</span>
      </motion.div>
    </div>
  );
}