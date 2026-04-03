import { describe, it, expect, vi } from "vitest";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";

vi.mock("../api/categories", () => ({
  listCategories: vi.fn(async () => []),
}));

vi.mock("../api/products", () => ({
  getProduct: vi.fn(async () => ({
    id: "123",
    name: "Mock Product",
    categoryId: "",
    skuOrBarcode: "",
    unit: "",
    price: "",
    reorderLevel: "",
  })),
  updateProduct: vi.fn(async () => ({})),
  archiveProduct: vi.fn(async () => ({})),
}));

describe("Routes Tests", () => {
  it("renders Demo Access page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/demo/access"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("demo-access-page")).toBeInTheDocument();
  });

  it("renders Dashboard page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("renders Stock Movement Create Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("stock-movement-create-page")).toBeInTheDocument();
  });

  it("renders Sale Create Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/sales/new"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("sale-create-page")).toBeInTheDocument();
  });

  it("renders Inventory Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("inventory-page")).toBeInTheDocument();
  });

  it("renders Product Create Page via deep link", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/inventory/new"],
    });

    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();
  });

  it("renders Product Edit Page via deep link", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });

    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
  });

  it("renders Reports Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("reports-page")).toBeInTheDocument();
  });

  it("renders Sales Edit Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/sales/123/edit"] });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("sale-edit-page")).toBeInTheDocument();
  });
});
