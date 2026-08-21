import { describe, expect, it } from "vitest";
import { validateEntriesForPrint } from "./printValidation";

describe("official document print validation", () => {
  it("accepts a complete normal journey", () => {
    expect(
      validateEntriesForPrint([
        {
          date: "2025-09-11",
          startingPoint: { name: "Dhulara", startTime: "09:00", endTime: "09:45" },
          endPoint: { name: "Bhangai", startTime: "16:00", endTime: "16:45" },
          distanceByBus: 14,
          distanceOnFoot: 0,
          note: "AWC visit",
        },
      ]),
    ).toEqual([]);
  });

  it("blocks incomplete records before printing", () => {
    const issues = validateEntriesForPrint([{ date: "2025-09-11" }]);
    expect(issues).toEqual(
      expect.arrayContaining([
        "Journey 1 has no purpose.",
        "Journey 1 has a missing station.",
        "Journey 1 has an invalid journey time.",
        "Journey 1 has an invalid distance.",
      ]),
    );
  });
});
