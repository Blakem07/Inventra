import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TopNav from "./TopNav";

describe("Top Nav Tests", () => {
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
});
