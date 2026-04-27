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

/**
 * Renders a single editable sale line item.
 *
 * @param {Object} props
 * @param {number} props.index
 * @param {{ productId: string|number, quantity: string|number }} props.itemValues
 * @param {Array<{ id: string|number, name: string, onHand?: number }>} props.products
 * @param {boolean} [props.submitted]
 * @param {string} [props.error]
 * @param {(name: "productId"|"quantity", value: string|number) => void} props.onChange
 * @param {() => void} props.onRemove
 * @returns {JSX.Element}
 */
export default function LineItemRow({
  index,
  itemValues,
  products,
  submitted,
  error,
  onChange,
  onRemove,
}) {
  const selectedProduct = products.find(
    (product) => String(product.id) === String(itemValues.productId),
  );

  const availableStock = selectedProduct?.onHand;
  const hasSelectedProduct = Boolean(itemValues.productId);
  const hasAvailableStock =
    hasSelectedProduct && availableStock !== undefined && availableStock !== null;

  function handleChange(event) {
    const { name, value } = event.target;
    onChange(name, value);
  }

  function handleSelectChange(value) {
    onChange("productId", value);
  }

  return (
    <fieldset aria-label="sale item" className="rounded-md border bg-muted/20 p-4">
      <div className="grid grid-cols-[minmax(0,1fr)_140px_auto] items-start gap-4">
        <div className="flex min-w-0 flex-col items-start gap-1.5 text-left">
          <Label htmlFor={`productId-${index}`} className="text-left">
            Product
          </Label>

          <Select value={String(itemValues.productId ?? "")} onValueChange={handleSelectChange}>
            <SelectTrigger
              id={`productId-${index}`}
              aria-label="Product"
              className="w-full justify-start text-left"
            >
              <SelectValue placeholder="Select a product">{selectedProduct?.name}</SelectValue>
            </SelectTrigger>

            <SelectContent align="start">
              <SelectItem value="">-- Select a product --</SelectItem>

              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasAvailableStock && (
            <p className="text-left text-xs leading-5 text-muted-foreground">
              {`Available: ${availableStock}`}
            </p>
          )}

          {submitted && !itemValues.productId && (
            <p role="alert" className="text-left text-xs leading-5 text-destructive">
              Product is required
            </p>
          )}

          {error && (
            <p role="alert" className="text-left text-xs leading-5 text-destructive">
              {error}
            </p>
          )}
        </div>

        <div className="flex w-[140px] flex-col items-start gap-1.5 text-left">
          <Label htmlFor={`quantity-${index}`} className="text-left">
            Quantity
          </Label>

          <Input
            id={`quantity-${index}`}
            type="number"
            name="quantity"
            min="1"
            max={hasAvailableStock ? availableStock : undefined}
            step="1"
            value={itemValues.quantity}
            onChange={handleChange}
            className="text-left"
          />

          {Number(itemValues.quantity) < 1 && (
            <p role="alert" className="text-left text-xs leading-5 text-destructive">
              Quantity above 0 is required
            </p>
          )}

          {hasAvailableStock && Number(itemValues.quantity) > Number(availableStock) && (
            <p role="alert" className="text-left text-xs leading-5 text-destructive">
              Insufficient stock
            </p>
          )}
        </div>

        <div className="flex items-end justify-start pt-[22px]">
          <Button type="button" variant="destructive" onClick={onRemove}>
            Delete
          </Button>
        </div>
      </div>
    </fieldset>
  );
}
