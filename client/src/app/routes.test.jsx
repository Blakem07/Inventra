import { describe, it, expect, vi, beforeEach } from "vitest";
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

function renderWithRouter(initialPath = "/") {
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  render(<RouterProvider router={router} />);
}

describe("protected deep links", () => {
  beforeEach(() => {
    global.fetch = vi.fn();

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ allowed: false }),
    });
  });

  it.each([
    ["/"],
    ["/stock/new"],
    ["/sales/new"],
    ["/inventory"],
    ["/inventory/new"],
    ["/inventory/123/edit"],
    ["/reports"],
  ])("redirects %s to demo access when session is invalid", async (path) => {
    renderWithRouter(path);

    expect(await screen.findByTestId("demo-access-page")).toBeInTheDocument();
  });
});

describe("Public Routes Tests", () => {
  it("renders Demo Access page via deep link", () => {
    renderWithRouter("/demo/access");

    expect(screen.getByTestId("demo-access-page")).toBeInTheDocument();
  });
});

describe("Allowed Protected Deep Links", () => {
  beforeEach(() => {
    global.fetch = vi.fn();

    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ allowed: true }),
    });
  });

  it("renders Dashboard page via deep link", async () => {
    renderWithRouter("/");

    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("renders Stock Movement Create Page via deep link", async () => {
    renderWithRouter("/stock/new");

    expect(await screen.findByTestId("stock-movement-create-page")).toBeInTheDocument();
  });

  it("renders Sale Create Page via deep link", async () => {
    renderWithRouter("/sales/new");

    expect(await screen.findByTestId("sale-create-page")).toBeInTheDocument();
  });

  it("renders Inventory Page via deep link", async () => {
    renderWithRouter("/inventory");

    expect(await screen.findByTestId("inventory-page")).toBeInTheDocument();
  });

  it("renders Product Create Page via deep link", async () => {
    renderWithRouter("/inventory/new");

    expect(await screen.findByTestId("product-create-page")).toBeInTheDocument();
  });

  it("renders Product Edit Page via deep link", async () => {
    renderWithRouter("/inventory/123/edit");

    expect(await screen.findByTestId("product-edit-page")).toBeInTheDocument();
  });

  it("renders Reports Page via deep link", async () => {
    renderWithRouter("/reports");

    expect(await screen.findByTestId("reports-page")).toBeInTheDocument();
  });
});
