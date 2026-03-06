import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { listCategories } from "../api/categories";
import { updateProduct } from "../api/products";

export default function ProductEditPage() {
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [fetchError, setFetchError] = useState(false);
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

      try {
        const categoryData = await listCategories();

        if (!Array.isArray(categoryData)) {
          throw new Error("Invalid category data shape");
        }

        setCategories(categoryData);
      } catch {
        setFetchError(true);
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
    await updateProduct(id, values);
  }

  return (
    <div data-testid="product-edit-page">
      <h1>Product Edit Page</h1>
      <h3>
        ID: <span>{id}</span>
      </h3>

      <form
        onSubmit={onSubmit}
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "5px" }}
      >
        <label>
          Name
          <input name="name" value={values.name} onChange={onChange} />
        </label>

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

        <label>
          SKU or Barcode
          <input name="skuOrBarcode" value={values.skuOrBarcode} onChange={onChange} />
        </label>

        <label>
          Unit
          <input name="unit" value={values.unit} onChange={onChange} />
        </label>

        <label>
          Price
          <input name="price" value={values.price} onChange={onChange} />
        </label>

        <label>
          Reorder Level
          <input name="reorderLevel" value={values.reorderLevel} onChange={onChange} />
        </label>

        <button type="submit" style={{ alignSelf: "flex-start", placeSelf: "center" }}>
          Save
        </button>
      </form>
    </div>
  );
}
