import { type User, type Order, type Product, type DashboardStats, type Activity } from "../types";
import { generateUsers, generateOrders, generateProducts, generateStats, generateActivity } from "./mockData";

// Seeded data store (persists during the session)
const USERS = generateUsers(50);
const ORDERS = generateOrders(USERS, 120);
const PRODUCTS = generateProducts();
const STATS = generateStats(ORDERS, USERS);
const ACTIVITY = generateActivity(USERS, ORDERS);

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));
}

// --- Users API ---
export async function fetchUsers(): Promise<User[]> {
  await delay();
  return [...USERS];
}

export async function fetchUser(id: string): Promise<User | undefined> {
  await delay(200);
  return USERS.find(u => u.id === id);
}

export async function createUser(data: Omit<User, "id" | "avatar" | "joinedAt" | "lastActive" | "revenue">): Promise<User> {
  await delay();
  const newUser: User = {
    ...data,
    id: `usr_${(USERS.length + 1).toString().padStart(4, "0")}`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=6366f1&color=fff&size=40`,
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    revenue: 0,
  };
  USERS.unshift(newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  await delay();
  const idx = USERS.findIndex(u => u.id === id);
  if (idx === -1) throw new Error("User not found");
  USERS[idx] = { ...USERS[idx], ...data };
  return USERS[idx];
}

export async function deleteUser(id: string): Promise<void> {
  await delay();
  const idx = USERS.findIndex(u => u.id === id);
  if (idx !== -1) USERS.splice(idx, 1);
}

// --- Orders API ---
export async function fetchOrders(): Promise<Order[]> {
  await delay();
  return [...ORDERS];
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<Order> {
  await delay();
  const idx = ORDERS.findIndex(o => o.id === id);
  if (idx === -1) throw new Error("Order not found");
  ORDERS[idx] = { ...ORDERS[idx], status, updatedAt: new Date().toISOString() };
  return ORDERS[idx];
}

// --- Products API ---
export async function fetchProducts(): Promise<Product[]> {
  await delay();
  return [...PRODUCTS];
}

// --- Dashboard ---
export async function fetchDashboardStats(): Promise<DashboardStats> {
  await delay(300);
  return { ...STATS };
}

export async function fetchActivity(): Promise<Activity[]> {
  await delay(200);
  return [...ACTIVITY];
}
