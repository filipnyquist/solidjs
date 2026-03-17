import { type Component } from "solid-js";
import { Search, Bell } from "lucide-solid";
import { Input } from "../ui/Input";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: Component<HeaderProps> = (props) => {
  return (
    <header class="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
      <div>
        <h1 class="text-xl font-bold text-foreground">{props.title}</h1>
        {props.subtitle && <p class="text-sm text-muted-foreground">{props.subtitle}</p>}
      </div>
      <div class="flex items-center gap-3">
        <div class="relative">
          <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            class="pl-9 w-64"
          />
        </div>
        <button class="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <Bell class="h-5 w-5 text-muted-foreground" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
        </button>
        <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
          A
        </div>
      </div>
    </header>
  );
};
