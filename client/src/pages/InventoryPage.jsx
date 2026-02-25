import QuickActions from "../components/QuickActions";
import InventoryToolbar from "../components/InventoryToolbar";
import InventoryTable from "../components/InventoryTable";

import { testProducts } from "../tests/testProducts";
import { testCategories } from "../tests/testCategories";

import { useState } from "react";

export default function InventoryPage() {
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
    <div data-testid="inventory-page">
      <h1>Inventory Page</h1>
      <QuickActions actions={[{ label: "Add Item", path: "new" }]} />
      <InventoryToolbar
        setSearchFilter={setSearchFilter}
        setCategoryFilter={setCategoryFilter}
        categories={testCategories}
      />
      <InventoryTable products={filteredProducts} />
    </div>
  );
}

const products = testProducts;
