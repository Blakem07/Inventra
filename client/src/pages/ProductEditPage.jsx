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
  }, [id]);

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

      <h3 style={{ display: "flex", placeSelf: "center", alignItems: "center", gap: 12 }}>
        <span>
          ID: <span>{id}</span>
        </span>
        <button onClick={onArchive} style={archiveButtonStyle}>
          Archive
        </button>
      </h3>

      {loading && <div data-testid="loading">Loading...</div>}

      <form onSubmit={onSubmit} style={containerStyle}>
        <label style={fieldStyle}>
          <span style={labelTextStyle}>Name</span>
          <input name="name" value={values.name} onChange={onChange} style={inputStyle} />
        </label>

        {errors.name ? (
          <div role="alert" style={errorStyle}>
            {errors.name}
          </div>
        ) : null}

        {fetchError && (
          <div role="alert" style={errorStyle}>
            Error: Fetching Categories
          </div>
        )}

        <label style={fieldStyle}>
          <span style={labelTextStyle}>Category</span>
          <select
            name="categoryId"
            value={values.categoryId}
            onChange={onChange}
            style={inputStyle}
          >
            <option value="">--Select a category --</option>
            {categories.map((category) => (
              <option value={category.id} key={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {errors.categoryId ? (
          <div role="alert" style={errorStyle}>
            {errors.categoryId}
          </div>
        ) : null}

        <label style={fieldStyle}>
          <span style={labelTextStyle}>SKU or Barcode</span>
          <input
            name="skuOrBarcode"
            value={values.skuOrBarcode}
            onChange={onChange}
            style={inputStyle}
          />
        </label>

        <label style={fieldStyle}>
          <span style={labelTextStyle}>Unit</span>
          <input name="unit" value={values.unit} onChange={onChange} style={inputStyle} />
        </label>

        {errors.unit ? (
          <div role="alert" style={errorStyle}>
            {errors.unit}
          </div>
        ) : null}

        <label style={fieldStyle}>
          <span style={labelTextStyle}>Price</span>
          <input name="price" value={values.price} onChange={onChange} style={inputStyle} />
        </label>

        {errors.price ? (
          <div role="alert" style={errorStyle}>
            {errors.price}
          </div>
        ) : null}

        <label style={fieldStyle}>
          <span style={labelTextStyle}>Reorder Level</span>
          <input
            name="reorderLevel"
            value={values.reorderLevel}
            onChange={onChange}
            style={inputStyle}
          />
        </label>

        {errors.reorderLevel ? (
          <div role="alert" style={errorStyle}>
            {errors.reorderLevel}
          </div>
        ) : null}

        <button type="submit" style={buttonStyle}>
          Save
        </button>
      </form>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  border: "1px solid #ccc",
  padding: "16px",
  borderRadius: "4px",
  background: "#fff",
  width: "100%",
  maxWidth: 800,
  boxSizing: "border-box",
  margin: "0 auto",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "8px",
  alignItems: "center",
  marginBottom: "8px",
};

const labelTextStyle = {
  minWidth: 120,
  display: "inline-block",
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  fontFamily: "inherit",
  flex: 1,
  minWidth: 0,
};

const buttonStyle = {
  alignSelf: "center",
  padding: "8px 12px",
  borderRadius: "4px",
  border: "1px solid #000",
  background: "#bdbdbd",
  color: "#000",
  cursor: "pointer",
};

const archiveButtonStyle = {
  alignSelf: "flex-start",
  backgroundColor: "yellow",
  fontWeight: "bolder",
  border: "1px solid #999",
  padding: "6px 10px",
  borderRadius: 4,
  cursor: "pointer",
};

const errorStyle = {
  color: "#d32f2f",
  fontSize: "0.9em",
  marginBottom: "8px",
};
