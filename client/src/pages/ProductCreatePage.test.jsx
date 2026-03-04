import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, useLocation } from "react-router-dom";
import { routes } from "../app/routes";

import { userEvent } from "@testing-library/user-event";

import ProductCreatePage from "./ProductCreatePage";
import { testCategories } from "../tests/testCategories";

describe("Product Create Page Tests", () => {
  let categories;
  let validPayload;

  beforeEach(() => {
    categories = testCategories;
    validPayload = {
      name: "validName",
      category: testCategories[0].name,
      skuOrBarcode: "validSkuOrBarcode",
      price: "10",
      reorderLevel: "5",
    };

    global.fetch = vi.fn();

    fetch.mockResolvedValue({
      ok: true,
      json: async () => categories,
    });
  });

  it("renders product input fields", async () => {
    render(
      <MemoryRouter>
        <ProductCreatePage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();

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

  it("requires name and category to submit", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/new"] });
    render(<RouterProvider router={router} />);

    const save = screen.getByRole("button", { name: /save/i });
    await userEvent.click(save);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("requires positive numeric values to submit", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/new"] });
    render(<RouterProvider router={router} />);

    const price = screen.getByRole("textbox", { name: /price/i });
    expect(price).toBeInTheDocument();
    const reorderLevel = screen.getByRole("textbox", { name: /reorder level/i });
    expect(reorderLevel).toBeInTheDocument();

    await userEvent.type(price, "-1");
    await userEvent.type(reorderLevel, "-1");

    const save = screen.getByRole("button", { name: /save/i });
    await userEvent.click(save);

    expect(screen.getByText(/price must be 0 or more if provided/i)).toBeInTheDocument();
    expect(screen.getByText(/reorder level must be 0 or more if provided/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
  });

  it("clears errors and navigates to inventory on successful submit", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/new"] });
    render(<RouterProvider router={router} />);

    const save = screen.getByRole("button", { name: /save/i });
    await userEvent.click(save);

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    expect(screen.getByText(/price must be 0 or more if provided/i)).toBeInTheDocument();
    expect(screen.getByText(/reorder level must be 0 or more if provided/i)).toBeInTheDocument();

    const name = screen.getByRole("textbox", { name: /name/i });
    const category = screen.getByRole("combobox", { name: /category/i });
    const skuOrBarcode = screen.getByRole("textbox", { name: /sku or barcode/i });
    const price = screen.getByRole("textbox", { name: /price/i });
    const reorderLevel = screen.getByRole("textbox", { name: /reorder level/i });

    await userEvent.type(name, "valid name");
    await userEvent.selectOptions(category, "cat-fruit");
    await userEvent.type(skuOrBarcode, "valid sku");
    await userEvent.type(price, "10");
    await userEvent.type(reorderLevel, "10");

    await userEvent.click(save);

    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/category is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/price must be 0 or more if provided/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/reorder level must be 0 or more if provided/i),
    ).not.toBeInTheDocument();

    expect(screen.getByTestId("inventory-page")).toBeInTheDocument();
  });

  it("loads categories on mount", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/new"] });
    render(<RouterProvider router={router} />);

    const dropbox = screen.getByRole("combobox");
    expect(
      await within(dropbox).findByRole("option", { name: categories[0].name }),
    ).toBeInTheDocument();

    const validCategoryNames = categories.map((category) => category.name);

    validCategoryNames.forEach((category) => {
      expect(within(dropbox).getByRole("option", { name: category })).toBeInTheDocument();
    });

    expect(global.fetch.mock.calls[0][0]).toMatch(/categories/i);
  });

  it("shows an error banner on fetch failure", async () => {
    // Prevents stderr caused by client console.log() on error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Server Error" }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/new"] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Error: Fetching Categories");
  });

  it("sends correct payload and navigates on success", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/new"] });
    render(<RouterProvider router={router} />);

    const dropbox = screen.getByRole("combobox");
    expect(
      await within(dropbox).findByRole("option", { name: categories[0].name }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();

    const name = screen.getByRole("textbox", { name: /name/i });
    const category = screen.getByRole("combobox", { name: /category/i });
    const skuOrBarcode = screen.getByRole("textbox", { name: /sku or barcode/i });
    const price = screen.getByRole("textbox", { name: /price/i });
    const reorderLevel = screen.getByRole("textbox", { name: /reorder level/i });

    await userEvent.type(name, validPayload.name);
    await userEvent.selectOptions(category, validPayload.category);
    await userEvent.type(skuOrBarcode, validPayload.skuOrBarcode);
    await userEvent.type(price, validPayload.price);
    await userEvent.type(reorderLevel, validPayload.reorderLevel);

    const save = screen.getByRole("button", { name: /save/i });
    await userEvent.click(save);

    const calls = global.fetch.mock.calls;
    await waitFor(() => {
      let found = false;

      calls.forEach((call) => {
        if (call[0].includes("/products") && call[1].method && call[1].method === "POST") {
          found = true;

          const parsedPayload = JSON.parse(call[1].body);
          expect(parsedPayload).toEqual(validPayload);
        }
      });

      expect(found).toBe(true);
    });

    await screen.findByTestId("inventory-page");
  });
});
