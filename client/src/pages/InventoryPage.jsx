import QuickActions from "../components/QuickActions";
import InventoryToolbar from "../components/InventoryToolbar";
import InventoryTable from "../components/InventoryTable";

import { listProducts } from "../api/products";
import { listCategories } from "../api/categories";

import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      setError(false);
      setLoading(true);

      try {
        const productsData = await listProducts();
        const categoriesData = await listCategories();

        if (!Array.isArray(productsData) || !Array.isArray(categoriesData)) {
          throw new Error("Invalid data shape");
        }

        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  let filteredProducts = [];

  if (error === false) {
    filteredProducts = products.filter(
      (product) =>
        searchFilter === "" ||
        product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (product.skuOrBarcode || "").toLowerCase().includes(searchFilter.toLowerCase()),
    );

    if (categoryFilter != "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.categoryId === categoryFilter,
      );
    }
  }

  return (
    <div data-testid="inventory-page" style={{ display: "flex", flexDirection: "column" }}>
      <h1>Inventory Page</h1>
      <QuickActions actions={[{ label: "Add Item", path: "new" }]} />
      <InventoryToolbar
        setSearchFilter={setSearchFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
      />
      <InventoryTable products={filteredProducts} />
      {loading && <div data-testid="loading">Loading...</div>}
      {error && <div role="alert">Error: Whilst Attempting To Load...</div>}
    </div>
  );
}
