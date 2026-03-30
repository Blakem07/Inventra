import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Renders a stock movement form.
 *
 * @param {Object} props
 * @param {{
 *   productId: string,
 *   movementType: string,
 *   quantity: string|number,
 *   performedBy: string,
 *   reason: string,
 *   note: string
 * }} props.values
 * @param {Object.<string, string>} props.errors
 * @param {Array<{ id: string|number, name: string }>} props.products
 * @param {(event: { target: { name: string, value: string } }) => void} props.onChange
 * @param {(event: React.FormEvent<HTMLFormElement>) => void} props.onSubmit
 * @returns {JSX.Element}
 */
export function StockMovementForm({ values, errors, products, onChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      method="POST"
      className="mx-auto flex max-w-[900px] flex-col gap-3 rounded-md border bg-background p-4"
    >
      <fieldset
        aria-label="stock movement details"
        className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3"
      >
        <div className="flex items-center gap-3">
          <Label htmlFor="product" className="min-w-[120px]">
            Product
          </Label>

          <Select
            value={values.productId || ""}
            onValueChange={(value) =>
              onChange({
                target: {
                  name: "productId",
                  value,
                },
              })
            }
          >
            <SelectTrigger id="product" className="flex-1">
              <SelectValue placeholder="-- Choose a product --">
                {/*values.productId stores the id;
                map it back to the product name for display*/}
                {values.productId
                  ? products.find((p) => String(p.id) === values.productId)?.name
                  : "-- Choose a product --"}
              </SelectValue>
            </SelectTrigger>

            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={String(product.id)}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {errors.productId && (
          <span role="alert" className="text-sm text-destructive">
            Product is required
          </span>
        )}

        <fieldset aria-label="Type" className="m-0 border-0 p-0">
          <legend className="mb-2 text-sm font-medium">Movement Type</legend>

          <RadioGroup
            value={values.movementType}
            onValueChange={(value) =>
              onChange({
                target: {
                  name: "movementType",
                  value,
                },
              })
            }
            className="flex flex-row flex-wrap gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="IN" id="in" />
              <Label htmlFor="in">In</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="OUT" id="out" />
              <Label htmlFor="out">Out</Label>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="ADJUST" id="adjust" />
              <Label htmlFor="adjust">Adjust</Label>
            </div>
          </RadioGroup>
        </fieldset>

        {errors.movementType && (
          <span role="alert" className="text-sm text-destructive">
            Movement type is required
          </span>
        )}

        <div className="flex items-center gap-3">
          <Label htmlFor="quantity" className="min-w-[120px]">
            Quantity
          </Label>
          <Input
            value={values.quantity}
            type="number"
            name="quantity"
            id="quantity"
            aria-label="Quantity"
            onChange={onChange}
            className="flex-1"
          />
        </div>

        {errors.oversell && (
          <span role="alert" className="text-sm text-destructive">
            {errors.oversell}
          </span>
        )}

        {errors.quantity && (
          <span role="alert" className="text-sm text-destructive">
            Quantity above 0 is required
          </span>
        )}

        <div className="flex items-center gap-3">
          <Label htmlFor="performedBy" className="min-w-[120px]">
            Performed By
          </Label>
          <Input
            value={values.performedBy}
            type="text"
            name="performedBy"
            id="performedBy"
            aria-label="Performed By"
            onChange={onChange}
            className="flex-1"
          />
        </div>

        {errors.performedBy && (
          <span role="alert" className="text-sm text-destructive">
            Performed by is required
          </span>
        )}

        <div className="flex items-center gap-3">
          <Label htmlFor="reason" className="min-w-[120px]">
            Reason
          </Label>
          <Input
            value={values.reason}
            type="text"
            name="reason"
            id="reason"
            aria-label="Reason"
            onChange={onChange}
            className="flex-1"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="note">Note</Label>
          <Textarea
            value={values.note}
            name="note"
            id="note"
            aria-label="Note"
            onChange={onChange}
            className="min-h-[80px] resize-none"
          />
        </div>
      </fieldset>

      <div className="flex justify-center">
        <Button type="submit" aria-label="Confirm Movement">
          Confirm Movement
        </Button>
      </div>

      {errors.form && (
        <span role="alert" className="text-sm text-destructive">
          {errors.form}
        </span>
      )}
    </form>
  );
}
