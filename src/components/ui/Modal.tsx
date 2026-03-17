import { type Component, type JSX, Show } from "solid-js";
import { cn } from "../../lib/utils";
import { X } from "lucide-solid";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: JSX.Element;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

export const Modal: Component<ModalProps> = (props) => {
  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={props.onClose} />
        <div class={cn("relative z-50 w-full mx-4 rounded-xl border border-border bg-background shadow-2xl", sizes[props.size ?? "md"])}>
          <div class="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 class="text-lg font-semibold">{props.title}</h2>
              {props.description && <p class="text-sm text-muted-foreground mt-0.5">{props.description}</p>}
            </div>
            <button onClick={props.onClose} class="rounded-md p-1.5 hover:bg-accent transition-colors">
              <X class="h-4 w-4" />
            </button>
          </div>
          <div class="p-6">{props.children}</div>
        </div>
      </div>
    </Show>
  );
};
