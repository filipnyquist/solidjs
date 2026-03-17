import { type Component } from "solid-js";
import { cn } from "../../lib/utils";

export const Skeleton: Component<{ class?: string }> = (props) => {
  return <div class={cn("animate-pulse rounded-md bg-muted", props.class)} />;
};
