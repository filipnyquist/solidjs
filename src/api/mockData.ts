import { type User, type Order, type Product, type DashboardStats, type Activity } from "../types";

const firstNames = ["Alice", "Bob", "Carol", "David", "Eva", "Frank", "Grace", "Henry", "Iris", "Jack", "Kate", "Liam", "Maya", "Noah", "Olivia", "Paul", "Quinn", "Rachel", "Sam", "Tara"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Wilson", "Anderson", "Taylor", "Thomas", "Moore", "Martin", "Jackson", "Lee", "Harris", "Clark", "Lewis", "Walker"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "company.io", "tech.dev", "startup.co"];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(1, daysBack));
  return d.toISOString();
}

function generateAvatar(name: string): string {
  const colors = ["6366f1", "8b5cf6", "ec4899", "f97316", "14b8a6", "3b82f6", "ef4444", "22c55e"];
  const color = randomItem(colors);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=fff&size=40`;
}

const roles: User["role"][] = ["admin", "user", "user", "user", "moderator", "user"];
const statuses: User["status"][] = ["active", "active", "active", "inactive", "pending", "active"];

export function generateUsers(count = 50): User[] {
  return Array.from({ length: count }, (_, i) => {
    const first = randomItem(firstNames);
    const last = randomItem(lastNames);
    const name = `${first} ${last}`;
    return {
      id: `usr_${(i + 1).toString().padStart(4, "0")}`,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@${randomItem(domains)}`,
      role: randomItem(roles),
      status: randomItem(statuses),
      avatar: generateAvatar(name),
      joinedAt: randomDate(365),
      lastActive: randomDate(30),
      revenue: randomInt(0, 15000),
    };
  });
}

const products = ["MacBook Pro", "iPhone 15", "AirPods Pro", "iPad Air", "Samsung Galaxy", "Sony Headphones", "Nike Air Max", "Levi's Jeans", "Python Cookbook", "JavaScript Guide", "Organic Coffee", "Wireless Mouse", "Mechanical Keyboard", "4K Monitor", "USB-C Hub"];
const categories: Order["category"][] = ["electronics", "electronics", "electronics", "electronics", "electronics", "electronics", "clothing", "clothing", "books", "books", "food", "electronics", "electronics", "electronics", "electronics"];
const orderStatuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "delivered", "delivered", "cancelled"];

export function generateOrders(users: User[], count = 100): Order[] {
  return Array.from({ length: count }, (_, i) => {
    const user = randomItem(users);
    const productIdx = randomInt(0, products.length - 1);
    const createdAt = randomDate(90);
    return {
      id: `ord_${(i + 1).toString().padStart(5, "0")}`,
      userId: user.id,
      userName: user.name,
      product: products[productIdx],
      category: categories[productIdx],
      amount: randomInt(15, 2500),
      status: randomItem(orderStatuses),
      createdAt,
      updatedAt: new Date(new Date(createdAt).getTime() + randomInt(0, 86400000 * 5)).toISOString(),
    };
  });
}

export function generateProducts(): Product[] {
  return products.map((name, i) => ({
    id: `prod_${(i + 1).toString().padStart(3, "0")}`,
    name,
    category: categories[i],
    price: randomInt(15, 2500),
    stock: randomInt(0, 500),
    sold: randomInt(10, 2000),
    rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
  }));
}

export function generateStats(orders: Order[], users: User[]): DashboardStats {
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  return {
    totalRevenue,
    revenueChange: Number((Math.random() * 30 - 10).toFixed(1)),
    totalUsers: users.length,
    usersChange: Number((Math.random() * 20).toFixed(1)),
    totalOrders: orders.length,
    ordersChange: Number((Math.random() * 15 - 5).toFixed(1)),
    activeProducts: products.length,
    productsChange: Number((Math.random() * 10).toFixed(1)),
  };
}

export function generateActivity(users: User[], orders: Order[]): Activity[] {
  const activities: Activity[] = [];
  for (let i = 0; i < 10; i++) {
    const type = randomItem(["order", "user", "product", "alert"] as Activity["type"][]);
    const user = randomItem(users);
    const order = randomItem(orders);
    const msgs: Record<Activity["type"], string> = {
      order: `${user.name} placed order ${order.id} for $${order.amount}`,
      user: `${user.name} joined the platform`,
      product: `Stock low for ${randomItem(products)}`,
      alert: `Payment failed for order ${order.id}`,
    };
    activities.push({
      id: `act_${i}`,
      type,
      message: msgs[type],
      time: randomDate(2),
      userId: user.id,
    });
  }
  return activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
}
