import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { listCategories } from "../api/categories";
import { createProduct } from "../api/products";

import validateProductPayload from "../validation/validateProductPayload";

export default function ProductCreatePage() {
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    name: "",
    categoryId: "",
    skuOrBarcode: "",
    unit: "",
    price: "",
    reorderLevel: "",
  });

  useEffect(() => {
    async function load() {
      setFetchError(false);
      setLoading(true);
      try {
        const categoriesData = await listCategories();

        if (!Array.isArray(categoriesData)) {
          throw new Error("Invalid Data Shape");
        }
        setCategories(categoriesData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const validatedPayload = validateProductPayload(values);

    if (validatedPayload.errors) {
      setErrors(validatedPayload.errors);
      return;
    }

    setErrors({});

    await createProduct(validatedPayload.data);
    navigate("/inventory");
  }

  return (
    <div data-testid="product-create-page">
      <h1>Product Create Page</h1>
      <form
        method="POST"
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "5px" }}
      >
        {loading && <div data-testid="loading">Loading...</div>}

        <label>
          Name
          <input name="name" value={values.name} onChange={onChange} />
        </label>
        {errors.name ? (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            {errors.name}
          </span>
        ) : null}
        {fetchError && (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            Error: Fetching Categories
          </span>
        )}
        <label>
          Category
          <select name="categoryId" onChange={onChange}>
            <option value="">--Select a category --</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        {errors.categoryId ? (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            {errors.categoryId}
          </span>
        ) : null}
        <label>
          SKU or Barcode
          <input name="skuOrBarcode" value={values.skuOrBarcode} onChange={onChange} />
        </label>
        <label>
          Unit
          <input name="unit" value={values.unit} onChange={onChange} />
        </label>
        {errors.unit ? (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            {errors.unit}
          </span>
        ) : null}
        <label>
          Price
          <input name="price" value={values.price} onChange={onChange} />
        </label>
        {errors.price ? (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            {errors.price}
          </span>
        ) : null}
        <label>
          Reorder Level
          <input name="reorderLevel" value={values.reorderLevel} onChange={onChange} />
        </label>
        {errors.reorderLevel ? (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            {errors.reorderLevel}
          </span>
        ) : null}
        <button type="submit" style={{ alignSelf: "flex-start", placeSelf: "center" }}>
          Save
        </button>
      </form>
    </div>
  );
}
