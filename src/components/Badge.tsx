import { cn } from "@/lib/utils";

interface BadgeProps {
  children?: React.ReactNode;
  variant?: "genuine" | "fake" | "pending" | "default";
  status?: "genuine" | "fake" | "pending";
  className?: string;
}

export const Badge = ({ children, variant, status, className }: BadgeProps) => {
  const finalVariant = status || variant || "default";
  
  const variantStyles = {
    genuine: "bg-success/10 text-success border-success/20",
    fake: "bg-destructive/10 text-destructive border-destructive/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    default: "bg-secondary text-secondary-foreground border-border",
  };

  const statusText = {
    genuine: "✓ Genuine",
    fake: "✗ Fake",
    pending: "⏳ Pending",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantStyles[finalVariant],
        className
      )}
    >
      {children || (status && statusText[status])}
    </span>
  );
};
