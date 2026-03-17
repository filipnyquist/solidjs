import { type Component, type JSX } from "solid-js";
import { AlertDialog } from "@kobalte/core/alert-dialog";
import { cn } from "../../lib/utils";
import { X } from "lucide-solid";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: JSX.Element;
}

export const ConfirmDialog: Component<ConfirmDialogProps> = (props) => {
  return (
    <AlertDialog
      open={props.open}
      onOpenChange={(isOpen: boolean) => { if (!isOpen) props.onClose(); }}
    >
      <AlertDialog.Portal>
        <AlertDialog.Overlay class="alert-overlay fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialog.Content
            class={cn(
              "alert-content relative w-full max-w-sm rounded-xl border border-border",
              "bg-background shadow-2xl outline-none"
            )}
          >
            <div class="flex items-center justify-between px-6 py-4 border-b border-border">
              <AlertDialog.Title class="text-lg font-semibold">
                {props.title}
              </AlertDialog.Title>
              <button
                onClick={props.onClose}
                class="rounded-md p-1.5 hover:bg-accent transition-colors"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="p-6">{props.children}</div>
          </AlertDialog.Content>
        </div>
      </AlertDialog.Portal>
    </AlertDialog>
  );
};
