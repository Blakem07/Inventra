import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../app/routes";

import { testProducts } from "../tests/testProducts";
import { testCategories } from "../tests/testCategories";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

describe("Product Edit Page Tests", () => {
  let products;
  let categories;

  beforeEach(() => {
    products = testProducts.map((product) => ({ ...product })); // For mutation in archive test
    categories = testCategories.map((category) => ({ ...category }));

    global.fetch = vi.fn();
  });

  it("loads route param and shows edit mode with id", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    // Wait for fetch to load categories
    const dropbox = screen.getByRole("combobox");
    expect(
      await within(dropbox).findByRole("option", { name: categories[0].name }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /edit page/i }));
    expect(screen.getByRole("heading", { name: /id:\s*123/i })).toBeInTheDocument();
  });

  it("renders product update input fields", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();

    // Wait for fetch to load categories
    const dropbox = screen.getByRole("combobox");
    expect(
      await within(dropbox).findByRole("option", { name: categories[0].name }),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Category")).toBeInTheDocument();
    expect(screen.getByLabelText("SKU or Barcode")).toBeInTheDocument();
    expect(screen.getByLabelText("Price")).toBeInTheDocument();
    expect(screen.getByLabelText("Reorder Level")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("loads categories on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();

    // Wait for fetch to load categories
    const dropbox = screen.getByRole("combobox");
    expect(
      await within(dropbox).findByRole("option", { name: categories[0].name }),
    ).toBeInTheDocument();

    let found = false;

    global.fetch.mock.calls.forEach((call) => {
      if (call[0].includes("/categories")) {
        found = true;
      }
    });

    expect(found).toBe(true);
  });

  it("shows error banner when failing to fetch categories", async () => {
    // Prevents stderr caused by client console.log() on error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Server Error" }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("triggers PUT request on submit and sends proper payload", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123 }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    const name = screen.getByRole("textbox", { name: /name/i });
    const categoryId = screen.getByRole("combobox", { name: /category/i });
    const skuOrBarcode = screen.getByRole("textbox", { name: /sku or barcode/i });
    const unit = screen.getByRole("textbox", { name: /unit/i });
    const price = screen.getByRole("textbox", { name: /price/i });
    const reorderLevel = screen.getByRole("textbox", { name: /reorder level/i });

    const updated = {
      name: "Updated Name",
      categoryId: categories[1].id,
      skuOrBarcode: "Updated SKU",
      unit: "Updated Unit",
      price: "Updated Price",
      reorderLevel: "Updated Reorder Level",
    };

    await userEvent.type(name, updated.name);
    await userEvent.selectOptions(categoryId, updated.categoryId);
    await userEvent.type(skuOrBarcode, updated.skuOrBarcode);
    await userEvent.type(unit, updated.unit);
    await userEvent.type(price, updated.price);
    await userEvent.type(reorderLevel, updated.reorderLevel);

    const save = screen.getByRole("button", { name: /save/i });
    await userEvent.click(save);

    await waitFor(() => {
      let found = false;
      global.fetch.mock.calls.forEach((call) => {
        if (call[0].includes("/products/123") && call[1]?.method === "PUT") {
          found = true;

          const parsedPayload = JSON.parse(call[1].body);
          expect(parsedPayload).toEqual(updated);
        }
      });
      expect(found).toBe(true);
    });
  });
});
