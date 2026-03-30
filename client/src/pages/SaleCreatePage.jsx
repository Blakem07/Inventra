import { useState, useEffect } from "react";

import { listProducts } from "../api/products";

import SalesForm from "../components/SaleForm";
import SubPageHeader from "../components/SubPageHeader";

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
    <div data-testid="sale-create-page" className="space-y-4">
      <SubPageHeader
        title="Create Sale"
        description="Record a new sale with line items, payment method, and transaction details."
      />

      {loading && (
        <span role="alert" data-testid="sale-create-page-loading">
          Loading...
        </span>
      )}

      {fetchError && (
        <span role="alert" data-testid="sale-create-page-error">
          Error: Fetching Products
        </span>
      )}

      <section aria-labelledby="sale-form-heading">
        <h2 id="sale-form-heading" className="sr-only">
          Sale Form
        </h2>
        <SalesForm products={products} />
      </section>
    </div>
  );
}
