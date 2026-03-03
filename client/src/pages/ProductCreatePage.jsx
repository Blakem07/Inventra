import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { listCategories } from "../api/categories";

/**
 * Validate required fields for product creation.
 * @param {object} values
 * @returns {{name?: string, category?: string, price? : string, reorderLevel?: string}}
 */
function validate(values) {
  const errors = {};

  const name = values.name;
  const category = values.category;
  const reorder = values.reorderLevel;
  const price = values.price;

  if (name.trim() === "" || name === undefined || name === null) {
    errors["name"] = "Name is required";
  }

  if (category.trim() === "" || category === undefined || category === null) {
    errors["category"] = "Category is required";
  }

  if (price == null || price.trim() === "" || Number(price) < 0) {
    errors.price = "Price must be 0 or more if provided";
  }

  if (reorder == null || reorder.trim() === "" || Number(reorder) < 0) {
    errors.reorderLevel = "Reorder level must be 0 or more if provided";
  }
  return errors;
}

export default function ProductCreatePage() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    name: "",
    category: "",
    skuOrBarcode: "",
    price: "",
    reorderLevel: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const categoriesData = await listCategories();
        setCategories(categoriesData);
      } catch {
        // Implement error stuff later
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

  function onSubmit(e) {
    e.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    } else if (Object.keys(nextErrors).length === 0) {
      setErrors({});
    }

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
        <label>
          Name
          <input name="name" value={values.name} onChange={onChange} />
        </label>
        {errors.name ? <span role="alert">{errors.name}</span> : null}
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
        {errors.category ? <span role="alert">{errors.category}</span> : null}
        <label>
          SKU or Barcode
          <input name="skuOrBarcode" value={values.skuOrBarcode} onChange={onChange} />
        </label>
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
