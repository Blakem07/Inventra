import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

import DemoProtectedRoute from "./DemoProtectedRoute.jsx";

function renderWithRouter(initialPath = "/") {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <DemoProtectedRoute>
            <div data-testid="protected-page">Protected</div>
          </DemoProtectedRoute>
        ),
      },
      {
        path: "/demo-access",
        element: <div data-testid="demo-access-page">Demo Access</div>,
      },
    ],
    {
      initialEntries: [initialPath],
    },
  );

  return render(<RouterProvider router={router} />);
}
describe("Demo Protected Route Tests", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("shows loading initially", () => {
    renderWithRouter("/");
    expect(screen.getByText(/checking demo access/i)).toBeInTheDocument();
  });

  it("renders children when allowed", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ allowed: true }),
    });

    renderWithRouter("/");

    expect(await screen.findByTestId("protected-page")).toBeInTheDocument();
  });
});
