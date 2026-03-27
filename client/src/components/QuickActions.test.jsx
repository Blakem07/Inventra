import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import QuickActions from "./QuickActions";
import DashboardPage from "../pages/DashboardPage";

describe("Quick Actions Tests", () => {
  let actions;

  beforeEach(() => {
    actions = [
      { label: "Add Stock", path: "stock/new" },
      { label: "Record Sale", path: "sale/new" },
      { label: "View All", path: "reports" },
    ];
  });

  it("renders NavLinks containing the correct labels", () => {
    render(
      <MemoryRouter>
        <QuickActions actions={actions}></QuickActions>
      </MemoryRouter>,
    );

    actions.forEach((action) => {
      expect(() => screen.getByRole("link", { name: action.label })).not.toThrow();
    });
  });

  it("Add Stock action button navigates to /stock/new", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stock/new" element={<h1>Create Stock Movement Page</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitForElementToBeRemoved(() => screen.queryByTestId("dashboard-page-loading"));

    await userEvent.click(screen.getByRole("link", { name: /add stock/i }));

    expect(
      screen.getByRole("heading", { name: /create stock movement page/i }),
    ).toBeInTheDocument();
  });

  it("Record Sale action button navigates to sales/new", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="sales/new" element={<h1>Create Sale Page</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitForElementToBeRemoved(() => screen.queryByTestId("dashboard-page-loading"));

    await userEvent.click(screen.getByRole("link", { name: /record sale/i }));

    expect(screen.getByRole("heading", { name: /create sale page/i })).toBeInTheDocument();
  });

  it("View All Action button navigates to /reports", async () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reports" element={<h1>Reports Page</h1>} />
        </Routes>
      </MemoryRouter>,
    );

    await waitForElementToBeRemoved(() => screen.queryByTestId("dashboard-page-loading"));

    await userEvent.click(screen.getByRole("link", { name: /view all/i }));

    expect(screen.getByRole("heading", { name: /reports page/i })).toBeInTheDocument();
  });
});
