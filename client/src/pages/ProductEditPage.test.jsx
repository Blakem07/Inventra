import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../app/routes";

import { testProducts } from "../tests/testProducts";
import { testCategories } from "../tests/testCategories";

describe.only("Product Edit Page Tests", () => {
  let products;
  let categories;

  let validPayload;

  beforeEach(() => {
    products = testProducts.map((product) => ({ ...product })); // For mutation in archive test
    categories = testCategories.map((category) => ({ ...category }));

    validPayload = {
      name: "validName",
      categoryId: testCategories[0].id,
      skuOrBarcode: "validSkuOrBarcode",
      unit: "kg",
      price: 10,
      reorderLevel: 5,
    };

    global.fetch = vi.fn();
  });

  it.only("loads route param and shows edit mode with id", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });

    render(<RouterProvider router={router} />);

    const select = await screen.findByRole("combobox", { name: /category/i });
    await userEvent.click(select);

    expect(await screen.findByRole("option", { name: categories[0].name })).toBeInTheDocument();
    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
    expect(await screen.findByText(/id:\s*123/i)).toBeInTheDocument();
  });

  it("renders product update input fields", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();

    // Wait for fetch to load categories
    const select = screen.getByRole("combobox");
    expect(
      await within(select).findByRole("option", { name: categories[0].name }),
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
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();

    // Wait for fetch to load categories
    const select = screen.getByRole("combobox");
    expect(
      await within(select).findByRole("option", { name: categories[0].name }),
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
      ok: true,
      json: async () => products[0],
    });

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
      json: async () => products[0],
    });

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

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const name = screen.getByRole("textbox", { name: /name/i });
    const categoryId = screen.getByRole("combobox", { name: /category/i });
    const skuOrBarcode = screen.getByRole("textbox", { name: /sku or barcode/i });
    const unit = screen.getByRole("textbox", { name: /unit/i });
    const price = screen.getByRole("textbox", { name: /price/i });
    const reorderLevel = screen.getByRole("textbox", { name: /reorder level/i });

    await userEvent.clear(name);
    await userEvent.selectOptions(categoryId, "");
    await userEvent.clear(skuOrBarcode);
    await userEvent.clear(unit);
    await userEvent.clear(price);
    await userEvent.clear(reorderLevel);

    await userEvent.type(name, validPayload.name);
    await userEvent.selectOptions(categoryId, validPayload.categoryId);
    await userEvent.type(skuOrBarcode, validPayload.skuOrBarcode);
    await userEvent.type(unit, validPayload.unit);
    await userEvent.type(price, validPayload.price.toString());
    await userEvent.type(reorderLevel, validPayload.reorderLevel.toString());

    const save = screen.getByRole("button", { name: /save/i });
    await userEvent.click(save);

    await waitFor(() => {
      let found = false;
      global.fetch.mock.calls.forEach((call) => {
        if (call[0].includes("/products/123") && call[1]?.method === "PUT") {
          found = true;

          const parsedPayload = JSON.parse(call[1].body);
          expect(parsedPayload).toEqual(validPayload);
        }
      });
      expect(found).toBe(true);
    });
  });

  it("navigates to inventory page after successful save", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123 }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/inventory/123/edit"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.type(screen.getByRole("textbox", { name: /name/i }), "Updated Name");

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: /category/i }),
      categories[1].id,
    );

    const name = await screen.findByRole("textbox", { name: /name/i });
    const categoryId = await screen.findByRole("combobox", { name: /category/i });
    const skuOrBarcode = await screen.findByRole("textbox", { name: /sku or barcode/i });
    const unit = await screen.findByRole("textbox", { name: /unit/i });
    const price = await screen.findByRole("textbox", { name: /price/i });
    const reorderLevel = await screen.findByRole("textbox", { name: /reorder level/i });

    await userEvent.clear(name);
    await userEvent.selectOptions(categoryId, "");
    await userEvent.clear(skuOrBarcode);
    await userEvent.clear(unit);
    await userEvent.clear(price);
    await userEvent.clear(reorderLevel);

    await userEvent.type(name, "Updated Name");
    await userEvent.selectOptions(categoryId, "cat-veg");
    await userEvent.type(skuOrBarcode, "Updated SKU");
    await userEvent.type(unit, "kg");
    await userEvent.type(price, "10");
    await userEvent.type(reorderLevel, "10");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(await screen.findByTestId("inventory-page")).toBeInTheDocument();
  });

  it("clicking archive calls the correct endpoint and navigates", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123 }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/inventory/123/edit"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.click(screen.getByRole("button", { name: /archive/i }));

    await waitFor(() => {
      let found = false;
      global.fetch.mock.calls.forEach((call) => {
        if (call[0].includes("/products/123/archive") && call[1]?.method == "PATCH") {
          found = true;
        }
      });
      expect(found).toBe(true);
    });

    expect(screen.getByTestId("inventory-page")).toBeInTheDocument();
  });

  it("loads product by id and pre-fills fields", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: [`/inventory/${products[0].id}/edit`],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      let found = false;

      global.fetch.mock.calls.forEach((call) => {
        if (call[0].includes(`/products/${products[0].id}`)) {
          found = true;
        }
      });

      expect(found).toBe(true);
    });

    const nameInput = await screen.findByRole("textbox", { name: /name/i });
    const categorySelect = await screen.findByRole("combobox", { name: /category/i });
    const skuInput = await screen.findByRole("textbox", { name: /sku or barcode/i });
    const unitInput = await screen.findByRole("textbox", { name: /unit/i });
    const priceInput = await screen.findByRole("textbox", { name: /price/i });
    const reorderInput = await screen.findByRole("textbox", { name: /reorder level/i });

    expect(nameInput.value).toBe(products[0].name);
    expect(categorySelect.value).toBe(products[0].categoryId);
    expect(skuInput.value).toBe(products[0].skuOrBarcode);
    expect(unitInput.value).toBe(products[0].unit);
    expect(priceInput.value).toBe(String(products[0].price));
    expect(reorderInput.value).toBe(String(products[0].reorderLevel));

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  it("requires name, category and unit to submit", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: [`/inventory/${products[0].id}/edit`],
    });

    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await userEvent.clear(screen.getByRole("textbox", { name: /name/i }));
    await userEvent.selectOptions(screen.getByRole("combobox", { name: /category/i }), "");
    await userEvent.clear(screen.getByRole("textbox", { name: /unit/i }));

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/category is required/i)).toBeInTheDocument();
    expect(screen.getByText(/unit is required/i)).toBeInTheDocument();

    expect(screen.queryByTestId("inventory-page")).not.toBeInTheDocument();
    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
  });

  it("requires price and reorder level to be positive to submit", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: [`/inventory/${products[0].id}/edit`],
    });

    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await userEvent.clear(screen.getByRole("textbox", { name: /price/i }));
    await userEvent.clear(screen.getByRole("textbox", { name: /reorder level/i }));

    await userEvent.type(screen.getByRole("textbox", { name: /price/i }), "-1");
    await userEvent.type(screen.getByRole("textbox", { name: /reorder level/i }), "-1");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/price must be 0 or more if provided/i)).toBeInTheDocument();
    expect(screen.getByText(/reorder level must be 0 or more if provided/i)).toBeInTheDocument();

    expect(screen.queryByTestId("inventory-page")).not.toBeInTheDocument();
    expect(await screen.findByTestId("product-edit-page")).toBeInTheDocument();
  });
});
