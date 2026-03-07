import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { listCategories } from "../api/categories";
import { archiveProduct, updateProduct, getProduct } from "../api/products";

import validateProductPayload from "../validation/validateProductPayload";

const initialValues = {
  name: "",
  categoryId: "",
  skuOrBarcode: "",
  unit: "",
  price: "",
  reorderLevel: "",
};

export default function ProductEditPage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(false);

  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState(initialValues);

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFetchError(false);

      try {
        const productData = await getProduct(id);
        const categoryData = await listCategories();

        if (!Array.isArray(categoryData) || typeof productData !== "object") {
          throw new Error("Invalid category data shape");
        }

        setValues(productData);
        setCategories(categoryData);
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

    const validatedPayload = validateProductPayload(values);

    if (validatedPayload.errors) {
      setErrors(validatedPayload.errors);
      return;
    }

    setErrors({});

    await updateProduct(id, validatedPayload.data);
    navigate("/inventory");
  }

  async function onArchive(e) {
    e.preventDefault();
    await archiveProduct(id);
    navigate("/inventory");
  }

  return (
    <div data-testid="product-edit-page">
      <h1>Product Edit Page</h1>

      <h3>
        ID: <span>{id}</span>
        <button
          onClick={onArchive}
          style={{
            alignSelf: "flex-start",
            placeSelf: "center",
            backgroundColor: "yellow",
            fontWeight: "bolder",
          }}
        >
          Archive
        </button>
      </h3>

      {loading && <div data-testid="loading">Loading...</div>}

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "5px" }}
      >
        <label>
          Name
          <input name="name" value={values.name} onChange={onChange} />
        </label>

        {errors.name ? <span role="alert">{errors.name}</span> : null}

        {fetchError && <span role="alert">Error: Fetching Categories</span>}

        <label>
          Category
          <select name="categoryId" value={values.categoryId} onChange={onChange}>
            <option value="">--Select a category --</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {errors.categoryId ? <span role="alert">{errors.categoryId}</span> : null}

        <label>
          SKU or Barcode
          <input name="skuOrBarcode" value={values.skuOrBarcode} onChange={onChange} />
        </label>

        <label>
          Unit
          <input name="unit" value={values.unit} onChange={onChange} />
        </label>

        {errors.unit ? <span role="alert">{errors.unit}</span> : null}

        <label>
          Price
          <input name="price" value={values.price} onChange={onChange} />
        </label>

        {errors.price ? <span role="alert">{errors.price}</span> : null}

        <label>
          Reorder Level
          <input name="reorderLevel" value={values.reorderLevel} onChange={onChange} />
        </label>

        {errors.reorderLevel ? <span role="alert">{errors.reorderLevel}</span> : null}

        <button type="submit" style={{ alignSelf: "flex-start", placeSelf: "center" }}>
          Save
        </button>
      </form>
    </div>
  );
}
