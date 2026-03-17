import { type Component, For, type JSX } from "solid-js";
import { cn } from "../../lib/utils";

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: Component<SelectProps> = (props) => {
  return (
    <select
      class={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        props.class
      )}
      value={props.value}
      onChange={props.onChange}
    >
      {props.placeholder && <option value="">{props.placeholder}</option>}
      <For each={props.options}>
        {(opt) => <option value={opt.value}>{opt.label}</option>}
      </For>
    </select>
  );
};
