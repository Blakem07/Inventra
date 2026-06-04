import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("renders without a nav", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/demo/access"],
    });

    render(<RouterProvider router={router} />);

    await expect(screen.findByTestId("demo-access-page")).resolves.toBeInTheDocument();
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("renders demo access content", async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ["/demo/access"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText(/inventra demo/i)).toBeInTheDocument();
    expect(screen.getByText(/controlled demo environment/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enter/i })).toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it("shows error when demo access fails", async () => {
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

    const router = createMemoryRouter(routes, {
      initialEntries: ["/demo/access"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.click(await screen.findByRole("button", { name: /enter/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("grants access when demo authentication succeeds", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        authenticated: true,
      }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/demo/access"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.click(await screen.findByRole("button", { name: /enter/i }));

    expect(await screen.findByTestId("dashboard-page")).toBeInTheDocument();
  });

  it("submits the configured demo password automatically", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        authenticated: true,
      }),
    });

    const router = createMemoryRouter(routes, {
      initialEntries: ["/demo/access"],
    });

    render(<RouterProvider router={router} />);

    await userEvent.click(await screen.findByRole("button", { name: /enter/i }));

    const body = JSON.parse(fetch.mock.calls[0][1].body);

    expect(body.password).toBe("demo");
  });

  it("disables the enter button while submitting", async () => {
    let resolveFetch;

    fetch.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    const router = createMemoryRouter(routes, {
      initialEntries: ["/demo/access"],
    });

    render(<RouterProvider router={router} />);

    const button = await screen.findByRole("button", { name: /enter/i });

    await userEvent.click(button);

    expect(screen.getByRole("button", { name: /entering/i })).toBeDisabled();

    resolveFetch({
      ok: true,
      status: 200,
      json: async () => ({
        authenticated: true,
      }),
    });
  });
});
