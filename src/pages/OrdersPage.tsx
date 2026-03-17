import { type Component, createResource, createSignal, For, Show } from "solid-js";
import { createSolidTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type SortingState, type ColumnDef } from "@tanstack/solid-table";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchOrders, updateOrderStatus } from "../api/client";
import { type Order } from "../types";
import { addToast } from "../store/toastStore";
import { formatCurrency, formatDate, cn } from "../lib/utils";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-solid";

export const OrdersPage: Component = () => {
  const [orders, { mutate }] = createResource(fetchOrders);
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [globalFilter, setGlobalFilter] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");

  const filteredOrders = () => {
    let data = orders() ?? [];
    if (statusFilter()) data = data.filter(o => o.status === statusFilter());
    return data;
  };

  const columns: ColumnDef<Order>[] = [
    { accessorKey: "id", header: "Order ID", cell: (i) => <span class="font-mono text-xs">{i.getValue() as string}</span> },
    { accessorKey: "userName", header: "Customer" },
    { accessorKey: "product", header: "Product", cell: (i) => (
      <div>
        <p class="font-medium text-sm">{i.getValue() as string}</p>
        <p class="text-xs text-muted-foreground capitalize">{i.row.original.category}</p>
      </div>
    )},
    { accessorKey: "amount", header: "Amount", cell: (i) => <span class="font-semibold">{formatCurrency(i.getValue() as number)}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: (i) => {
        const order = i.row.original;
        return (
          <Select
            options={[
              { value: "pending", label: "Pending" },
              { value: "processing", label: "Processing" },
              { value: "shipped", label: "Shipped" },
              { value: "delivered", label: "Delivered" },
              { value: "cancelled", label: "Cancelled" },
            ]}
            value={order.status}
            onChange={async (e) => {
              const newStatus = e.currentTarget.value as Order["status"];
              try {
                const updated = await updateOrderStatus(order.id, newStatus);
                mutate(prev => prev?.map(o => o.id === updated.id ? updated : o));
                addToast({ title: "Order updated", description: `Order ${order.id} is now ${newStatus}.`, variant: "success" });
              } catch {
                addToast({ title: "Error", description: "Could not update order status.", variant: "destructive" });
              }
            }}
            class="w-36 h-7 text-xs"
          />
        );
      },
    },
    { accessorKey: "createdAt", header: "Date", cell: (i) => <span class="text-muted-foreground text-sm">{formatDate(i.getValue() as string)}</span> },
  ];

  const table = createSolidTable({
    get data() { return filteredOrders(); },
    columns,
    state: {
      get sorting() { return sorting(); },
      get globalFilter() { return globalFilter(); },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const statusCounts = () => {
    const data = orders() ?? [];
    return {
      total: data.length,
      pending: data.filter(o => o.status === "pending").length,
      processing: data.filter(o => o.status === "processing").length,
      delivered: data.filter(o => o.status === "delivered").length,
      cancelled: data.filter(o => o.status === "cancelled").length,
    };
  };

  return (
    <Layout title="Orders" subtitle="Track and manage all orders">
      {/* Summary badges */}
      <div class="flex flex-wrap gap-3 mb-6">
        {([
          ["All", ""],
          ["Pending", "pending"],
          ["Processing", "processing"],
          ["Delivered", "delivered"],
          ["Cancelled", "cancelled"],
        ] as [string, string][]).map(([label, value]) => (
          <button
            onClick={() => setStatusFilter(value)}
            class={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors",
              statusFilter() === value ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:bg-muted"
            )}
          >
            {label}
            <span class="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-xs font-mono">
              {value === "" ? statusCounts().total : (statusCounts() as Record<string, number>)[value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>Update order statuses and track fulfilment</CardDescription>
            </div>
            <div class="relative">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                value={globalFilter()}
                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                class="pl-9 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <Show when={orders()} fallback={
            <div class="p-6 space-y-3">
              <For each={[1,2,3,4,5]}>{() => <Skeleton class="h-12" />}</For>
            </div>
          }>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <For each={table.getHeaderGroups()}>
                    {(hg) => (
                      <tr class="border-b border-border bg-muted/30">
                        <For each={hg.headers}>
                          {(header) => (
                            <th
                              class={cn("px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wide", header.column.getCanSort() && "cursor-pointer select-none hover:text-foreground")}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <div class="flex items-center gap-1">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.getIsSorted() === "asc" && <ChevronUp class="h-3 w-3" />}
                                {header.column.getIsSorted() === "desc" && <ChevronDown class="h-3 w-3" />}
                              </div>
                            </th>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </thead>
                <tbody>
                  <For each={table.getRowModel().rows}>
                    {(row) => (
                      <tr class="border-b border-border hover:bg-muted/30 transition-colors">
                        <For each={row.getVisibleCells()}>
                          {(cell) => (
                            <td class="px-4 py-3">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          )}
                        </For>
                      </tr>
                    )}
                  </For>
                </tbody>
              </table>
            </div>
            <div class="flex items-center justify-between px-4 py-3 border-t border-border">
              <p class="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({table.getFilteredRowModel().rows.length} results)
              </p>
              <div class="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                  <ChevronLeft class="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                  <ChevronRight class="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Show>
        </CardContent>
      </Card>
    </Layout>
  );
};
