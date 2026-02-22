import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { routes } from "./routes";

describe("Routes Tests", () => {
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
    const router = createMemoryRouter(routes, { initialEntries: ["/sale/new"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("sale-create-page")).toBeInTheDocument();
  });

  it("renders Inventory Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("inventory-page"));
  });

  it("renders Product Create Page via deep link", () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/inventory/new"],
    });

    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();
  });

  it("renders Product Edit Page via deep link", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });

    render(<RouterProvider router={router} />);

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
