import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitForElementToBeRemoved, within } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { routes } from "../app/routes";

describe("Demo Access Page Tests", () => {
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
});
