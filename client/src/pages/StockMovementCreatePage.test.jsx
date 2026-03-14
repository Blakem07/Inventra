import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within, waitForElementToBeRemoved } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

import { testProducts } from "../tests/testProducts";

describe("Stock Movement Create Page Tests", () => {
  let products;

  beforeEach(() => {
    products = testProducts.map((product) => ({ ...product }));

    global.fetch = vi.fn();
  });

  it("loads products on mount", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => products,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const productSelect = screen.getByRole("combobox", { name: /product/i });
    expect(productSelect).toBeInTheDocument();

    await waitFor(() => {
      let found = false;
      global.fetch.mock.calls.forEach((call) => {
        if (call[0].includes(`/products`)) {
          found = true;
        }
      });
      expect(found).toBe(true);
    });

    const productNameOption = within(productSelect).getByText(products[0].name);
    expect(productNameOption).toBeInTheDocument();
  });

  it("renders the form correctly", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => products,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const expectedElements = [
      screen.getByRole("combobox", { name: /product/i }),
      screen.getByRole("radio", { name: /^in$/i }),
      screen.getByRole("radio", { name: /^out$/i }),
      screen.getByRole("spinbutton", { name: /quantity/i }),
      screen.getByRole("textbox", { name: /performed by/i }),
      screen.getByRole("textbox", { name: /reason/i }),
      screen.getByRole("textbox", { name: /note/i }),
      screen.getByRole("button", { name: /confirm movement/i }),
    ];

    expectedElements.forEach((element) => expect(element).toBeInTheDocument());
  });

  it("blocks invalid submit when all required fields are empty", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const quantityInput = screen.getByRole("spinbutton", { name: /quantity/i });
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "0");

    const save = screen.getByRole("button", { name: /confirm movement/i });
    await userEvent.click(save);

    expect(screen.getByText(/product is required/i)).toBeInTheDocument();
    expect(screen.getByText(/movement type is required/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity above 0 is required/i)).toBeInTheDocument();
    expect(screen.getByText(/performed by is required/i)).toBeInTheDocument();
  });

  it("submit sends correct payload", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const productSelect = screen.getByRole("combobox", { name: /product/i });
    await userEvent.selectOptions(productSelect, products[0].id);

    const movementTypeIn = screen.getByRole("radio", { name: /in/i });
    await userEvent.click(movementTypeIn);

    const quantityInput = screen.getByRole("spinbutton", { name: /quantity/i });
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1");

    const performedByText = screen.getByRole("textbox", { name: /performed by/i });
    await userEvent.type(performedByText, "Staff A");

    const reasonText = screen.getByRole("textbox", { name: /reason/i });
    await userEvent.type(reasonText, "Test reason");

    const noteText = screen.getByRole("textbox", { name: /note/i });
    await userEvent.type(noteText, "Test note");

    const save = screen.getByRole("button", { name: /confirm movement/i });
    await userEvent.click(save);

    await waitFor(() => {
      const calls = global.fetch.mock.calls;

      const found = calls.some((call) => {
        if (call[0].includes("/stock/movements")) {
          expect(call[1]).toEqual({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: products[0].id,
              movementType: "IN",
              quantity: 1,
              performedBy: "Staff A",
              reason: "Test reason",
              note: "Test note",
            }),
          });
          return true;
        }
        return false;
      });

      expect(found).toBe(true);
    });
  });

  it("navigates back to dashboard on submit success", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {},
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const productSelect = screen.getByRole("combobox", { name: /product/i });
    await userEvent.selectOptions(productSelect, products[0].id);

    const movementTypeIn = screen.getByRole("radio", { name: /in/i });
    await userEvent.click(movementTypeIn);

    const quantityInput = screen.getByRole("spinbutton", { name: /quantity/i });
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1");

    const performedByText = screen.getByRole("textbox", { name: /performed by/i });
    await userEvent.type(performedByText, "Staff A");

    const save = screen.getByRole("button", { name: /confirm movement/i });
    await userEvent.click(save);

    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("shows 422 error when trying to oversell", async () => {
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
          status: 422,
        },
      }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const productSelect = screen.getByRole("combobox", { name: /product/i });
    await userEvent.selectOptions(productSelect, products[0].id);

    const movementTypeOut = screen.getByRole("radio", { name: /out/i });
    await userEvent.click(movementTypeOut);

    const quantityInput = screen.getByRole("spinbutton", { name: /quantity/i });
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "100000000");

    const performedByText = screen.getByRole("textbox", { name: /performed by/i });
    await userEvent.type(performedByText, "Staff A");

    const save = screen.getByRole("button", { name: /confirm movement/i });
    await userEvent.click(save);

    expect(await screen.findByText("Insufficient stock")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /confirm movement/i })).toBeInTheDocument();
  });

  it("shows generic submit error on 4xx response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => products,
    });

    fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: {
          message: "Bad request",
          status: 400,
        },
      }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/stock/new"] });
    render(<RouterProvider router={router} />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    const productSelect = screen.getByRole("combobox", { name: /product/i });
    await userEvent.selectOptions(productSelect, products[0].id);

    const movementTypeIn = screen.getByRole("radio", { name: /in/i });
    await userEvent.click(movementTypeIn);

    const quantityInput = screen.getByRole("spinbutton", { name: /quantity/i });
    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, "1");

    const performedByText = screen.getByRole("textbox", { name: /performed by/i });
    await userEvent.type(performedByText, "Staff A");

    const save = screen.getByRole("button", { name: /confirm movement/i });
    await userEvent.click(save);

    expect(await screen.findByText("Something went wrong.")).toBeInTheDocument();
  });
});
