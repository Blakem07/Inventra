import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, useLocation } from "react-router-dom";
import { routes } from "../app/routes";

import { userEvent } from "@testing-library/user-event";

import ProductCreatePage from "./ProductCreatePage";

describe("Product Create Page Tests", () => {
  it("renders product input fields", () => {
    render(
      <MemoryRouter>
        <ProductCreatePage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();

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
});
