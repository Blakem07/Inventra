import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, waitForElementToBeRemoved, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

import { testSalesReport } from "../tests/testSalesReport";
import { testMovementsReport } from "../tests/testMovementsReport";

describe("Reports Page Tests", () => {
  let salesReport;
  let movementsReport;

  /**
   * NOTE:
   *
   * The real API returns `{ data: [...] }`.
   * Our wrapper converts that to `{ sales: [...] }` for the component.
   *
   * In this test we mock the API response BEFORE the wrapper transforms it.
   * The mocked object is passed into the wrapper, but we still only have
   * access to the original mocked object here in the test.
   *
   * So the component receives `sales`, but the test still uses `data`.
   *
   * That is why we read:
   *   salesReport.data[0]
   * not:
   *   salesReport.sales[0]
   */

  beforeEach(() => {
    salesReport = testSalesReport;
    movementsReport = testMovementsReport;

    global.fetch = vi.fn();
  });

  it("renders page set to a default sales tab", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByRole("heading", { name: /reports/i })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /sales/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /movements/i })).toBeInTheDocument();

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers.map((header) => header.textContent)).toEqual([
      "Date",
      "Payment Method",
      "Amount",
      "Staff",
    ]);
  });

  it("fetches sales and fetches and renders rows", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      let found = false;

      calls.forEach((call) => {
        if (call[0].includes("/reports/sales")) {
          found = true;
          expect(call[0]).toMatch(/\/reports\/sales\?from=.*&to=.*/);
        }
      });

      expect(found).toBe(true);
    });

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers.map((header) => header.textContent)).toEqual([
      "Date",
      "Payment Method",
      "Amount",
      "Staff",
    ]);

    const firstSale = salesReport.data[0];
    const secondSale = salesReport.data[1];

    const rows = within(table).getAllByRole("row");
    const firstRow = rows[1];
    const secondRow = rows[2];

    expect(within(firstRow).getByText(firstSale.occurredAt.slice(0, 10))).toBeInTheDocument();
    expect(within(firstRow).getByText(firstSale.paymentMethod)).toBeInTheDocument();
    expect(within(firstRow).getByText(String(firstSale.totalAmount))).toBeInTheDocument();
    expect(within(firstRow).getByText(firstSale.performedBy)).toBeInTheDocument();

    expect(within(secondRow).getByText(secondSale.occurredAt.slice(0, 10))).toBeInTheDocument();
    expect(within(secondRow).getByText(secondSale.paymentMethod)).toBeInTheDocument();
    expect(within(secondRow).getByText(String(secondSale.totalAmount))).toBeInTheDocument();
    expect(within(secondRow).getByText(secondSale.performedBy)).toBeInTheDocument();
  });

  it("renders movements tab when clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByRole("button", { name: /movements/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /movements/i }));

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers.map((header) => header.textContent)).toEqual([
      "Date",
      "Item",
      "Change",
      "Staff",
    ]);
  });

  it("fetches movements and renders rows", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await userEvent.click(screen.getByRole("button", { name: /movements/i }));

    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      let found = false;

      calls.forEach((call) => {
        if (call[0].includes("/reports/movements")) {
          found = true;
          expect(call[0]).toMatch(/\/reports\/movements\?from=.*&to=.*/);
        }
      });

      expect(found).toBe(true);
    });

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    const headers = within(table).getAllByRole("columnheader");
    expect(headers.map((header) => header.textContent)).toEqual([
      "Date",
      "Item",
      "Change",
      "Staff",
    ]);

    const firstMovement = movementsReport.data[0];
    const secondMovement = movementsReport.data[1];

    const rows = within(table).getAllByRole("row");
    const firstRow = rows[1];
    const secondRow = rows[2];

    expect(within(firstRow).getByText(firstMovement.occurredAt.slice(0, 10))).toBeInTheDocument();
    expect(within(firstRow).getByText(firstMovement.product.name)).toBeInTheDocument();
    expect(within(firstRow).getByText(String(firstMovement.quantity))).toBeInTheDocument();
    expect(within(firstRow).getByText(firstMovement.performedBy)).toBeInTheDocument();

    expect(within(secondRow).getByText(secondMovement.occurredAt.slice(0, 10))).toBeInTheDocument();
    expect(within(secondRow).getByText(secondMovement.product.name)).toBeInTheDocument();
    expect(within(secondRow).getByText(String(secondMovement.quantity))).toBeInTheDocument();
    expect(within(secondRow).getByText(secondMovement.performedBy)).toBeInTheDocument();
  });

  it("changing date range triggers sales refetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const select = screen.getByRole("combobox", { name: /date range/i });
    await userEvent.click(select);
    await userEvent.click(await screen.findByRole("option", { name: /today/i }));

    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      let found = false;

      const today = new Date();
      const todayString = today.toISOString().slice(0, 10);

      calls.forEach((call) => {
        if (
          call[0].includes("/reports/sales") &&
          call[0].includes(`from=${todayString}&to=${todayString}`)
        ) {
          found = true;
        }
      });

      expect(found).toBe(true);
    });
  });

  it("changing date range triggers movements refetch", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => salesReport,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => movementsReport,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await userEvent.click(screen.getByRole("button", { name: /movements/i }));

    const select = screen.getByRole("combobox", { name: /date range/i });
    await userEvent.click(select);
    await userEvent.click(await screen.findByRole("option", { name: /today/i }));

    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      let found = false;

      const today = new Date();
      const todayString = today.toISOString().slice(0, 10);

      calls.forEach((call) => {
        if (
          call[0].includes("/reports/movements") &&
          call[0].includes(`from=${todayString}&to=${todayString}`)
        ) {
          found = true;
        }
      });

      expect(found).toBe(true);
    });
  });

  it("renders 'No data' when response is empty", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/reports"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
});
