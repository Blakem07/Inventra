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
  index,
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
          <Label htmlFor="productId" className="min-w-[120px]">
            Product
          </Label>

          <Select value={itemValues.productId} onValueChange={(value) => handleSelectChange(value)}>
            <SelectTrigger id="productId" aria-label="Product" className="flex-1">
              <SelectValue placeholder="Select a product">
                {products.find((p) => String(p.id) === String(itemValues.productId))?.name}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="">-- Select a product --</SelectItem>
              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {submitted && !itemValues.productId && (
            <span role="alert" className="mt-1 text-xs text-destructive self-start">
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
          <Label htmlFor={`quantity-${index}`}>Quantity</Label>
          <Input
            id={`quantity-${index}`}
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
