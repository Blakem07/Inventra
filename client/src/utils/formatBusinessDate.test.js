import { describe, it, expect } from "vitest";
import { toBusinessDateKey } from "./formatBusinessDate";

describe("toBusinessDateKey", () => {
  it("formats a UTC timestamp as a Philippines business date", () => {
    const occurredAt = new Date(Date.UTC(2030, 0, 1, 16, 30)).toISOString();

    expect(occurredAt.slice(0, 10)).toBe("2030-01-01");
    expect(toBusinessDateKey(occurredAt)).toBe("2030-01-02");
  });
});
