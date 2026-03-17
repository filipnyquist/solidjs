import { type Component, createResource, createSignal, For, Show } from "solid-js";
import { createSolidTable, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, type SortingState, type ColumnFiltersState, type ColumnDef } from "@tanstack/solid-table";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchUsers, createUser, updateUser, deleteUser } from "../api/client";
import { type User } from "../types";
import { addToast } from "../store/toastStore";
import { formatDate, formatCurrency, capitalize, cn } from "../lib/utils";
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-solid";

const statusVariant = (s: User["status"]): "success" | "destructive" | "warning" => ({
  active: "success" as const, inactive: "destructive" as const, pending: "warning" as const,
}[s]);

const roleVariant = (r: User["role"]): "default" | "secondary" | "outline" => ({
  admin: "default" as const, moderator: "secondary" as const, user: "outline" as const,
}[r]);

interface UserFormData {
  name: string;
  email: string;
  role: User["role"];
  status: User["status"];
}

const emptyForm: UserFormData = { name: "", email: "", role: "user", status: "active" };

export const UsersPage: Component = () => {
  const [users, { mutate }] = createResource(fetchUsers);
  const [sorting, setSorting] = createSignal<SortingState>([]);
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = createSignal("");
  const [showModal, setShowModal] = createSignal(false);
  const [editingUser, setEditingUser] = createSignal<User | null>(null);
  const [deleteTarget, setDeleteTarget] = createSignal<User | null>(null);
  const [form, setForm] = createSignal<UserFormData>(emptyForm);
  const [saving, setSaving] = createSignal(false);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: (info) => {
        const user = info.row.original;
        return (
          <div class="flex items-center gap-3">
            <img src={user.avatar} alt={user.name} class="w-8 h-8 rounded-full object-cover" />
            <div>
              <p class="font-medium text-sm">{user.name}</p>
              <p class="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: (info) => <Badge variant={roleVariant(info.getValue() as User["role"])}>{capitalize(info.getValue() as string)}</Badge>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => <Badge variant={statusVariant(info.getValue() as User["status"])}>{capitalize(info.getValue() as string)}</Badge>,
    },
    {
      accessorKey: "revenue",
      header: "Revenue",
      cell: (info) => <span class="font-medium">{formatCurrency(info.getValue() as number)}</span>,
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: (info) => <span class="text-muted-foreground text-sm">{formatDate(info.getValue() as string)}</span>,
    },
    {
      id: "actions",
      header: "",
      cell: (info) => {
        const user = info.row.original;
        return (
          <div class="flex items-center gap-1 justify-end">
            <Button variant="ghost" size="icon" onClick={() => openEdit(user)}>
              <Pencil class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(user)} class="text-destructive hover:text-destructive">
              <Trash2 class="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = createSolidTable({
    get data() { return users() ?? []; },
    columns,
    state: {
      get sorting() { return sorting(); },
      get columnFilters() { return columnFilters(); },
      get globalFilter() { return globalFilter(); },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  function openEdit(user: User) {
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, role: user.role, status: user.status });
    setShowModal(true);
  }

  function openCreate() {
    setEditingUser(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  async function handleSave() {
    const f = form();
    if (!f.name.trim() || !f.email.trim()) {
      addToast({ title: "Validation Error", description: "Name and email are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editingUser()) {
        const updated = await updateUser(editingUser()!.id, f);
        mutate(prev => prev?.map(u => u.id === updated.id ? updated : u));
        addToast({ title: "User updated", description: `${updated.name} has been updated.`, variant: "success" });
      } else {
        const created = await createUser(f);
        mutate(prev => [created, ...(prev ?? [])]);
        addToast({ title: "User created", description: `${created.name} has been added.`, variant: "success" });
      }
      setShowModal(false);
    } catch (e) {
      addToast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const target = deleteTarget();
    if (!target) return;
    try {
      await deleteUser(target.id);
      mutate(prev => prev?.filter(u => u.id !== target.id));
      addToast({ title: "User deleted", description: `${target.name} has been removed.`, variant: "warning" });
      setDeleteTarget(null);
    } catch {
      addToast({ title: "Error", description: "Could not delete user.", variant: "destructive" });
    }
  }

  return (
    <Layout title="Users" subtitle="Manage your user accounts">
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                <Show when={users()}>{users()!.length} total users</Show>
              </CardDescription>
            </div>
            <Button onClick={openCreate}>
              <Plus class="h-4 w-4" />
              Add User
            </Button>
          </div>
          <div class="flex items-center gap-3 mt-4">
            <div class="relative flex-1 max-w-sm">
              <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={globalFilter()}
                onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                class="pl-9"
              />
            </div>
            <Select
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "pending", label: "Pending" },
              ]}
              placeholder="All statuses"
              value={(columnFilters().find(f => f.id === "status")?.value as string) ?? ""}
              onChange={(e) => {
                const v = e.currentTarget.value;
                setColumnFilters(v ? [{ id: "status", value: v }] : []);
              }}
              class="w-40"
            />
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <Show when={users()} fallback={
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
            {/* Pagination */}
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

      {/* Create/Edit Modal */}
      <Modal
        open={showModal()}
        onClose={() => setShowModal(false)}
        title={editingUser() ? "Edit User" : "Create User"}
        description={editingUser() ? "Update the user's information below." : "Fill in the details for the new user."}
      >
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Full Name</label>
            <Input
              placeholder="Jane Doe"
              value={form().name}
              onInput={(e) => setForm(f => ({ ...f, name: e.currentTarget.value }))}
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Email Address</label>
            <Input
              type="email"
              placeholder="jane@example.com"
              value={form().email}
              onInput={(e) => setForm(f => ({ ...f, email: e.currentTarget.value }))}
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Role</label>
              <Select
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "moderator", label: "Moderator" },
                  { value: "user", label: "User" },
                ]}
                value={form().role}
                onChange={(e) => setForm(f => ({ ...f, role: e.currentTarget.value as User["role"] }))}
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Status</label>
              <Select
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "pending", label: "Pending" },
                ]}
                value={form().status}
                onChange={(e) => setForm(f => ({ ...f, status: e.currentTarget.value as User["status"] }))}
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving()}>
              {saving() ? "Saving..." : editingUser() ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget()}
        onClose={() => setDeleteTarget(null)}
        title="Delete User"
        description="This action cannot be undone."
        size="sm"
      >
        <div class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteTarget()?.name}</strong>? This will permanently remove their account and data.
          </p>
          <div class="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};
