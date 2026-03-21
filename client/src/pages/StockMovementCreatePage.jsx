import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listProducts } from "../api/products";
import { createStockMovement } from "../api/stock";
import validateStockMovementPayload from "../validation/validateStockMovementPayload";

import SubPageHeader from "@/components/SubPageHeader";

import { StockMovementForm } from "../components/StockMovementForm";

const initialValues = {
  productId: "",
  movementType: "",
  quantity: "1",
  performedBy: "",
  reason: "",
  note: "",
};

export default function StockMovementPage() {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [products, setProducts] = useState([]);

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
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

  function onChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const validatedPayload = validateStockMovementPayload(values);

    if (validatedPayload.errors) {
      setErrors(validatedPayload.errors);
      return;
    }

    setErrors({});

    try {
      await createStockMovement(validatedPayload.data);
      navigate("/");
    } catch (error) {
      if (error.status === 422) {
        setErrors((prev) => ({
          ...prev,
          oversell: error.message,
        }));

        return;
      }

      if (error.status >= 400 && error.status < 500) {
        setErrors((prev) => ({
          ...prev,
          form: "Something went wrong.",
        }));

        return;
      }
    }

    return;
  }

  return (
    <div data-testid="stock-movement-create-page" className="space-y-4">
      <SubPageHeader
        badge="Stock"
        title="Create Stock Movement"
        description="Record a new stock movement event with product, quantity, and transaction details."
        testId="stock-movement-create-page-heading"
      />

      {loading && <div data-testid="loading">Loading...</div>}
      {fetchError && <div data-testid="error">Error: Fetching Data.</div>}

      <StockMovementForm
        values={values}
        errors={errors}
        products={products}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
