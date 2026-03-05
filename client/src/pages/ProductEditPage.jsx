import { useParams } from "react-router-dom";
import { listCategories } from "../api/categories";
import { useEffect, useState } from "react";

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
          throw new Error("Error: Invalid Data Shape");
        }

        setCategories(categoryData);
      } catch {
        setFetchError(true);
      }
    }
    load();
  }, []);

  function onChange() {}

  return (
    <div data-testid="product-edit-page">
      <h1>Product Edit Page</h1>
      <h3>
        ID: <span>{id}</span>
      </h3>
      <form
        method="PATCH"
        style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "5px" }}
      >
        <label>
          Name
          <input></input>
        </label>
        <label>
          Category
          <select name="category" onChange={onChange}>
            <option value="">--Select a category --</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          SKU or Barcode<input></input>
        </label>
        <label>
          Unit <input></input>
        </label>
        <label>
          Price <input></input>
        </label>
        <label>
          Reorder Level <input></input>
        </label>
        <button type="submit" style={{ alignSelf: "flex-start", placeSelf: "center" }}>
          Save
        </button>
      </form>
    </div>
  );
}
