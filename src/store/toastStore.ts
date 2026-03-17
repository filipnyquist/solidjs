import { createSignal } from "solid-js";
import { type ToastData } from "../types";

const [toasts, setToasts] = createSignal<ToastData[]>([]);

let idCounter = 0;

export function addToast(toast: Omit<ToastData, "id">) {
  const id = `toast_${++idCounter}`;
  setToasts(prev => [...prev, { ...toast, id }]);
  setTimeout(() => removeToast(id), 4000);
}

export function removeToast(id: string) {
  setToasts(prev => prev.filter(t => t.id !== id));
}

export { toasts };
