import { describe, expect, it } from "vitest";
import { getEntryTotals } from "./tr7Calculations";

describe("TR7 calculation rules", () => {
  it("preserves the pre-switch daily allowance threshold", () => {
    expect(
      getEntryTotals({ date: "2023-05-21", distanceByBus: 8, distanceOnFoot: 0 }),
    ).toEqual({
      totalFairForBus: 40,
      totalFairOnFoot: 0,
      totalDaily: 50,
      totalAmount: 90,
    });
  });

  it("preserves the 30 km threshold from the switch date", () => {
    expect(
      getEntryTotals({ date: "2023-05-22", distanceByBus: 29, distanceOnFoot: 0 })
        .totalDaily,
    ).toBe(0);
    expect(
      getEntryTotals({ date: "2023-05-22", distanceByBus: 30, distanceOnFoot: 0 })
        .totalDaily,
    ).toBe(50);
  });

  it("preserves special-journey fare and allowance totals", () => {
    expect(
      getEntryTotals({
        isCustom: true,
        totalDays: 2,
        startingPoint: { distanceByBus: 10, distanceOnFoot: 1 },
      }),
    ).toEqual({
      totalFairForBus: 50,
      totalFairOnFoot: 2,
      totalDaily: 370,
      totalAmount: 422,
    });
  });
});
