export function StockMovementForm({ values, errors, products, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} method="POST" style={formStyle}>
      <fieldset aria-label="stock movement details" style={fieldsetStyle}>
        <label htmlFor="product" style={labelStyle}>
          <span style={labelTextStyle}>Product</span>
          <select
            value={values.productId}
            name="productId"
            id="product"
            onChange={onChange}
            style={selectStyle}
          >
            <option value="">-- Choose a product --</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>

        {errors.productId && (
          <span role="alert" style={errorStyle}>
            Product is required
          </span>
        )}

        <fieldset aria-label="Type" style={movementFieldsetStyle}>
          <legend style={legendStyle}>Movement Type</legend>

          <label htmlFor="in" style={radioLabelStyle}>
            <input
              type="radio"
              name="movementType"
              value="IN"
              id="in"
              checked={values.movementType === "IN"}
              onChange={onChange}
            />
            In
          </label>

          <label htmlFor="out" style={radioLabelStyle}>
            <input
              type="radio"
              name="movementType"
              value="OUT"
              id="out"
              checked={values.movementType === "OUT"}
              onChange={onChange}
            />
            Out
          </label>

          <label htmlFor="adjust" style={radioLabelStyle}>
            <input
              type="radio"
              name="movementType"
              value="ADJUST"
              id="adjust"
              checked={values.movementType === "ADJUST"}
              onChange={onChange}
            />
            Adjust
          </label>
        </fieldset>

        {errors.movementType && (
          <span role="alert" style={errorStyle}>
            Movement type is required
          </span>
        )}

        <label htmlFor="quantity" style={labelStyle}>
          <span style={labelTextStyle}>Quantity</span>
          <input
            value={values.quantity}
            type="number"
            name="quantity"
            id="quantity"
            aria-label="Quantity"
            onChange={onChange}
            style={inputStyle}
          />
        </label>

        {errors.oversell && (
          <span role="alert" style={errorStyle}>
            {errors.oversell}
          </span>
        )}

        {errors.quantity && (
          <span role="alert" style={errorStyle}>
            Quantity above 0 is required
          </span>
        )}

        <label htmlFor="performedBy" style={labelStyle}>
          <span style={labelTextStyle}>Performed By</span>
          <input
            value={values.performedBy}
            type="text"
            name="performedBy"
            id="performedBy"
            aria-label="Performed By"
            onChange={onChange}
            style={inputStyle}
          />
        </label>

        {errors.performedBy && (
          <span role="alert" style={errorStyle}>
            Performed by is required
          </span>
        )}

        <label htmlFor="reason" style={labelStyle}>
          <span style={labelTextStyle}>Reason</span>
          <input
            value={values.reason}
            type="text"
            name="reason"
            id="reason"
            aria-label="Reason"
            onChange={onChange}
            style={inputStyle}
          />
        </label>

        <label htmlFor="note" style={labelStyleColumn}>
          <span style={labelTextStyle}>Note</span>
          <textarea
            value={values.note}
            name="note"
            id="note"
            aria-label="Note"
            onChange={onChange}
            style={textareaStyle}
          />
        </label>
      </fieldset>

      <div style={actionsStyle}>
        <button type="submit" aria-label="Confirm Movement" style={confirmButtonStyle}>
          Confirm Movement
        </button>
      </div>

      {errors.form && (
        <span role="alert" style={errorStyle}>
          {errors.form}
        </span>
      )}
    </form>
  );
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  padding: "16px",
  background: "#fff",
  borderRadius: 6,
  border: "1px solid #e0e0e0",
  maxWidth: 900,
  margin: "0 auto",
  boxSizing: "border-box",
};

const fieldsetStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  border: "1px solid #eee",
  padding: "12px",
  borderRadius: 6,
  background: "#fafafa",
};

const movementFieldsetStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
  border: "none",
  padding: 0,
  margin: 0,
};

const legendStyle = {
  marginBottom: 6,
  fontWeight: 600,
};

const labelStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
};

const labelStyleColumn = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "flex-start",
};

const labelTextStyle = {
  minWidth: 120,
  display: "inline-block",
  fontWeight: 600,
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "inherit",
  flex: 1,
  minWidth: 0,
};

const selectStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "inherit",
  background: "#fff",
  flex: 1,
  minWidth: 0,
};

const textareaStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "inherit",
  width: "100%",
  minHeight: 80,
  boxSizing: "border-box",
  resize: "none ",
};

const radioLabelStyle = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  fontSize: "0.95rem",
};

const actionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
};

const confirmButtonStyle = {
  display: "block",
  margin: "auto",
  padding: "10px 14px",
  borderRadius: 6,
  border: "1px solid #000",
  background: "#e0e0e0",
  cursor: "pointer",
  fontWeight: 600,
};

const errorStyle = {
  color: "#d32f2f",
  fontSize: "0.85rem",
};
