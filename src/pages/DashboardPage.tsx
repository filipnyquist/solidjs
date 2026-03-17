import { type Component, createResource, For, Show } from "solid-js";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchDashboardStats, fetchActivity, fetchOrders } from "../api/client";
import { formatCurrency, formatRelativeTime, capitalize } from "../lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package } from "lucide-solid";
import { type Activity, type Order } from "../types";

const statusVariant = (status: Order["status"]) => {
  const map: Record<Order["status"], "success" | "warning" | "destructive" | "default" | "secondary"> = {
    delivered: "success",
    shipped: "default",
    processing: "warning",
    pending: "secondary",
    cancelled: "destructive",
  };
  return map[status];
};

const activityIcon: Record<Activity["type"], string> = {
  order: "🛒",
  user: "👤",
  product: "📦",
  alert: "⚠️",
};

export const DashboardPage: Component = () => {
  const [stats] = createResource(fetchDashboardStats);
  const [activity] = createResource(fetchActivity);
  const [orders] = createResource(fetchOrders);

  const recentOrders = () => orders()?.slice(0, 5) ?? [];

  return (
    <Layout title="Dashboard" subtitle="Welcome back, Admin">
      {/* Stats Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Show when={stats()} fallback={<For each={[1,2,3,4]}>{() => <Skeleton class="h-32" />}</For>}>
          {(s) => {
            const cards = [
              { title: "Total Revenue", value: formatCurrency(s().totalRevenue), change: s().revenueChange, icon: DollarSign, color: "text-blue-600 bg-blue-50" },
              { title: "Total Users", value: s().totalUsers.toLocaleString(), change: s().usersChange, icon: Users, color: "text-purple-600 bg-purple-50" },
              { title: "Total Orders", value: s().totalOrders.toLocaleString(), change: s().ordersChange, icon: ShoppingCart, color: "text-orange-600 bg-orange-50" },
              { title: "Products", value: s().activeProducts.toString(), change: s().productsChange, icon: Package, color: "text-green-600 bg-green-50" },
            ];
            return (
              <For each={cards}>
                {(card) => (
                  <Card>
                    <CardContent class="pt-6">
                      <div class="flex items-center justify-between mb-4">
                        <div class={`p-2 rounded-lg ${card.color}`}>
                          <card.icon class="h-5 w-5" />
                        </div>
                        <div class={`flex items-center gap-1 text-xs font-medium ${card.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {card.change >= 0 ? <TrendingUp class="h-3 w-3" /> : <TrendingDown class="h-3 w-3" />}
                          {Math.abs(card.change)}%
                        </div>
                      </div>
                      <div class="text-2xl font-bold">{card.value}</div>
                      <p class="text-xs text-muted-foreground mt-1">{card.title}</p>
                    </CardContent>
                  </Card>
                )}
              </For>
            );
          }}
        </Show>
      </div>

      {/* Two-column layout */}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card class="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <Show when={orders()} fallback={<Skeleton class="h-48" />}>
              <div class="space-y-3">
                <For each={recentOrders()}>
                  {(order) => (
                    <div class="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {order.userName.charAt(0)}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{order.userName}</p>
                        <p class="text-xs text-muted-foreground truncate">{order.product}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-semibold">{formatCurrency(order.amount)}</p>
                        <Badge variant={statusVariant(order.status)} class="mt-1">
                          {capitalize(order.status)}
                        </Badge>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <Show when={activity()} fallback={<Skeleton class="h-48" />}>
              <div class="space-y-4">
                <For each={activity()}>
                  {(item) => (
                    <div class="flex gap-3">
                      <div class="text-lg leading-none mt-0.5">{activityIcon[item.type]}</div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs text-foreground leading-relaxed">{item.message}</p>
                        <p class="text-xs text-muted-foreground mt-1">{formatRelativeTime(item.time)}</p>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </Show>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
