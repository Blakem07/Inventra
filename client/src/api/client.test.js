import { describe, it, expect, beforeEach, vi } from "vitest";

import { client } from "./client";

describe("client error handling", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("throws flattened error when response status is 422", async () => {
    const mockErrorResponse = {
      error: {
        message: "Insufficient stock",
        status: 422,
        productId: "6991b887404ed8cf6c6d0499",
      },
    };

    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => mockErrorResponse,
    });

    await expect(client("/sales", { method: "POST" })).rejects.toMatchObject({
      message: "Insufficient stock",
      status: 422,
      productId: "6991b887404ed8cf6c6d0499",
    });
  });
});
