import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

  function handleSelectChange(value) {
    onChange("productId", value);
  }

  return (
    <fieldset
      aria-label="sale item"
      className="flex  justify-between gap-4 rounded-md border bg-muted/20 p-4"
    >
      <div className="flex flex-1 items-start gap-4">
        <div className="flex min-w-0 flex-[2] flex-col gap-1.5">
          <Label>Product</Label>

          <Select value={itemValues.productId || ""} onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Choose a product --" />
            </SelectTrigger>

            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {submitted && !itemValues.productId && (
            <span role="alert" className="text-xs text-destructive">
              Product is required
            </span>
          )}

          {error && (
            <span role="alert" className="text-xs text-destructive">
              {error}
            </span>
          )}
        </div>

        <div className="flex w-[140px] flex-col gap-1.5">
          <Label>Quantity</Label>

          <label htmlFor="quantity">Quantity</label>
          <Input
            id="quantity"
            type="number"
            name="quantity"
            min="1"
            step="1"
            value={itemValues.quantity}
            onChange={handleChange}
          />

          {Number(itemValues.quantity) < 1 && (
            <span className="text-xs text-destructive">Quantity above 0 is required</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-end">
        <Button type="button" variant="destructive" onClick={onRemove}>
          Delete
        </Button>
      </div>
    </fieldset>
  );
}
