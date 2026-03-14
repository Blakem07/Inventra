import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, Routes, Route } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { waitFor } from "@testing-library/dom";
import { within } from "@testing-library/dom";
import InventoryPage from "./InventoryPage";
import ProductCreatePage from "./ProductCreatePage";
import { routes } from "../app/routes";
import { testProducts } from "../tests/testProducts";
import { testCategories } from "../tests/testCategories";

describe("Inventory Page Tests", () => {
  let products;
  let categories;

  beforeEach(() => {
    products = testProducts;
    categories = testCategories;

    global.fetch = vi.fn();
  });

  it("navigates to product create when Add Item is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    // ProductCreatePage loads categories on mount
    // So a mock is required
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    render(
      <MemoryRouter initialEntries={["/inventory"]}>
        <Routes>
          <Route path="/inventory" element={<InventoryPage />}></Route>
          <Route path="/inventory/new" element={<ProductCreatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const addItem = screen.getByRole("link", { name: /add item/i });
    expect(addItem).toBeInTheDocument();

    await userEvent.click(addItem);

    const select = screen.getByRole("combobox");
    expect(
      await within(select).findByRole("option", { name: categories[0].name }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();
  });

  it("renders a row for each Product", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    await screen.findByText(products[0].name); // Wait for the fetch

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");
    const rows = within(tbody).getAllByRole("row");

    expect(rows).toHaveLength(products.length);
  });

  it("filters rows by searching product name", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    await screen.findByText(products[0].name); // Wait for the fetch

    const search = screen.getByRole("searchbox");
    await userEvent.type(search, products[0].name);

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const matchingCell = within(tbody).getByRole("cell", {
      name: products[0].name,
    });

    expect(matchingCell).toBeInTheDocument();

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(1);
  });

  it("filters rows by searching SKU", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    await screen.findByText(products[0].name); // Wait for the fetch

    const search = screen.getByRole("searchbox");
    await userEvent.type(search, products[0].skuOrBarcode);

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const matchingCell = within(tbody).getByRole("cell", {
      name: products[0].skuOrBarcode,
    });

    expect(matchingCell).toBeInTheDocument();

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(1);
  });

  it("filters rows by dropdown categories", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    await screen.findByText(products[0].name); // Wait for the fetch
    await screen.findByRole("option", { name: categories[0].name });

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, categories[0].name); // fruit

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(2);
  });

  it("shows all products when category is all", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    await screen.findByText(products[0].name); // Wait for the fetch

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "all");

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(testProducts.length);
  });

  it("navigates to correct product edit page when clicking edit", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products[0],
    });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    await screen.findByText(products[0].name); // Wait for the fetch

    expect(screen.getByTestId("inventory-page")).toBeInTheDocument();

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const cell = within(tbody).getByRole("cell", { name: products[0].name });
    const targetRow = cell.closest("tr");

    const edit = within(targetRow).getByRole("link", { name: /edit/i });
    await userEvent.click(edit);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
    expect(screen.getByText(products[0].id)).toBeInTheDocument();
  });

  it("loads products and categories on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => categories,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByText(products[0].name)).toBeInTheDocument();

    const combobox = screen.getByRole("combobox", { name: /category/i });
    const options = Array.from(combobox.options).map((option) => option.text);

    expect(options).toContain(categories[0].name);

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toContain("/products");
    expect(fetch.mock.calls[1][0]).toContain("/categories");
  });

  it("shows error banner on fetch failure", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Server Error" }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, name: "General" }],
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("inventory-page")).toBeInTheDocument();

    expect(await screen.findByText(/error: fetching inventory data/i)).toBeInTheDocument();
  });
});
