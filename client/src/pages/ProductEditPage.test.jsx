import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, useLocation } from "react-router-dom";
import { routes } from "../app/routes";

describe("Product Edit Page Tests", () => {
  it("loads route param and shows edit mode with id", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/inventory/123/edit"] });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId("product-edit-page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /edit page/i }));
    expect(screen.getByRole("heading", { name: /id:\s*123/i })).toBeInTheDocument();
  });
});
