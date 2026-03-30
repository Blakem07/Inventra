import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import PageHeader from "@/components/PageHeader";
import QuickActions from "../components/QuickActions";
import InventoryToolbar from "../components/InventoryToolbar";
import InventoryTable from "../components/InventoryTable";

import { listProducts } from "../api/products";
import { listCategories } from "../api/categories";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { LoadingItem } from "../components/LoadingItem";
import { ErrorItem } from "../components/ErrorItem";

export default function InventoryPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFetchError(false);

      try {
        const productsData = await listProducts();
        const categoriesData = await listCategories();

        if (!Array.isArray(productsData) || !Array.isArray(categoriesData)) {
          throw new Error("Invalid Data Shape");
        }

        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  let filteredProducts = [];

  if (!fetchError) {
    filteredProducts = products.filter(
      (product) =>
        searchFilter === "" ||
        product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (product.skuOrBarcode || "").toLowerCase().includes(searchFilter.toLowerCase()),
    );

    if (categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === categoryFilter,
      );
    }
  }

  if (loading) {
    return (
      <div data-testid="inventory-page" className="space-y-4">
        <PageHeader
          badge="Inventory"
          title="Inventory"
          description="Manage products, filter inventory by category, and quickly add new items."
          testId="inventory-page-heading"
        />

        <LoadingItem testId="inventory-page-loading" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div data-testid="inventory-page" className="space-y-4">
        <PageHeader
          badge="Inventory"
          title="Inventory"
          description="Manage products, filter inventory by category, and quickly add new items."
          testId="inventory-page-heading"
        />
        <ErrorItem testId="inventory-page-error" />
      </div>
    );
  }

  return (
    <div data-testid="inventory-page" className="space-y-4">
      <PageHeader
        badge="Inventory"
        title="Inventory"
        description="Manage products, filter inventory by category, and quickly add new items."
        testId="inventory-page-heading"
      />

      <div className="mb-4 flex gap-4">
        <section aria-labelledby="filters-heading" className="flex-1">
          <Card className="h-full shadow-md">
            <CardHeader>
              <h2
                id="filters-heading"
                data-testid="filters-heading"
                className="text-2xl font-semibold leading-none tracking-tight"
              >
                Filters
              </h2>
            </CardHeader>

            <InventoryToolbar
              setSearchFilter={setSearchFilter}
              setCategoryFilter={setCategoryFilter}
              categoryFilter={categoryFilter}
              categories={categories}
            />
          </Card>
        </section>

        <section aria-labelledby="quick-action-heading" className="flex-1">
          <Card className="h-full shadow-md">
            <CardHeader>
              <h2
                id="quick-action-heading"
                data-testid="quick-action-heading"
                className="text-2xl font-semibold leading-none tracking-tight"
              >
                Quick Action
              </h2>
            </CardHeader>

            <CardContent>
              <QuickActions
                actions={[
                  {
                    label: "Add Item",
                    path: "new",
                    icon: PlusIcon,
                  },
                ]}
              />
            </CardContent>
          </Card>
        </section>
      </div>

      <section aria-labelledby="inventory-table-heading" className="mb-4">
        <Card className="shadow-md">
          <CardHeader>
            <h2
              id="inventory-table-heading"
              data-testid="inventory-table-heading"
              className="text-2xl font-semibold leading-none tracking-tight"
            >
              Inventory
            </h2>
          </CardHeader>

          <CardContent>
            <InventoryTable products={filteredProducts} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
