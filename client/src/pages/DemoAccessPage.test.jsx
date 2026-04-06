import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

vi.mock("@/components/DemoProtectedRoute", () => ({
  default: ({ children }) => children,
}));

describe("Demo Access Page Tests", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("renders withiout a nav", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/demo/access"] });
    render(<RouterProvider router={router} />);

    await expect(screen.findByTestId("demo-access-page")).resolves.toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("renders form elements", async () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/demo/access"] });
    render(<RouterProvider router={router} />);

    await screen.findByText(/demo/i);

    expect(await screen.findByLabelText(/password/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /enter/i })).toBeInTheDocument();
  });

  it("shows error on wrong password input", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({
        error: {
          code: "DEMO_INVALID_CREDENTIALS",
          message: "Invalid credentials",
        },
      }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/demo/access"] });
    render(<RouterProvider router={router} />);

    await userEvent.type(await screen.findByLabelText(/password/i), "wrong-password");
    await userEvent.click(screen.getByRole("button", { name: /enter/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("grants access on correct demo password", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        authenticated: true,
      }),
    });

    const router = createMemoryRouter(routes, { initialEntries: ["/demo/access"] });
    render(<RouterProvider router={router} />);

    await userEvent.type(await screen.findByLabelText(/password/i), "correct-password");
    await userEvent.click(screen.getByRole("button", { name: /enter/i }));

    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
  });
});
