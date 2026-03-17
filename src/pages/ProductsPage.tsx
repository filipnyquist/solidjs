import { type Component, createResource, For, Show } from "solid-js";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { fetchProducts } from "../api/client";
import { formatCurrency, capitalize } from "../lib/utils";
import { Star, TrendingUp } from "lucide-solid";
import { type Product } from "../types";

const categoryVariant = (c: Product["category"]): "default" | "secondary" | "success" | "warning" | "outline" => ({
  electronics: "default" as const,
  clothing: "secondary" as const,
  food: "success" as const,
  books: "warning" as const,
  other: "outline" as const,
}[c]);

export const ProductsPage: Component = () => {
  const [products] = createResource(fetchProducts);

  return (
    <Layout title="Products" subtitle="Browse your product catalog">
      <Show when={products()} fallback={
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <For each={[1,2,3,4,5,6,7,8]}>{() => <Skeleton class="h-48" />}</For>
        </div>
      }>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <For each={products()}>
            {(product) => (
              <Card class="hover:shadow-md transition-shadow">
                <CardContent class="pt-6">
                  <div class="flex items-start justify-between mb-3">
                    <Badge variant={categoryVariant(product.category)}>{capitalize(product.category)}</Badge>
                    <div class="flex items-center gap-1 text-yellow-500">
                      <Star class="h-3 w-3 fill-yellow-400 stroke-yellow-400" />
                      <span class="text-xs font-medium text-foreground">{product.rating}</span>
                    </div>
                  </div>
                  <h3 class="font-semibold text-sm mb-1 leading-tight">{product.name}</h3>
                  <p class="text-2xl font-bold text-primary mb-4">{formatCurrency(product.price)}</p>
                  <div class="space-y-2">
                    <div class="flex justify-between text-xs text-muted-foreground">
                      <span>Stock</span>
                      <span class={product.stock < 20 ? "text-destructive font-medium" : "text-foreground font-medium"}>
                        {product.stock} units
                      </span>
                    </div>
                    {/* Stock progress bar */}
                    <div class="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        class={`h-full rounded-full transition-all ${product.stock < 20 ? "bg-destructive" : product.stock < 100 ? "bg-yellow-500" : "bg-green-500"}`}
                        style={{ width: `${Math.min(100, (product.stock / 500) * 100)}%` }}
                      />
                    </div>
                    <div class="flex items-center justify-between text-xs text-muted-foreground">
                      <div class="flex items-center gap-1">
                        <TrendingUp class="h-3 w-3 text-green-500" />
                        <span>{product.sold.toLocaleString()} sold</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </For>
        </div>
      </Show>
    </Layout>
  );
};
