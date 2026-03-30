import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { listCategories } from "../api/categories";
import { archiveProduct, updateProduct, getProduct } from "../api/products";

import validateProductPayload from "../validation/validateProductPayload";

import SubPageHeader from "@/components/SubPageHeader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialValues = {
  name: "",
  categoryId: "",
  skuOrBarcode: "",
  unit: "",
  price: "",
  reorderLevel: "",
};

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState(false);
  const [categories, setCategories] = useState([]);
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setFetchError(false);

      try {
        const productData = await getProduct(id);
        const categoryData = await listCategories();

        if (!Array.isArray(categoryData) || typeof productData !== "object") {
          throw new Error("Invalid category data shape");
        }

        setValues(productData);
        setCategories(categoryData);
      } catch {
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
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

    await updateProduct(id, validatedPayload.data);
    navigate("/inventory");
  }

  async function onArchive(e) {
    e.preventDefault();
    await archiveProduct(id);
    navigate("/inventory");
  }

  return (
    <div data-testid="product-edit-page" className="px-4 py-6 space-y-4">
      <SubPageHeader title="Edit Product" description="Modify product details." />

      <form
        method="POST"
        onSubmit={onSubmit}
        className="mx-auto flex max-w-[800px] flex-col gap-3 rounded-md border bg-background p-4"
      >
        <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 p-3">
          <div className="text-sm font-medium">Product ID: {id}</div>

          <Button type="button" variant="destructive" onClick={onArchive}>
            Archive
          </Button>
        </div>

        {loading && (
          <div data-testid="loading" className="text-sm text-muted-foreground">
            Loading...
          </div>
        )}

        {fetchError && (
          <span role="alert" className="text-sm text-destructive">
            Error: Fetching Categories
          </span>
        )}

        <fieldset
          aria-label="product details"
          className="flex flex-col gap-3 rounded-md border bg-muted/30 p-3"
        >
          <div className="flex items-center gap-3">
            <Label htmlFor="name" className="min-w-[120px]">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={values.name}
              onChange={onChange}
              className="flex-1"
            />
          </div>

          {errors.name && (
            <span role="alert" className="text-sm text-destructive">
              {errors.name}
            </span>
          )}

          <div className="flex items-center gap-3">
            <Label htmlFor="categoryId" className="min-w-[120px]">
              Category
            </Label>

            <Select
              value={values.categoryId}
              onValueChange={(value) =>
                onChange({
                  target: {
                    name: "categoryId",
                    value,
                  },
                })
              }
            >
              <SelectTrigger id="categoryId" aria-label="Category" className="flex-1">
                <SelectValue placeholder="Select a category">
                  {categories.find((c) => String(c.id) === values.categoryId)?.name}
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
          </div>

          {errors.categoryId && (
            <span role="alert" className="text-sm text-destructive">
              {errors.categoryId}
            </span>
          )}

          <div className="flex items-center gap-3">
            <Label htmlFor="skuOrBarcode" className="min-w-[120px]">
              SKU or Barcode
            </Label>
            <Input
              id="skuOrBarcode"
              name="skuOrBarcode"
              value={values.skuOrBarcode}
              onChange={onChange}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-3">
            <Label htmlFor="unit" className="min-w-[120px]">
              Unit
            </Label>
            <Input
              id="unit"
              name="unit"
              value={values.unit}
              onChange={onChange}
              className="flex-1"
            />
          </div>

          {errors.unit && (
            <span role="alert" className="text-sm text-destructive">
              {errors.unit}
            </span>
          )}

          <div className="flex items-center gap-3">
            <Label htmlFor="price" className="min-w-[120px]">
              Price
            </Label>
            <Input
              id="price"
              name="price"
              value={values.price}
              onChange={onChange}
              className="flex-1"
            />
          </div>

          {errors.price && (
            <span role="alert" className="text-sm text-destructive">
              {errors.price}
            </span>
          )}

          <div className="flex items-center gap-3">
            <Label htmlFor="reorderLevel" className="min-w-[120px]">
              Reorder Level
            </Label>
            <Input
              id="reorderLevel"
              name="reorderLevel"
              value={values.reorderLevel}
              onChange={onChange}
              className="flex-1"
            />
          </div>

          {errors.reorderLevel && (
            <span role="alert" className="text-sm text-destructive">
              {errors.reorderLevel}
            </span>
          )}
        </fieldset>

        <div className="flex justify-center">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
