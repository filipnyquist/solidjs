import { type Component } from "solid-js";
import { Toast } from "@kobalte/core/toast";

export const Toaster: Component = () => {
  return (
    <Toast.Region duration={4000} pauseOnInteraction pauseOnPageIdle>
      <Toast.List class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[360px] outline-none" />
    </Toast.Region>
  );
};
