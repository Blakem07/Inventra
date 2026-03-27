import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  render,
  screen,
  waitFor,
  within,
  waitForElementToBeRemoved,
  findByText,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../app/routes";

import { testProducts } from "../tests/testProducts";

describe("Sales Create Page Tests", () => {
  let products;

  beforeEach(() => {
    products = testProducts.map((product) => ({ ...product }));

    global.fetch = vi.fn();
  });

  it("loads products on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/sales/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const trigger = await screen.findByRole("combobox");
    await userEvent.click(trigger);

    expect(screen.findByRole("option", { name: products[0].name })).toBeTruthy();
  });

  it("shows error banner when failing to fetch products", async () => {
    // Prevents stderr caused by client console.log() on error
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ message: "Server Error" }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/sales/new"] });
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId("sale-create-page-error")).toBeInTheDocument();
  });

  it("renders one default sales row item", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const rows = await screen.findAllByRole("group", { name: /sale item/i });
    expect(rows).toHaveLength(1);

    const row = rows[0];

    expect(within(row).getByRole("combobox")).toBeInTheDocument();
    expect(within(row).getByRole("spinbutton", { name: /quantity/i })).toBeInTheDocument();
    expect(within(row).getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("clicking add item renders additional sale rows", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const initialRows = await screen.findAllByRole("group", { name: /sale item/i });
    expect(initialRows).toHaveLength(1);

    const addRow = screen.getByRole("button", { name: /add item/i });
    await userEvent.click(addRow);

    const updatedRows = await screen.findAllByRole("group", { name: /sale item/i });
    expect(updatedRows).toHaveLength(2);
  });

  it("clicking delete removes a sale row", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const addRow = screen.getByRole("button", { name: /add item/i });
    await userEvent.click(addRow);

    const rows = await screen.findAllByRole("group", { name: /sale item/i });
    expect(rows).toHaveLength(2);

    const deleteButton = within(rows[1]).getByRole("button", { name: /delete/i });
    await userEvent.click(deleteButton);

    const updatedRows = await screen.findAllByRole("group", { name: /sale item/i });
    expect(updatedRows).toHaveLength(1);
  });

  it("preserves existing line items when changing a field in one row", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.click(screen.getByRole("button", { name: /add item/i }));

    const productSelects = screen.getAllByRole("combobox");
    const quantityInputs = screen.getAllByRole("spinbutton");

    expect(productSelects).toHaveLength(2);
    expect(quantityInputs).toHaveLength(2);

    await userEvent.type(quantityInputs[1], "3");

    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);
  });

  it("renders the transaction details section", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const details = screen.getByRole("group", { name: /transaction details/i });

    expect(within(details).getByRole("textbox", { name: /performed by/i })).toBeInTheDocument();

    expect(within(details).getByRole("radio", { name: /^cash$/i })).toBeInTheDocument();
    expect(within(details).getByRole("radio", { name: /^gcash$/i })).toBeInTheDocument();
    expect(within(details).getByRole("radio", { name: /^other$/i })).toBeInTheDocument();

    expect(
      within(details).getByRole("textbox", { name: /notes \(optional\)/i }),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /confirm sale/i })).toBeInTheDocument();
  });

  it("shows validation errors when required fields are missing", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const quantity = await screen.findByRole("spinbutton", { name: /quantity/i });

    await userEvent.clear(quantity);
    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    expect(screen.getByText(/product is required/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity above 0 is required/i)).toBeInTheDocument();
    expect(screen.getByText(/performed by is required/i)).toBeInTheDocument();
    expect(screen.getByText(/payment method is required/i)).toBeInTheDocument();
  });

  it("triggers POST and submits a valid payload", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123 }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await userEvent.click(screen.getByRole("button", { name: /add item/i }));

    expect(screen.getAllByRole("combobox")).toHaveLength(2);
    expect(screen.getAllByRole("spinbutton")).toHaveLength(2);

    await userEvent.type(screen.getByLabelText(/performed by/i), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));
    await userEvent.type(screen.getByLabelText(/note/i), "optional");

    await userEvent.click(screen.getAllByRole("combobox")[0]);
    await userEvent.click(await screen.findByRole("option", { name: products[0].name }));

    await userEvent.clear(screen.getAllByRole("spinbutton")[0]);
    await userEvent.type(screen.getAllByRole("spinbutton")[0], "1");

    await userEvent.click(screen.getAllByRole("combobox")[1]);
    await userEvent.click(await screen.findByRole("option", { name: products[1].name }));

    await userEvent.clear(screen.getAllByRole("spinbutton")[1]);
    await userEvent.type(screen.getAllByRole("spinbutton")[1], "3");

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    await waitFor(() => {
      let found = false;

      global.fetch.mock.calls.forEach((call) => {
        if (call[0].includes("/sales") && call[1]?.method === "POST") {
          found = true;

          const parsedPayload = JSON.parse(call[1].body);

          expect(parsedPayload).toEqual({
            paymentMethod: "Cash",
            performedBy: "Staff A",
            note: "optional",
            items: [
              { productId: products[0].id, quantity: 1 },
              { productId: products[1].id, quantity: 3 },
            ],
          });
        }
      });

      expect(found).toBe(true);
    });
  });

  it("navigates on submission success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 123 }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await userEvent.click(screen.getByRole("button", { name: /add item/i }));

    const productSelects = screen.getAllByRole("combobox");
    const quantityInputs = screen.getAllByRole("spinbutton");

    expect(productSelects).toHaveLength(2);
    expect(quantityInputs).toHaveLength(2);

    await userEvent.type(screen.getByLabelText(/performed by/i), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));
    await userEvent.type(screen.getByLabelText(/note/i), "optional");

    await userEvent.click(productSelects[0]);
    await userEvent.click(await screen.findByRole("option", { name: products[0].name }));

    await userEvent.clear(quantityInputs[0]);
    await userEvent.type(quantityInputs[0], "1");

    await userEvent.click(productSelects[1]);
    await userEvent.click(await screen.findByRole("option", { name: products[1].name }));

    await userEvent.clear(quantityInputs[1]);
    await userEvent.type(quantityInputs[1], "3");

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("shows an inline error when the sale exceeds available inventory", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => ({
        error: {
          message: "Insufficient stock",
          productId: products[0].id,
        },
      }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const rows = await screen.findAllByRole("group", { name: /sale item/i });
    const row = rows[0];
    const productSelect = within(row).getByRole("combobox", { name: /product/i });
    const quantityInput = within(row).getByRole("spinbutton", { name: /quantity/i });

    await userEvent.click(productSelect);
    await userEvent.click(await screen.findByRole("option", { name: products[0].name }));

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1000000");
    await userEvent.type(screen.getByRole("textbox", { name: /performed by/i }), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    expect(await within(row).findByText(/insufficient stock/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm sale/i })).toBeInTheDocument();
  });

  it("shows inline error when quantity must be above 0", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const rows = await screen.findAllByRole("group", { name: /sale item/i });
    const row = rows[0];
    const productSelect = within(row).getByRole("combobox", { name: /product/i });
    const quantityInput = within(row).getByRole("spinbutton", { name: /quantity/i });

    await userEvent.click(productSelect);
    await userEvent.click(await screen.findByRole("option", { name: products[0].name }));

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "0");
    await userEvent.type(screen.getByRole("textbox", { name: /performed by/i }), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    expect(await within(row).findByText(/above 0/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm sale/i })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("shows inline error when product is required", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/sales/new"],
    });

    render(<RouterProvider router={router} />);

    const rows = await screen.findAllByRole("group", { name: /sale item/i });
    const row = rows[0];
    const quantityInput = within(row).getByRole("spinbutton", { name: /quantity/i });

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1");
    await userEvent.type(screen.getByRole("textbox", { name: /performed by/i }), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    // Validator should catch missing product client-side and prevent a POST
    expect(await within(row).findByText(/product is required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm sale/i })).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("shows generic submit error when product not found (404)", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Not Found" }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/sales/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const row = (await screen.findAllByRole("group", { name: /sale item/i }))[0];
    const productSelect = within(row).getByRole("combobox", { name: /product/i });
    const quantityInput = within(row).getByRole("spinbutton", { name: /quantity/i });

    await userEvent.click(productSelect);
    await userEvent.click(await screen.findByRole("option", { name: products[0].name }));

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1");
    await userEvent.type(screen.getByRole("textbox", { name: /performed by/i }), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });

  it("shows generic submit error on malformed request (400) and prevents navigation", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: { message: "Malformed request" } }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/sales/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const row = (await screen.findAllByRole("group", { name: /sale item/i }))[0];
    const productSelect = within(row).getByRole("combobox", { name: /product/i });
    const quantityInput = within(row).getByRole("spinbutton", { name: /quantity/i });

    await userEvent.click(productSelect);
    await userEvent.click(await screen.findByRole("option", { name: products[0].name }));

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1");
    await userEvent.type(screen.getByRole("textbox", { name: /performed by/i }), "Staff A");
    await userEvent.click(screen.getByRole("radio", { name: /^cash$/i }));

    await userEvent.click(screen.getByRole("button", { name: /confirm sale/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-page")).not.toBeInTheDocument();
  });
});
