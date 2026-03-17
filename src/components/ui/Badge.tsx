import { type Component, type JSX, splitProps } from "solid-js";
import { cn } from "../../lib/utils";

type Variant = "default" | "secondary" | "destructive" | "outline" | "success" | "warning";

interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary text-secondary-foreground border-secondary",
  destructive: "bg-destructive/10 text-destructive border-destructive/20",
  outline: "border-border text-foreground",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export const Badge: Component<BadgeProps> = (props) => {
  const [local, rest] = splitProps(props, ["variant", "class", "children"]);
  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[local.variant ?? "default"],
        local.class
      )}
      {...rest}
    >
      {local.children}
    </span>
  );
};
