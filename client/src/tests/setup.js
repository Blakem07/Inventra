import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

vi.stubEnv("VITE_API_BASE_URL", "http://localhost:3000");

afterEach(() => {
  cleanup();
});
