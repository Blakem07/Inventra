import { useState } from "react";
import { useNavigate } from "react-router-dom";
import createSale from "../api/sale";

import validateSalePayload from "../validation/validateSalePayload";

import LineItemRow from "./LineItemRow";

const initialValues = {
  performedBy: "",
  paymentMethod: "",
  note: "",
  items: [{ productId: "", quantity: "1" }],
};

export default function SalesForm({ products = [] }) {
  const [submitted, setSubmitted] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddItem(e) {
    e.preventDefault();

    setValues((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: "1" }],
    }));
  }

  function handleLineItemChange(index, field, value) {
    setValues((current) => ({
      ...current,
      items: current.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }

  function handleRemoveItem(indexToRemove) {
    setValues((prev) => {
      if (prev.items.length === 1) return prev;

      return {
        ...prev,
        items: prev.items.filter((_, index) => index !== indexToRemove),
      };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    const validatedPayload = validateSalePayload(values);

    if (validatedPayload.errors) {
      setErrors(validatedPayload.errors);
      return;
    }

    setErrors({});

    try {
      await createSale(validatedPayload.data);
      navigate("/");
    } catch (error) {
      if (error.status === 422) {
        setErrors((prev) => ({
          ...prev,
          [error.productId]: error.message,
        }));
        return;
      }

      setErrors({
        form: "Unexpected error. Please try again.",
      });
    }

    return;
  }

  return (
    <form method="POST" onSubmit={onSubmit} style={formStyle}>
      <div style={itemsContainerStyle}>
        {values.items.map((item, index) => (
          <LineItemRow
            key={index}
            itemValues={item}
            products={products}
            error={errors[item.productId]}
            submitted={submitted}
            onChange={(field, value) => handleLineItemChange(index, field, value)}
            onRemove={() => handleRemoveItem(index)}
          />
        ))}
      </div>

      <div style={rowStyle}>
        <button onClick={handleAddItem} style={addButtonStyle}>
          Add Item +
        </button>
      </div>

      <fieldset aria-label="transaction details" style={fieldsetStyle}>
        <label style={labelStyle}>
          <span style={labelTextStyle}>Performed By</span>
          <input
            name="performedBy"
            type="text"
            value={values.performedBy}
            onChange={onChange}
            style={inputStyle}
          />
        </label>

        {errors.performedBy && (
          <span role="alert" style={errorStyle}>
            Performed By is required
          </span>
        )}

        <fieldset style={paymentFieldsetStyle}>
          <legend style={legendStyle}>Payment Method</legend>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash"
              checked={values.paymentMethod === "Cash"}
              onChange={onChange}
            />
            Cash
          </label>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="paymentMethod"
              value="GCash"
              checked={values.paymentMethod === "GCash"}
              onChange={onChange}
            />
            GCash
          </label>

          <label style={radioLabelStyle}>
            <input
              type="radio"
              name="paymentMethod"
              value="Other"
              checked={values.paymentMethod === "Other"}
              onChange={onChange}
            />
            Other
          </label>
        </fieldset>

        {errors.paymentMethod && (
          <span role="alert" style={errorStyle}>
            Payment method is required
          </span>
        )}

        <label style={labelStyleColumn}>
          <span style={labelTextStyle}>Notes (Optional)</span>
          <textarea
            name="note"
            minLength={0}
            maxLength={200}
            value={values.note}
            onChange={onChange}
            style={textareaStyle}
          />
        </label>
      </fieldset>

      <div style={actionsStyle}>
        <button type="submit" style={confirmButtonStyle}>
          Confirm Sale
        </button>
      </div>

      {errors.form && (
        <span role="alert" style={errorStyle}>
          Something went wrong...
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

const itemsContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const rowStyle = {
  display: "flex",
  justifyContent: "flex-start",
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

const paymentFieldsetStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "12px",
  alignItems: "center",
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

const textareaStyle = {
  padding: "8px",
  border: "1px solid #ddd",
  borderRadius: 4,
  fontFamily: "inherit",
  width: "100%",
  minHeight: 80,
  boxSizing: "border-box",
};

const radioLabelStyle = {
  display: "flex",
  gap: 6,
  alignItems: "center",
  fontSize: "0.95rem",
};

const addButtonStyle = {
  padding: "8px 10px",
  borderRadius: 4,
  border: "1px solid #999",
  background: "#e0e0e0",
  cursor: "pointer",
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

const actionsStyle = {
  display: "flex",
  justifyContent: "flex-end",
};

const errorStyle = {
  color: "#d32f2f",
  fontSize: "0.85rem",
};
