import { type Component, For, Show } from "solid-js";
import { toasts, removeToast } from "../../store/toastStore";
import { cn } from "../../lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-solid";
import { type ToastData } from "../../types";

const variantStyles: Record<ToastData["variant"], string> = {
  default: "bg-card border-border text-foreground",
  success: "bg-green-50 border-green-200 text-green-900",
  destructive: "bg-red-50 border-red-200 text-red-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
};

type IconComponent = (props: { class?: string }) => JSX.Element;

import { type JSX } from "solid-js";

const icons: Record<ToastData["variant"], IconComponent> = {
  default: Info as IconComponent,
  success: CheckCircle as IconComponent,
  destructive: AlertCircle as IconComponent,
  warning: AlertTriangle as IconComponent,
};

const iconColors: Record<ToastData["variant"], string> = {
  default: "text-primary",
  success: "text-green-600",
  destructive: "text-red-600",
  warning: "text-yellow-600",
};

export const Toaster: Component = () => {
  return (
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[360px]">
      <For each={toasts()}>
        {(toast) => {
          const Icon = icons[toast.variant];
          return (
            <div
              class={cn(
                "toast flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
                variantStyles[toast.variant]
              )}
            >
              <Icon class={cn("h-5 w-5 mt-0.5 flex-shrink-0", iconColors[toast.variant])} />
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-sm">{toast.title}</p>
                <Show when={toast.description}>
                  <p class="text-xs mt-0.5 opacity-80">{toast.description}</p>
                </Show>
              </div>
              <button onClick={() => removeToast(toast.id)} class="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
                <X class="h-4 w-4" />
              </button>
            </div>
          );
        }}
      </For>
    </div>
  );
};
