import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

import { testDashboardSummary } from "../tests/testDashboardSummary";
import { testSalesReport } from "../tests/testSalesReport";

vi.mock("@/components/DemoProtectedRoute", () => ({
  default: ({ children }) => children,
}));

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

    await waitForElementToBeRemoved(() => screen.queryByTestId("dashboard-page-loading"));

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

    await waitForElementToBeRemoved(() => screen.queryByTestId("dashboard-page-loading"));

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

    await waitForElementToBeRemoved(() => screen.queryByTestId("dashboard-page-loading"));

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
      within(section).getByText(`Total Sales Amount: ₱${dashboardSummary.totalSalesAmountToday}`),
    ).toBeInTheDocument();
  });

  it("shows recent activity list with correct length", async () => {
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
  });

  it("renders recent activity labels and quantities from movement type", async () => {
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

    dashboardSummary.recentActivity.forEach((activity, index) => {
      const label =
        activity.movementType === "IN"
          ? "Added Stock:"
          : activity.movementType === "OUT"
            ? "Sold:"
            : activity.movementType === "ADJUST"
              ? "Adjusted Stock:"
              : "Stock Activity:";

      const quantity =
        activity.movementType === "ADJUST"
          ? activity.quantityChange
          : Math.abs(activity.quantityChange);

      expect(items[index]).toHaveTextContent(`${label} ${activity.product.name} (${quantity})`);
    });
  });

  it("appends reason to recent activity when present", async () => {
    const summaryWithReason = {
      ...dashboardSummary,
      recentActivity: [
        {
          id: "adjust-1",
          movementType: "ADJUST",
          quantityChange: -10,
          reason: "Opened pack for tingi",
          product: { name: "Nescafe Classic Sachet 2g" },
        },
      ],
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => summaryWithReason,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const recentActivityHeading = await screen.findByRole("heading", {
      name: /recent activity/i,
    });

    const section = recentActivityHeading.closest("section");

    expect(
      within(section).getByText(
        "Adjusted Stock: Nescafe Classic Sachet 2g (-10) • Opened pack for tingi",
      ),
    ).toBeInTheDocument();
  });

  it("shows error banner on fetch failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Server error" }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    const errorBanner = await screen.findByTestId("dashboard-page-error");

    expect(errorBanner).toBeInTheDocument();
  });

  it("renders 'No recent activity' when response is empty", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        summaryDate: "2026-03-10",
        lowStockCount: 0,
        outOfStockCount: 0,
        salesCountToday: 0,
        totalSalesAmountToday: 0,
        itemsSoldToday: 0,
        recentActivity: [],
      }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/"] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByText(/no recent activity/i)).toBeInTheDocument();
  });
});
