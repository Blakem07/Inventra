import { useState, useEffect } from "react";

import { listProducts } from "../api/products";

import SalesForm from "../components/SaleForm";

export default function SaleCreatePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function load() {
      setFetchError(false);
      setLoading(true);
      try {
        const productsData = await listProducts();

        if (!Array.isArray(productsData)) {
          throw new Error("Invalid Data Shape");
        }

        setProducts(productsData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div data-testid="sale-create-page">
      <h1>Sale Create Page</h1>
      {loading && <div data-testid="loading">Loading...</div>}
      {fetchError && <div role="alert">Error: Fetching Products</div>}
      <SalesForm products={products} />
    </div>
  );
}
