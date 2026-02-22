import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

describe("Dashboard Page Tests", () => {
  /**
   * Dashboard Navigation Tests
   */
  it("navigates to Stock Movement Create Page when add stock is clicked", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const addStock = screen.getByRole("link", { name: /add stock/i });
    expect(addStock).toBeInTheDocument();

    await userEvent.click(addStock);

    expect(screen.getByTestId("stock-movement-create-page")).toBeInTheDocument();
    screen.debug();
  });

  it("navigates to Sale Create Page when Record Sale is clicked", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const recordSale = screen.getByRole("link", { name: /record sale/i });
    expect(recordSale).toBeInTheDocument();

    await userEvent.click(recordSale);
    expect(screen.getByTestId("sale-create-page")).toBeInTheDocument();
  });

  it("navigates to Reports Page when View All is clicked", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const viewAll = screen.getByRole("link", { name: /view all/i });
    expect(viewAll).toBeInTheDocument();

    await userEvent.click(viewAll);
    expect(screen.getByTestId("reports-page")).toBeInTheDocument();
  });
});
