import { describe, it, expect } from "vitest";
import { getDateRange } from "./getDateRange";

describe("getDateRange", () => {
  it("uses the supplied clock value and converts it to the Philippines business day", () => {
    const now = new Date(
      Date.UTC(
        2030, // year
        0, // month index: 0 = January, 11 = December
        1, // day of the month
        16, // hour in 24-hour time, UTC
        30, // minutes
      ),
    );

    expect(getDateRange("today", now)).toEqual({
      from: "2030-01-02",
      to: "2030-01-02",
    });
  });

  it("does not double-apply Manila timezone for today", () => {
    const now = new Date("2026-04-27T12:55:17.205Z");

    expect(getDateRange("today", now)).toEqual({
      from: "2026-04-27",
      to: "2026-04-27",
    });
  });
});
