import { type Component, type JSX } from "solid-js";
import { Dialog } from "@kobalte/core/dialog";
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
    <Dialog
      open={props.open}
      onOpenChange={(isOpen: boolean) => { if (!isOpen) props.onClose(); }}
    >
      <Dialog.Portal>
        <Dialog.Overlay class="dialog-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            class={cn(
              "dialog-content relative w-full rounded-xl border border-border bg-background shadow-2xl outline-none",
              sizes[props.size ?? "md"]
            )}
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <Dialog.Title class="text-lg font-semibold">{props.title}</Dialog.Title>
                {props.description && (
                  <Dialog.Description class="text-sm text-muted-foreground mt-0.5">
                    {props.description}
                  </Dialog.Description>
                )}
              </div>
              <Dialog.CloseButton class="rounded-md p-1.5 hover:bg-accent transition-colors">
                <X class="h-4 w-4" />
              </Dialog.CloseButton>
            </div>
            <div class="p-6">{props.children}</div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog>
  );
};
