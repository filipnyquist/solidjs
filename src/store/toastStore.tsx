import { type Component, Show } from "solid-js";
import { Toast, toaster } from "@kobalte/core/toast";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-solid";
import { type ToastData } from "../types";
import { cn } from "../lib/utils";

type Variant = ToastData["variant"];

const variantStyles: Record<Variant, string> = {
  default:     "bg-card border-border text-foreground",
  success:     "bg-green-50 border-green-200 text-green-900",
  destructive: "bg-red-50 border-red-200 text-red-900",
  warning:     "bg-yellow-50 border-yellow-200 text-yellow-900",
};

type IconComp = Component<{ class?: string }>;
const icons: Record<Variant, IconComp> = {
  default:     Info          as IconComp,
  success:     CheckCircle   as IconComp,
  destructive: AlertCircle   as IconComp,
  warning:     AlertTriangle as IconComp,
};
const iconColors: Record<Variant, string> = {
  default:     "text-primary",
  success:     "text-green-600",
  destructive: "text-red-600",
  warning:     "text-yellow-600",
};

interface ToastItemProps extends Omit<ToastData, "id"> {
  toastId: number;
}

const ToastItem: Component<ToastItemProps> = (props) => {
  const Icon = icons[props.variant];
  return (
    <Toast
      toastId={props.toastId}
      class={cn(
        "toast-item flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg w-full",
        variantStyles[props.variant]
      )}
    >
      <Icon class={cn("h-5 w-5 mt-0.5 shrink-0", iconColors[props.variant])} />
      <div class="flex-1 min-w-0">
        <Toast.Title class="font-semibold text-sm">{props.title}</Toast.Title>
        <Show when={props.description}>
          <Toast.Description class="text-xs mt-0.5 opacity-80">
            {props.description}
          </Toast.Description>
        </Show>
      </div>
      <Toast.CloseButton
        aria-label="Dismiss notification"
        class="opacity-60 hover:opacity-100 transition-opacity shrink-0 rounded-md p-0.5 hover:bg-black/5"
      >
        <X class="h-4 w-4" />
      </Toast.CloseButton>
    </Toast>
  );
};

export function addToast(toast: Omit<ToastData, "id">) {
  toaster.show((props) => <ToastItem toastId={props.toastId} {...toast} />);
}
