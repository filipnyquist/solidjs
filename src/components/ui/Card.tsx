import { type Component, type JSX, splitProps } from "solid-js";
import { cn } from "../../lib/utils";

interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const Card: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("rounded-xl border border-border bg-card text-card-foreground shadow-sm", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

export const CardHeader: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("flex flex-col space-y-1.5 p-6", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

export const CardTitle: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <h3 class={cn("font-semibold leading-none tracking-tight text-sm", local.class)} {...rest}>
      {local.children}
    </h3>
  );
};

export const CardDescription: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <p class={cn("text-sm text-muted-foreground", local.class)} {...rest}>
      {local.children}
    </p>
  );
};

export const CardContent: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("p-6 pt-0", local.class)} {...rest}>
      {local.children}
    </div>
  );
};

export const CardFooter: Component<CardProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={cn("flex items-center p-6 pt-0", local.class)} {...rest}>
      {local.children}
    </div>
  );
};
