import { type Component, createResource, For, Show } from "solid-js";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchOrders, fetchUsers } from "../api/client";
import { formatCurrency } from "../lib/utils";

export const AnalyticsPage: Component = () => {
  const [orders] = createResource(fetchOrders);
  const [users] = createResource(fetchUsers);

  const stats = () => {
    const o = orders() ?? [];
    const u = users() ?? [];
    const byStatus = o.reduce((acc, ord) => {
      acc[ord.status] = (acc[ord.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = o.reduce((acc, ord) => {
      acc[ord.category] = (acc[ord.category] ?? 0) + ord.amount;
      return acc;
    }, {} as Record<string, number>);

    const topUsers = [...u]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const monthlyRevenue = o.reduce((acc, ord) => {
      const month = new Date(ord.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" });
      acc[month] = (acc[month] ?? 0) + ord.amount;
      return acc;
    }, {} as Record<string, number>);

    return { byStatus, byCategory, topUsers, monthlyRevenue };
  };

  const statusColors: Record<string, string> = {
    delivered: "bg-green-500",
    shipped: "bg-blue-500",
    processing: "bg-yellow-500",
    pending: "bg-gray-400",
    cancelled: "bg-red-500",
  };

  return (
    <Layout title="Analytics" subtitle="Insights and performance metrics">
      <Show when={orders() && users()} fallback={
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <For each={[1,2,3,4]}>{() => <Skeleton class="h-64" />}</For>
        </div>
      }>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
              <CardDescription>Breakdown of all orders by current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <For each={Object.entries(stats().byStatus).sort((a,b) => b[1]-a[1])}>
                  {([status, count]) => {
                    const total = orders()!.length;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                          <span class="font-medium capitalize">{status}</span>
                          <span class="text-muted-foreground">{count} <span class="text-xs">({pct}%)</span></span>
                        </div>
                        <div class="h-2 rounded-full bg-muted overflow-hidden">
                          <div class={`h-full rounded-full ${statusColors[status] ?? "bg-primary"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </CardContent>
          </Card>

          {/* Revenue by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Total revenue generated per product category</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <For each={Object.entries(stats().byCategory).sort((a,b) => b[1]-a[1])}>
                  {([category, revenue]) => {
                    const max = Math.max(...Object.values(stats().byCategory));
                    const pct = Math.round((revenue / max) * 100);
                    return (
                      <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                          <span class="font-medium capitalize">{category}</span>
                          <span class="text-muted-foreground">{formatCurrency(revenue)}</span>
                        </div>
                        <div class="h-2 rounded-full bg-muted overflow-hidden">
                          <div class="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </CardContent>
          </Card>

          {/* Top Users */}
          <Card>
            <CardHeader>
              <CardTitle>Top Users by Revenue</CardTitle>
              <CardDescription>Highest spending users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <For each={stats().topUsers}>
                  {(user, idx) => (
                    <div class="flex items-center gap-3">
                      <div class="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {idx() + 1}
                      </div>
                      <img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full" />
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{user.name}</p>
                        <p class="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <span class="font-semibold text-sm">{formatCurrency(user.revenue)}</span>
                    </div>
                  )}
                </For>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Revenue breakdown over recent months</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="space-y-3">
                <For each={Object.entries(stats().monthlyRevenue).slice(-6).reverse()}>
                  {([month, revenue]) => {
                    const allValues = Object.values(stats().monthlyRevenue);
                    const max = Math.max(...allValues);
                    const pct = Math.round((revenue / max) * 100);
                    return (
                      <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                          <span class="font-medium">{month}</span>
                          <span class="text-muted-foreground">{formatCurrency(revenue)}</span>
                        </div>
                        <div class="h-2 rounded-full bg-muted overflow-hidden">
                          <div class="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </CardContent>
          </Card>
        </div>
      </Show>
    </Layout>
  );
};
