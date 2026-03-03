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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      const productsData = await listProducts();
      const categoriesData = await listCategories();

      setProducts(productsData);
      setCategories(categoriesData);
      setLoading(false);
    }
    load();
  }, []);

  let filteredProducts = products.filter(
    (product) =>
      searchFilter === "" ||
      product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (product.skuOrBarcode || "").toLowerCase().includes(searchFilter.toLowerCase()),
  );

  if (categoryFilter != "all") {
    filteredProducts = filteredProducts.filter((product) => product.categoryId === categoryFilter);
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
    </div>
  );
}
