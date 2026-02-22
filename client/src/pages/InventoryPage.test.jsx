import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import InventoryPage from "./InventoryPage";
import ProductCreatePage from "./ProductCreatePage";

describe("Inventory Page Tests", () => {
  it("navigates to product create when Add Item is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/inventory"]}>
        <Routes>
          <Route path="/inventory" element={<InventoryPage />}></Route>
          <Route path="/inventory/new" element={<ProductCreatePage />} />
        </Routes>
      </MemoryRouter>,
    );

    const addItem = screen.getByRole("link", { name: /add item/i });
    expect(addItem).toBeInTheDocument();

    await userEvent.click(addItem);

    expect(screen.getByTestId("product-create-page")).toBeInTheDocument();
  });
});
