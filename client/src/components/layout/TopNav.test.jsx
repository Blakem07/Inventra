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
});
