import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, Routes, Route } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
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
  });

  it("navigates to product create when Add Item is clicked", async () => {
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

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();
  });

  it("renders a row for each Product", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");
    const rows = within(tbody).getAllByRole("row");

    expect(rows).toHaveLength(products.length);
  });

  it("filters rows by searching product name", async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    const search = screen.getByRole("searchbox");
    await userEvent.type(search, products[0].name);

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const matchingHeader = within(tbody).getByRole("rowheader", products[0].name);

    expect(matchingHeader).toBeInTheDocument();

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(1);
  });

  it("filters rows by searching SKU", async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    const search = screen.getByRole("searchbox");
    await userEvent.type(search, products[0].skuOrBarcode);

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const matchingHeader = within(tbody).getByRole("rowheader", products[0].skuOrBarcode);
    expect(matchingHeader).toBeInTheDocument();

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(1);
  });

  it("filters rows by dropdown categories", async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    const dropbox = screen.getByRole("combobox");
    await userEvent.selectOptions(dropbox, categories[0].name); // fruit

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(2);
  });

  it("shows all products when category is all", async () => {
    render(
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>,
    );

    const dropbox = screen.getByRole("combobox");
    await userEvent.selectOptions(dropbox, "all");

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const allRows = within(tbody).getAllByRole("row");
    expect(allRows).toHaveLength(testProducts.length);
  });

  it("navigates to correct product edit page when clicking edit", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("inventory-page")).toBeInTheDocument();

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");

    const allRows = within(tbody).getAllByRole("row");
    const targetRow = allRows.find((row) => within(row).getByRole("rowheader", products[0].name));

    const edit = within(targetRow).getByRole("link", { name: /edit/i });
    await userEvent.click(edit);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
    expect(screen.getByText(products[0].id)).toBeInTheDocument();
  });
});
