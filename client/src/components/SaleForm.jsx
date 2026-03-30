import { useState } from "react";
import { useNavigate } from "react-router-dom";
import createSale from "../api/sale";

import validateSalePayload from "../validation/validateSalePayload";

import LineItemRow from "./LineItemRow";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  }

  return (
    <form
      method="POST"
      onSubmit={onSubmit}
      className="mx-auto flex max-w-[800px] flex-col gap-3 rounded-md border bg-background p-4"
    >
      <div className="flex flex-col gap-2">
        {values.items.map((item, index) => (
          <LineItemRow
            key={index}
            index={index}
            itemValues={item}
            products={products}
            error={errors[item.productId]}
            submitted={submitted}
            onChange={(field, value) => handleLineItemChange(index, field, value)}
            onRemove={() => handleRemoveItem(index)}
          />
        ))}
      </div>

      <div className="flex justify-start">
        <Button type="button" variant="outline" onClick={handleAddItem}>
          Add Item +
        </Button>
      </div>

      <fieldset
        aria-label="transaction details"
        className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3"
      >
        <div className="flex items-center gap-3">
          <Label htmlFor="performedBy" className="min-w-[120px]">
            Performed By
          </Label>
          <Input
            id="performedBy"
            name="performedBy"
            type="text"
            value={values.performedBy}
            onChange={onChange}
            className="flex-1"
          />
        </div>

        {errors.performedBy && (
          <span role="alert" className="text-sm text-destructive">
            Performed By is required
          </span>
        )}

        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm font-medium">Payment Method</legend>

          <RadioGroup
            value={values.paymentMethod}
            onValueChange={(value) =>
              onChange({
                target: {
                  name: "paymentMethod",
                  value,
                },
              })
            }
            className="flex flex-row items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="payment-cash" value="Cash" />
              <Label htmlFor="payment-cash">Cash</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem id="payment-gcash" value="GCash" />
              <Label htmlFor="payment-gcash">GCash</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem id="payment-other" value="Other" />
              <Label htmlFor="payment-other">Other</Label>
            </div>
          </RadioGroup>
        </fieldset>

        {errors.paymentMethod && (
          <span role="alert" className="text-sm text-destructive">
            Payment method is required
          </span>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor="note">Notes (Optional)</Label>
          <Textarea
            id="note"
            name="note"
            minLength={0}
            maxLength={200}
            value={values.note}
            onChange={onChange}
            className="min-h-[80px]"
          />
        </div>
      </fieldset>

      <div className="flex justify-center">
        <Button type="submit">Confirm Sale</Button>
      </div>

      {errors.form && (
        <span role="alert" className="text-sm text-destructive">
          Something went wrong...
        </span>
      )}
    </form>
  );
}
