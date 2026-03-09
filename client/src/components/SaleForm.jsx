import { useState, useEffect } from "react";
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
    <form
      method="POST"
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
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

      <button onClick={handleAddItem}>Add Item +</button>

      <fieldset
        aria-label="transaction details"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "flex-start",
        }}
      >
        <label>
          Performed By
          <input name="performedBy" type="text" value={values.performedBy} onChange={onChange} />
        </label>

        {errors.performedBy && (
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            Performed By is required
          </span>
        )}

        <fieldset>
          <legend>Payment Method</legend>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="Cash"
              checked={values.paymentMethod === "Cash"}
              onChange={onChange}
            />
            Cash
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="GCash"
              checked={values.paymentMethod === "GCash"}
              onChange={onChange}
            />
            GCash
          </label>

          <label>
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
          <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
            Payment method is required
          </span>
        )}

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            alignItems: "flex-start",
          }}
        >
          Notes (Optional)
          <textarea
            name="note"
            minLength={0}
            maxLength={200}
            value={values.note}
            onChange={onChange}
          ></textarea>
        </label>
      </fieldset>
      <button>Confirm Sale</button>

      {errors.form && (
        <span role="alert" style={{ color: "red", fontSize: "0.85rem" }}>
          Something went wrong...
        </span>
      )}
    </form>
  );
}
