import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopNav from "./TopNav";

describe("Top Nav Tests", () => {
  /**
   * Dashboard Link
   */
  it("renders Dashboard link with correct href", () => {
    render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });

    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/");
  });

  it("sets dashboardLink to active when route is: /", () => {
    render(
      <MemoryRouter>
        <TopNav></TopNav>
      </MemoryRouter>,
    );

    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    const inventoryLink = screen.getByRole("link", { name: /inventory/i });

    expect(dashboardLink).toHaveAttribute("aria-current", "page");
    expect(inventoryLink).not.toHaveAttribute("aria-current");
  });

  /**
   * Inventory Link
   */
  it("renders Inventory link with correct href", () => {
    render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>,
    );

    const inventoryLink = screen.getByRole("link", { name: /inventory/i });

    expect(inventoryLink).toBeInTheDocument();
    expect(inventoryLink).toHaveAttribute("href", "/inventory");
  });

  it("Sets inventoryLink to active when route is: /inventory", () => {
    render(
      <MemoryRouter initialEntries={["/inventory"]}>
        <TopNav />
      </MemoryRouter>,
    );

    const inventoryLink = screen.getByRole("link", { name: /inventory/i });
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });

    expect(inventoryLink).toHaveAttribute("aria-current", "page");
    expect(dashboardLink).not.toHaveAttribute("aria-current");
  });

  /**
   * Reports Link
   */
  it("renders Reports link with correct href", () => {
    render(
      <MemoryRouter>
        <TopNav />
      </MemoryRouter>,
    );

    const reportsLink = screen.getByRole("link", { name: /reports/i });

    expect(reportsLink).toBeInTheDocument();
    expect(reportsLink).toHaveAttribute("href", "/reports");
  });

  it("sets Reports Link to active when route: /reports", () => {
    render(
      <MemoryRouter initialEntries={["/reports"]}>
        <TopNav />
      </MemoryRouter>,
    );

    const reportsLink = screen.getByRole("link", { name: /reports/i });
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });

    expect(reportsLink).toHaveAttribute("aria-current", "page");
    expect(dashboardLink).not.toHaveAttribute("aria-current");
  });
});
