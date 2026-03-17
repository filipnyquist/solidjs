import { type Component } from "solid-js";
import { Select as KobalteSelect } from "@kobalte/core/select";
import { Check, ChevronDown } from "lucide-solid";
import { cn } from "../../lib/utils";

type Option = { value: string; label: string };

interface SelectProps {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  class?: string;
  disabled?: boolean;
}

export const Select: Component<SelectProps> = (props) => {
  const selectedOption = () =>
    props.options.find((o) => o.value === props.value) ?? null;

  return (
    <KobalteSelect<Option>
      options={props.options}
      optionValue="value"
      optionTextValue="label"
      value={selectedOption()}
      onChange={(item: Option | null) => props.onChange?.(item?.value ?? "")}
      disabled={props.disabled}
      itemComponent={(itemProps: { item: { rawValue: Option } }) => (
        <KobalteSelect.Item
          item={itemProps.item as any}
          class="relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-1.5 text-sm outline-none transition-colors hover:bg-accent data-[highlighted]:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
        >
          <KobalteSelect.ItemLabel>
            {itemProps.item.rawValue.label}
          </KobalteSelect.ItemLabel>
          <KobalteSelect.ItemIndicator class="ml-auto">
            <Check class="h-4 w-4" />
          </KobalteSelect.ItemIndicator>
        </KobalteSelect.Item>
      )}
    >
      <KobalteSelect.Trigger
        class={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
          props.class
        )}
      >
        <span
          class={cn(
            "flex-1 min-w-0 text-left truncate",
            !selectedOption() && "text-muted-foreground"
          )}
        >
          {selectedOption()?.label ?? (props.placeholder ?? "Select...")}
        </span>
        <KobalteSelect.Icon class="ml-2 shrink-0 text-muted-foreground">
          <ChevronDown class="h-4 w-4" />
        </KobalteSelect.Icon>
      </KobalteSelect.Trigger>

      <KobalteSelect.Portal>
        <KobalteSelect.Content class="select-content relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-xl">
          <KobalteSelect.Listbox class="p-1 max-h-60 overflow-auto outline-none" />
        </KobalteSelect.Content>
      </KobalteSelect.Portal>
    </KobalteSelect>
  );
};
