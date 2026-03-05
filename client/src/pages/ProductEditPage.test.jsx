import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
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
});
