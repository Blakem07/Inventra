export default function LineItemRow({
  itemValues,
  products,
  submitted,
  error,
  onChange,
  onRemove,
}) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  return (
    <fieldset
      aria-label="sale item"
      style={{ display: "flex", gap: "8px", alignItems: "flex-start", justifyContent: "center" }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>
          Product
          <select name="productId" value={itemValues.productId} onChange={handleChange}>
            <option value="">-- Choose a product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        {submitted && !itemValues.productId && (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            Product is required
          </span>
        )}
        {error && (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            {error}
          </span>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>
          Quantity
          <input
            type="number"
            name="quantity"
            min="1"
            step="1"
            value={itemValues.quantity}
            onChange={handleChange}
          />
        </label>
        {Number(itemValues.quantity) < 1 && (
          <span style={{ color: "red", fontSize: "0.85rem" }}>Quantity above 0 is required</span>
        )}
      </div>

      <button type="button" aria-label="Delete item" onClick={onRemove}>
        Delete
      </button>
    </fieldset>
  );
}
