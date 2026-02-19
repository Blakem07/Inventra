import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import QuickActions from "./QuickActions";

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

  it("");
});
