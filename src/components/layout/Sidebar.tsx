import { type Component } from "solid-js";
import { A } from "@solidjs/router";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard, Users, ShoppingCart, Package,
  Settings, BarChart3, Bell, LogOut
} from "lucide-solid";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/users", icon: Users, label: "Users" },
  { href: "/orders", icon: ShoppingCart, label: "Orders" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export const Sidebar: Component = () => {
  return (
    <aside class="flex flex-col w-60 min-h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      {/* Logo */}
      <div class="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BarChart3 class="h-4 w-4 text-white" />
        </div>
        <span class="font-bold text-lg tracking-tight">Dashify</span>
      </div>

      {/* Navigation */}
      <nav class="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => (
          <A
            href={href}
            end={href === "/"}
            class={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
            activeClass="bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <Icon class="h-4 w-4" />
            {label}
          </A>
        ))}
      </nav>

      {/* Bottom */}
      <div class="px-3 py-4 border-t border-sidebar-border space-y-1">
        <button class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <Bell class="h-4 w-4" />
          Notifications
        </button>
        <button class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
          <LogOut class="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
