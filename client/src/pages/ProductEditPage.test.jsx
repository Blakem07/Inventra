import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, useLocation } from "react-router-dom";
import { routes } from "../app/routes";

import { testProducts } from "../tests/testProducts";
import { testCategories } from "../tests/testCategories";

describe("Product Edit Page Tests", () => {
  let products;
  let categories;

  beforeEach(() => {
    products = testProducts.map((product) => ({ ...product })); // For mutation in archive test
    categories = testCategories.map((category) => ({ ...category }));

    global.fetch = vi.fn();

    fetch.mockResolvedValue({
      ok: true,
      json: async () => categories,
    });
  });

  it("loads route param and shows edit mode with id", async () => {
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
});
