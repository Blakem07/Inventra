import { describe, it, expect } from "vitest";
import { buildBusinessDateRange, businessDateKeyToUtcStart, addOneDayToDateKey } from "./date.js";

describe("business date range helpers", () => {
  it("converts a Philippines business date start to UTC", () => {
    expect(businessDateKeyToUtcStart("2026-04-27")).toEqual(new Date("2026-04-26T16:00:00.000Z"));
  });

  it("adds one day to a date key", () => {
    expect(addOneDayToDateKey("2026-04-27")).toBe("2026-04-28");
  });

  it("builds an inclusive one-day Philippines business range", () => {
    const result = buildBusinessDateRange({
      from: "2026-04-27",
      to: "2026-04-27",
    });

    expect(result).toEqual({
      range: {
        $gte: new Date("2026-04-26T16:00:00.000Z"),
        $lt: new Date("2026-04-27T16:00:00.000Z"),
      },
    });
  });

  it("builds an inclusive multi-day Philippines business range", () => {
    const result = buildBusinessDateRange({
      from: "2026-04-21",
      to: "2026-04-27",
    });

    expect(result).toEqual({
      range: {
        $gte: new Date("2026-04-20T16:00:00.000Z"),
        $lt: new Date("2026-04-27T16:00:00.000Z"),
      },
    });
  });

  it("rejects invalid date keys", () => {
    expect(buildBusinessDateRange({ from: "bad", to: "2026-04-27" })).toEqual({
      error: { status: 400, message: "Invalid 'from' date" },
    });

    expect(buildBusinessDateRange({ from: "2026-04-27", to: "bad" })).toEqual({
      error: { status: 400, message: "Invalid 'to' date" },
    });
  });

  it("rejects reversed ranges", () => {
    expect(buildBusinessDateRange({ from: "2026-04-28", to: "2026-04-27" })).toEqual({
      error: { status: 400, message: "'from' must be <= 'to'" },
    });
  });
});
