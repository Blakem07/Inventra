import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

import { testDashboardSummary } from "../tests/testDashboardSummary";
import { testSalesReport } from "../tests/testSalesReport";

describe("Dashboard Page Tests", () => {
  let dashboardSummary;
  let salesReport;

  beforeEach(() => {
    dashboardSummary = testDashboardSummary;
    salesReport = testSalesReport;

    global.fetch = vi.fn();
  });

  it("navigates to Stock Movement Create Page when add stock is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dashboardSummary,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const addStock = screen.getByRole("link", { name: /add stock/i });
    expect(addStock).toBeInTheDocument();

    await userEvent.click(addStock);

    expect(screen.getByTestId("stock-movement-create-page")).toBeInTheDocument();
  });

  it("navigates to Sale Create Page when Record Sale is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dashboardSummary,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const recordSale = screen.getByRole("link", { name: /record sale/i });
    expect(recordSale).toBeInTheDocument();

    await userEvent.click(recordSale);
    expect(screen.getByTestId("sale-create-page")).toBeInTheDocument();
  });

  it("navigates to Reports Page when View All is clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dashboardSummary,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const viewAll = screen.getByRole("link", { name: /view all/i });
    expect(viewAll).toBeInTheDocument();

    await userEvent.click(viewAll);
    expect(screen.getByTestId("reports-page")).toBeInTheDocument();
  });

  it("shows stock alerts with fetched data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dashboardSummary,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const stockAlertsSection = await screen.findByRole("region", {
      name: /stock alerts/i,
    });

    expect(
      within(stockAlertsSection).getByText(`Low Stock Items: ${dashboardSummary.lowStockCount}`),
    ).toBeInTheDocument();

    expect(
      within(stockAlertsSection).getByText(
        `Out Of Stock Items: ${dashboardSummary.outOfStockCount}`,
      ),
    ).toBeInTheDocument();
  });

  it("shows today's summary with fetched data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dashboardSummary,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const todaysSummarySection = await screen.findByRole("heading", {
      name: /today's summary/i,
    });

    const section = todaysSummarySection.closest("section");

    expect(
      within(section).getByText(`Sales Today: ${dashboardSummary.salesCountToday}`),
    ).toBeInTheDocument();

    expect(
      within(section).getByText(`Items Sold Today: ${dashboardSummary.itemsSoldToday}`),
    ).toBeInTheDocument();

    expect(
      within(section).getByText(`Total Sales Amount: ${dashboardSummary.totalSalesAmountToday}`),
    ).toBeInTheDocument();
  });

  it("shows recent activity with fetched data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => dashboardSummary,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const recentActivityHeading = await screen.findByRole("heading", {
      name: /recent activity/i,
    });

    const section = recentActivityHeading.closest("section");

    const items = within(section).getAllByRole("listitem");

    expect(items).toHaveLength(dashboardSummary.recentActivity.length);

    dashboardSummary.recentActivity.forEach((activity, index) => {
      const expectedText =
        activity.movementType === "IN"
          ? `Added Stock: ${activity.product.name} (${Math.abs(activity.quantityChange)})`
          : `Sold: ${activity.product.name} (${Math.abs(activity.quantityChange)})`;

      expect(items[index]).toHaveTextContent(expectedText);
    });
  });

  it("shows error banner on fetch failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Server error" }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const errorBanner = await screen.findByText(/error/i);

    expect(errorBanner).toBeInTheDocument();
  });
});
