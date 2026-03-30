import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { listCategories } from "../api/categories";
import { createProduct } from "../api/products";
import validateProductPayload from "../validation/validateProductPayload";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import SubPageHeader from "@/components/SubPageHeader";

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    name: "",
    categoryId: "",
    skuOrBarcode: "",
    unit: "",
    price: "",
    reorderLevel: "",
  });

  useEffect(() => {
    async function load() {
      setFetchError(false);
      setLoading(true);

      try {
        const categoriesData = await listCategories();

        if (!Array.isArray(categoriesData)) {
          throw new Error("Invalid Data Shape");
        }

        setCategories(categoriesData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function onChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // shadcn Select does NOT emit a normal DOM event (no e.target.name/value)
  // it only returns the selected value, so manually map that value
  // into form state and update the correct field
  function onCategoryChange(value) {
    setValues((prev) => ({
      ...prev,
      categoryId: value,
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

    await createProduct(validatedPayload.data);
    navigate("/inventory");
  }

  return (
    <div data-testid="product-create-page" className="mx-auto w-full max-w-3xl space-y-4">
      <SubPageHeader title="Create Product" description="Add a new inventory item." />

      <form
        method="POST"
        onSubmit={onSubmit}
        className="space-y-6 rounded-md border bg-background p-6"
      >
        {loading && (
          <div data-testid="loading" className="text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {fetchError && (
          <div role="alert" className="text-sm text-destructive">
            Error: Fetching Categories
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={values.name} onChange={onChange} />
            {errors.name ? (
              <div role="alert" className="text-sm text-destructive">
                {errors.name}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>

            <Select value={values.categoryId} onValueChange={onCategoryChange}>
              <SelectTrigger id="category" aria-label="Category" className="w-full">
                <SelectValue placeholder="-- Select a category --">
                  {categories.find((c) => String(c.id) === String(values.categoryId))?.name}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="">-- Select a category --</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.categoryId ? (
              <div role="alert" className="text-sm text-destructive">
                {errors.categoryId}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skuOrBarcode">SKU or Barcode</Label>
            <Input
              id="skuOrBarcode"
              name="skuOrBarcode"
              value={values.skuOrBarcode}
              onChange={onChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Input id="unit" name="unit" value={values.unit} onChange={onChange} />
            {errors.unit ? (
              <div role="alert" className="text-sm text-destructive">
                {errors.unit}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" value={values.price} onChange={onChange} />
            {errors.price ? (
              <div role="alert" className="text-sm text-destructive">
                {errors.price}
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reorderLevel">Reorder Level</Label>
            <Input
              id="reorderLevel"
              name="reorderLevel"
              value={values.reorderLevel}
              onChange={onChange}
            />
            {errors.reorderLevel ? (
              <div role="alert" className="text-sm text-destructive">
                {errors.reorderLevel}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex justify-center">
          <Button type="submit">Save Product</Button>
        </div>
      </form>
    </div>
  );
}
