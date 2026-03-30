import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import QuickActions from "./QuickActions";

describe("QuickActions", () => {
  const actions = [
    { label: "Add Stock", path: "stock/new" },
    { label: "Record Sale", path: "sales/new" },
    { label: "View All", path: "reports" },
  ];

  function renderWithRoutes() {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<QuickActions actions={actions} />} />
          <Route path="/stock/new" element={<h1>Create Stock Movement Page</h1>} />
          <Route path="/sales/new" element={<h1>Create Sale Page</h1>} />
          <Route path="/reports" element={<h1>Reports Page</h1>} />
        </Routes>
      </MemoryRouter>,
    );
  }

  it("navigates to /stock/new when Add Stock is clicked", async () => {
    renderWithRoutes();

    await userEvent.click(screen.getByRole("link", { name: /add stock/i }));

    expect(
      screen.getByRole("heading", { name: /create stock movement page/i }),
    ).toBeInTheDocument();
  });

  it("navigates to /sales/new when Record Sale is clicked", async () => {
    renderWithRoutes();

    await userEvent.click(screen.getByRole("link", { name: /record sale/i }));

    expect(screen.getByRole("heading", { name: /create sale page/i })).toBeInTheDocument();
  });

  it("navigates to /reports when View All is clicked", async () => {
    renderWithRoutes();

    await userEvent.click(screen.getByRole("link", { name: /view all/i }));

    expect(screen.getByRole("heading", { name: /reports page/i })).toBeInTheDocument();
  });
});
