import { describe, expect, it } from "vitest";
import {
  AiDraftEntry,
  AiDraftEntrySchema,
  applyPresentationDefaults,
  applyReferenceDefaults,
  beautifyPurpose,
  draftEntryToDiaryEntry,
  inferExpectedMonthRange,
  makeReferenceCatalogFromDetails,
  normalizeNormalJourneyDirection,
  validateDraftEntry,
} from "./index";

const validNormalEntry: AiDraftEntry = {
  kind: "normal",
  sourceLineIds: ["L1"],
  sourceExcerpt: "11.9.25 visit AWC Bhangai",
  referenceKey: null,
  date: "2025-09-11",
  startingPointName: "Dhulara",
  endPointName: "Bhangai",
  departureTime: "09:00",
  arrivalTime: "09:45",
  returnDepartureTime: "16:00",
  returnArrivalTime: "16:45",
  outboundStartDateTime: null,
  outboundEndDateTime: null,
  returnStartDateTime: null,
  returnEndDateTime: null,
  distanceByBus: 14,
  distanceOnFoot: 0,
  totalDays: null,
  purpose: "To visit AWC Bhangai",
};

describe("AI import validation", () => {
  it("accepts a complete same-day journey inside the expected range", () => {
    expect(validateDraftEntry(validNormalEntry, "2025-09", "2025-10")).toEqual([]);
  });

  it("blocks suspicious out-of-range dates", () => {
    const entry = { ...validNormalEntry, date: "2028-10-09" };
    expect(validateDraftEntry(entry, "2025-09", "2025-10")).toContainEqual(
      expect.objectContaining({ field: "date" }),
    );
  });

  it("blocks impossible calendar dates and missing required facts", () => {
    const entry = {
      ...validNormalEntry,
      date: "2025-02-31",
      purpose: null,
      distanceByBus: null,
    };
    const issues = validateDraftEntry(entry, "2025-02", "2025-02");
    expect(issues.map((issue) => issue.field)).toEqual(
      expect.arrayContaining(["date", "purpose", "distanceByBus"]),
    );
  });

  it("rejects unknown model fields", () => {
    expect(
      AiDraftEntrySchema.safeParse({ ...validNormalEntry, approvedAmount: 50000 }).success,
    ).toBe(false);
  });
});

describe("reference defaults", () => {
  const references = [
    {
      key: "Bhangai",
      kind: "normal" as const,
      value: {
        startingPoint: { name: "Dhulara", startTime: "09:00", endTime: "09:45" },
        endPoint: { name: "Bhangai", startTime: "16:00", endTime: "16:45" },
        distanceByBus: "14",
        distanceOnFoot: 0,
      },
    },
  ];

  it("fills only missing values from an exact place match", () => {
    const incomplete = {
      ...validNormalEntry,
      referenceKey: "Bhangai",
      startingPointName: null,
      departureTime: null,
      distanceByBus: null,
    };
    const result = applyReferenceDefaults(incomplete, references);
    expect(result.entry.startingPointName).toBe("Dhulara");
    expect(result.entry.distanceByBus).toBe(14);
    expect(result.referenceFields).toEqual(
      expect.arrayContaining(["startingPointName", "departureTime", "distanceByBus"]),
    );
  });

  it("uses a saved destination for an ordinary spelling mistake", () => {
    const result = applyReferenceDefaults(
      {
        ...validNormalEntry,
        endPointName: "Bhanghi",
        referenceKey: null,
        departureTime: null,
      },
      references,
    );
    expect(result.entry.referenceKey).toBe("Bhangai");
    expect(result.entry.endPointName).toBe("Bhangai");
    expect(result.entry.departureTime).toBe("09:00");
  });

  it("does not force an unrelated new place to the nearest saved place", () => {
    const result = applyReferenceDefaults(
      { ...validNormalEntry, endPointName: "Mumbai", referenceKey: null },
      references,
    );
    expect(result.entry.referenceKey).toBeNull();
    expect(result.referenceFields).toEqual([]);
  });
});

describe("automatic operator defaults", () => {
  it("corrects a reversed saved route and its time pairs", () => {
    const reversed = normalizeNormalJourneyDirection({
      ...validNormalEntry,
      startingPointName: "Durdhala",
      endPointName: "Dhulara",
      departureTime: "14:30",
      arrivalTime: "16:00",
      returnDepartureTime: "07:30",
      returnArrivalTime: "10:00",
    });
    expect(reversed.startingPointName).toBe("Dhulara");
    expect(reversed.endPointName).toBe("Durdhala");
    expect(reversed.departureTime).toBe("07:30");
    expect(reversed.arrivalTime).toBe("10:00");
    expect(reversed.returnDepartureTime).toBe("14:30");
    expect(reversed.returnArrivalTime).toBe("16:00");
  });

  it("keeps a correctly ordered headquarters journey unchanged", () => {
    const result = normalizeNormalJourneyDirection(validNormalEntry);
    expect(result.startingPointName).toBe("Dhulara");
    expect(result.endPointName).toBe("Bhangai");
    expect(result.departureTime).toBe("09:00");
    expect(result.returnDepartureTime).toBe("16:00");
  });

  it("formalizes purpose text and supplies the established headquarters", () => {
    const result = applyPresentationDefaults({
      ...validNormalEntry,
      startingPointName: null,
      purpose: "monthly   meeting",
    });
    expect(result.startingPointName).toBe("Dhulara");
    expect(result.purpose).toBe("Monthly meeting.");
    expect(beautifyPurpose("Visit AWC.")) .toBe("Visit AWC.");
  });

  it("uses the standard center-visit purpose when date and place are present", () => {
    const result = applyPresentationDefaults({
      ...validNormalEntry,
      purpose: null,
    });
    expect(result.purpose).toBe("AWW Center visit.");
  });

  it("does not add the fallback purpose without both date and place", () => {
    const result = applyPresentationDefaults({
      ...validNormalEntry,
      date: null,
      purpose: null,
    });
    expect(result.purpose).toBeNull();
  });

  it("detects the dominant past document period and ignores year typos", () => {
    const result = inferExpectedMonthRange(
      "11.9.25 Bhangai\n15.9.25 Hatli\n2.10.25 Thulel\n9.10.28 typo",
      "2026-08",
    );
    expect(result).toEqual({ from: "2025-09", to: "2025-10", inferred: true });
  });

  it("reuses the newest approved journey as a destination template", () => {
    const references = makeReferenceCatalogFromDetails([
      {
        monthName: "September-2025",
        data: [draftEntryToDiaryEntry(validNormalEntry)],
      },
    ]);
    expect(references).toEqual([
      expect.objectContaining({ key: "Bhangai", kind: "normal" }),
    ]);
  });
});

describe("approved entry conversion", () => {
  it("maps reviewed AI fields into the existing document data shape", () => {
    const result = draftEntryToDiaryEntry(validNormalEntry);
    expect(result.date).toBe("2025-09-11");
    expect(result.startingPoint?.name).toBe("Dhulara");
    expect(result.endPoint?.name).toBe("Bhangai");
    expect(result.distanceByBus).toBe(14);
    expect(result.id).toMatch(/^ai-/);
  });
});
