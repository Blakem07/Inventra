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
    const rows = within(tbody).getAllByRole("row");
    const editButtons = within(tbody).getAllByRole("link", { name: /edit/i });

    expect(rows).toHaveLength(products.length);
    expect(editButtons).toHaveLength(products.length);

    products.forEach((product) => {
      const name = within(tbody).getByRole("rowheader", { name: product.name });
      expect(name).toBeInTheDocument();
    });
  });
});
