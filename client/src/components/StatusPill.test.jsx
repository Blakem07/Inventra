import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider, MemoryRouter, Routes, Route } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import { within } from "@testing-library/dom";

import StatusPill from "./StatusPill";

describe("Status Pill Tests", () => {
  it("prefers given status", () => {
    render(<StatusPill status={"OUT"} onHand={0} reorderLevel={10} />);
    expect(screen.getByText("OUT")).toBeInTheDocument();
  });

  it("fallsback to OUT correctly", () => {
    render(<StatusPill onHand={0} reorderLevel={10} />);
    expect(screen.getByText("OUT")).toBeInTheDocument();
  });

  it("fallsback to LOW correctly", () => {
    render(<StatusPill onHand={5} reorderLevel={10} />);
    expect(screen.getByText("LOW")).toBeInTheDocument();
  });

  it("fallsback to OK correctly", () => {
    render(<StatusPill onHand={20} reorderLevel={10} />);
    expect(screen.getByText("OK")).toBeInTheDocument();
  });
});
