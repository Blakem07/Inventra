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
  const [error, setError] = useState(false);
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

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <section
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "4px",
            flex: 1,
          }}
        >
          <h2>Filters</h2>
          <InventoryToolbar
            setSearchFilter={setSearchFilter}
            setCategoryFilter={setCategoryFilter}
            categories={categories}
          />
        </section>

        <section
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "4px",
            flex: 1,
          }}
        >
          <h2>Quick Action</h2>
          <QuickActions actions={[{ label: "Add Item", path: "new" }]} />
        </section>
      </div>

      <section
        style={{
          border: "1px solid #ccc",
          padding: "16px",
          marginBottom: "16px",
          borderRadius: "4px",
        }}
      >
        <h2>Inventory</h2>
        <InventoryTable products={filteredProducts} />
        {loading && <div data-testid="loading">Loading...</div>}
        {error && <div role="alert">Error: Whilst Attempting To Load...</div>}
      </section>
    </div>
  );
}
