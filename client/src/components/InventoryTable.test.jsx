import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { testProducts } from "../tests/testProducts";

import InventoryTable from "./InventoryTable";

describe("Inventory Table Tests", () => {
  let products;

  beforeEach(() => {
    products = testProducts;
  });

  it("renders one row per Product with a name and edit button", () => {
    render(
      <MemoryRouter>
        <InventoryTable products={products} />
      </MemoryRouter>,
    );

    const table = screen.getByRole("table");
    const tbody = table.querySelector("tbody");
    const editButtons = within(tbody).getAllByRole("link", { name: /edit/i });

    expect(editButtons).toHaveLength(products.length);

    products.forEach((product) => {
      const nameCell = within(tbody).getByText(product.name);
      expect(nameCell).toBeInTheDocument();
    });
  });
});
