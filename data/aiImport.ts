import { format } from "date-fns";
import {
  AiDraftEntry,
  DATE_PATTERN,
  DATE_TIME_PATTERN,
  ReferenceRecord,
  TIME_PATTERN,
} from "./aiImport.schema";
import { OneDayDetailsProps, OneMonthDetiailsProp } from "./tourDiary.types";

export type DraftValidationIssue = {
  field: string;
  message: string;
};

const normalizedName = (value: string | null | undefined) =>
  (value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s.,/#!$%^&*;:{}=\-_`~()।]+/g, "")
    .trim();

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[right.length];
};

export const findBestReferenceMatch = (
  entry: AiDraftEntry,
  references: ReferenceRecord[],
) => {
  const candidates = references.filter((reference) => reference.kind === entry.kind);
  const requested = normalizedName(entry.referenceKey);
  const destination = normalizedName(entry.endPointName);
  const exact = candidates.find((reference) => {
    const key = normalizedName(reference.key);
    return (requested && key === requested) || (destination && key === destination);
  });
  if (exact) return exact;

  const target = destination || requested;
  if (target.length < 3) return undefined;
  const ranked = candidates
    .map((reference) => {
      const candidate = normalizedName(reference.key);
      const distance = editDistance(target, candidate);
      return {
        reference,
        similarity: 1 - distance / Math.max(target.length, candidate.length, 1),
        distance,
      };
    })
    .sort((a, b) => b.similarity - a.similarity || a.distance - b.distance);
  const best = ranked[0];
  if (!best) return undefined;

  // This catches ordinary spelling mistakes without turning an unrelated new
  // destination into the nearest existing place.
  const allowedDistance = target.length <= 5 ? 1 : Math.max(2, Math.floor(target.length * 0.35));
  return best.similarity >= 0.62 && best.distance <= allowedDistance
    ? best.reference
    : undefined;
};

const isRealDate = (value: string) => {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
};

const isRealDateTime = (value: string) => {
  if (!DATE_TIME_PATTERN.test(value)) return false;
  return isRealDate(value.slice(0, 10));
};

const numberOrNull = (value: unknown): number | null => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

const valueIsPresent = (value: unknown) =>
  value !== null && value !== undefined && value !== "";

const HEADQUARTERS = "Dhulara";
const isHeadquarters = (value: string | null | undefined) => {
  const normalized = normalizedName(value);
  return ["dhulara", "dulara", "dullara"].includes(normalized);
};

const minutesFromTime = (value: string | null) => {
  if (!value || !TIME_PATTERN.test(value)) return null;
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

/** Enforces the official route: Dhulara -> visited station -> Dhulara. */
export const normalizeNormalJourneyDirection = (
  entry: AiDraftEntry,
): AiDraftEntry => {
  if (entry.kind !== "normal") return entry;

  const startIsHeadquarters = isHeadquarters(entry.startingPointName);
  const endIsHeadquarters = isHeadquarters(entry.endPointName);
  const departureMinutes = minutesFromTime(entry.departureTime);
  const returnDepartureMinutes = minutesFromTime(entry.returnDepartureTime);
  const namesAreReversed =
    !startIsHeadquarters && endIsHeadquarters && !!entry.startingPointName;
  const timesAreReversed =
    departureMinutes !== null &&
    returnDepartureMinutes !== null &&
    departureMinutes >= 12 * 60 &&
    returnDepartureMinutes < 12 * 60;
  const shouldSwapTimes = namesAreReversed || timesAreReversed;
  const destination = namesAreReversed
    ? entry.startingPointName
    : entry.endPointName;

  return {
    ...entry,
    startingPointName: HEADQUARTERS,
    endPointName: destination,
    departureTime: shouldSwapTimes
      ? entry.returnDepartureTime
      : entry.departureTime,
    arrivalTime: shouldSwapTimes
      ? entry.returnArrivalTime
      : entry.arrivalTime,
    returnDepartureTime: shouldSwapTimes
      ? entry.departureTime
      : entry.returnDepartureTime,
    returnArrivalTime: shouldSwapTimes
      ? entry.arrivalTime
      : entry.returnArrivalTime,
  };
};

export const monthKeyFromDate = (date: string) => date.slice(0, 7);

export const monthNameFromDate = (date: string) => {
  const [year, month] = date.slice(0, 7).split("-").map(Number);
  return format(new Date(year, month - 1, 1), "MMMM-yyyy");
};

export const entryDate = (entry: AiDraftEntry) =>
  entry.kind === "special"
    ? entry.outboundStartDateTime?.slice(0, 10) || null
    : entry.date;

export const validateDraftEntry = (
  entry: AiDraftEntry,
  expectedFrom: string,
  expectedTo: string,
): DraftValidationIssue[] => {
  const issues: DraftValidationIssue[] = [];
  const requiredText: Array<[keyof AiDraftEntry, string | null]> = [
    ["startingPointName", entry.startingPointName],
    ["endPointName", entry.endPointName],
    ["purpose", entry.purpose],
  ];

  requiredText.forEach(([field, value]) => {
    if (!value?.trim()) {
      issues.push({ field, message: "Required information is missing." });
    }
  });

  if (entry.kind === "normal" && isHeadquarters(entry.endPointName)) {
    issues.push({
      field: "endPointName",
      message: "The visited station must be different from Dhulara headquarters.",
    });
  }

  const date = entryDate(entry);
  if (!date || !isRealDate(date)) {
    issues.push({ field: "date", message: "A valid journey date is required." });
  } else {
    const month = monthKeyFromDate(date);
    if (month < expectedFrom || month > expectedTo) {
      issues.push({
        field: "date",
        message: `Date is outside ${expectedFrom} to ${expectedTo}.`,
      });
    }
  }

  if (entry.kind === "normal") {
    const times: Array<[keyof AiDraftEntry, string | null]> = [
      ["departureTime", entry.departureTime],
      ["arrivalTime", entry.arrivalTime],
      ["returnDepartureTime", entry.returnDepartureTime],
      ["returnArrivalTime", entry.returnArrivalTime],
    ];
    times.forEach(([field, value]) => {
      if (!value || !TIME_PATTERN.test(value)) {
        issues.push({ field, message: "A valid 24-hour time is required." });
      }
    });
  } else {
    const dateTimes: Array<[keyof AiDraftEntry, string | null]> = [
      ["outboundStartDateTime", entry.outboundStartDateTime],
      ["outboundEndDateTime", entry.outboundEndDateTime],
      ["returnStartDateTime", entry.returnStartDateTime],
      ["returnEndDateTime", entry.returnEndDateTime],
    ];
    dateTimes.forEach(([field, value]) => {
      if (!value || !isRealDateTime(value)) {
        issues.push({ field, message: "A valid local date and time is required." });
      }
    });
    if (!entry.totalDays || entry.totalDays <= 0) {
      issues.push({ field: "totalDays", message: "Number of days is required." });
    }
  }

  if (numberOrNull(entry.distanceByBus) === null) {
    issues.push({ field: "distanceByBus", message: "Bus distance is required." });
  }
  if (numberOrNull(entry.distanceOnFoot) === null) {
    issues.push({ field: "distanceOnFoot", message: "Foot distance is required." });
  }

  return issues;
};

const readReferenceValue = (reference: ReferenceRecord, path: string[]) => {
  let current: unknown = reference.value;
  for (const part of path) {
    if (!current || typeof current !== "object" || !(part in current)) return null;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
};

export const applyReferenceDefaults = (
  entry: AiDraftEntry,
  references: ReferenceRecord[],
) => {
  const match = findBestReferenceMatch(entry, references);

  if (!match) return { entry, referenceFields: [] as string[] };

  const referenceFields: string[] = [];
  const next = { ...entry, referenceKey: match.key };
  if (entry.endPointName !== match.key) {
    next.endPointName = match.key;
    referenceFields.push("endPointName");
  }
  const fill = (
    field: keyof AiDraftEntry,
    path: string[],
    convert?: (value: unknown) => string | number | null,
  ) => {
    if (next[field] !== null) return;
    const raw = readReferenceValue(match, path);
    if (raw === null || raw === undefined || raw === "") return;
    const value = convert ? convert(raw) : raw;
    if (value === null || value === undefined || value === "") return;
    (next as Record<string, unknown>)[field] = value;
    referenceFields.push(String(field));
  };

  if (entry.kind === "normal") {
    fill("startingPointName", ["startingPoint", "name"], String);
    fill("endPointName", ["endPoint", "name"], String);
    fill("departureTime", ["startingPoint", "startTime"], String);
    fill("arrivalTime", ["startingPoint", "endTime"], String);
    fill("returnDepartureTime", ["endPoint", "startTime"], String);
    fill("returnArrivalTime", ["endPoint", "endTime"], String);
    fill("distanceByBus", ["distanceByBus"], numberOrNull);
    fill("distanceOnFoot", ["distanceOnFoot"], numberOrNull);
  } else {
    fill("startingPointName", ["startingPoint", "starting", "name"], String);
    fill("endPointName", ["startingPoint", "ending", "name"], String);
    fill("distanceByBus", ["startingPoint", "distanceByBus"], numberOrNull);
    fill("distanceOnFoot", ["startingPoint", "distanceOnFoot"], numberOrNull);
    fill("totalDays", ["totalDays"], numberOrNull);
  }

  return { entry: next, referenceFields };
};

export const beautifyPurpose = (value: string | null) => {
  const cleaned = (value || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return value;
  const sentence = cleaned.charAt(0).toLocaleUpperCase() + cleaned.slice(1);
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
};

export const applyPresentationDefaults = (entry: AiDraftEntry): AiDraftEntry => {
  const withDirection = normalizeNormalJourneyDirection(entry);
  const endPointName = withDirection.endPointName?.trim() || null;
  const purpose = beautifyPurpose(withDirection.purpose);
  const completed = {
    ...withDirection,
    startingPointName: HEADQUARTERS,
    endPointName,
    purpose:
      purpose || (entryDate(withDirection) && endPointName ? "AWW Center visit." : null),
  };
  return completed;
};

export const draftEntryToDiaryEntry = (
  entry: AiDraftEntry,
): OneDayDetailsProps => {
  const id = `ai-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  if (entry.kind === "special") {
    return {
      id,
      date: entryDate(entry) || undefined,
      isCustom: true,
      startingPoint: {
        starting: {
          name: entry.startingPointName || "",
          dateTime: entry.outboundStartDateTime || "",
        },
        ending: {
          name: entry.endPointName || "",
          dateTime: entry.outboundEndDateTime || "",
        },
        distanceByBus: numberOrNull(entry.distanceByBus) || 0,
        distanceOnFoot: numberOrNull(entry.distanceOnFoot) || 0,
      },
      endPoint: {
        starting: {
          name: entry.endPointName || "",
          dateTime: entry.returnStartDateTime || "",
        },
        ending: {
          name: entry.startingPointName || "",
          dateTime: entry.returnEndDateTime || "",
        },
        distanceByBus: numberOrNull(entry.distanceByBus) || 0,
        distanceOnFoot: numberOrNull(entry.distanceOnFoot) || 0,
      },
      totalDays: numberOrNull(entry.totalDays) || 0,
      note: entry.purpose || "",
    };
  }

  return {
    id,
    date: entry.date || undefined,
    startingPoint: {
      name: entry.startingPointName || "",
      startTime: entry.departureTime || "",
      endTime: entry.arrivalTime || "",
    },
    endPoint: {
      name: entry.endPointName || "",
      startTime: entry.returnDepartureTime || "",
      endTime: entry.returnArrivalTime || "",
    },
    distanceByBus: numberOrNull(entry.distanceByBus) || 0,
    distanceOnFoot: numberOrNull(entry.distanceOnFoot) || 0,
    note: entry.purpose || "",
  };
};

export const existingEntryForDraft = (
  entry: AiDraftEntry,
  details: OneMonthDetiailsProp[],
) => {
  const date = entryDate(entry);
  if (!date) return undefined;
  const monthName = monthNameFromDate(date);
  const month = details.find((item) => item.monthName === monthName);
  if (entry.kind === "normal") {
    return month?.data?.find((item) => !item.isCustom && item.date === date);
  }
  return month?.data?.find(
    (item) =>
      item.isCustom &&
      item.startingPoint?.starting?.dateTime === entry.outboundStartDateTime,
  );
};

export const makeReferenceCatalog = (
  normal: Record<string, unknown>,
  special: Record<string, unknown>,
): ReferenceRecord[] => [
  ...Object.entries(normal).map(([key, value]) => ({
    key,
    kind: "normal" as const,
    value: (value || {}) as Record<string, unknown>,
  })),
  ...Object.entries(special).map(([key, value]) => ({
    key,
    kind: "special" as const,
    value: (value || {}) as Record<string, unknown>,
  })),
];

/**
 * Turns previously approved diary rows into reusable place templates. The
 * newest row for a destination wins, so the assistant follows the operator's
 * latest times, distances and purpose without sending the whole diary.
 */
export const makeReferenceCatalogFromDetails = (
  details: OneMonthDetiailsProp[],
): ReferenceRecord[] => {
  const byDestination = new Map<string, ReferenceRecord>();

  details.forEach((month) => {
    (month.data || []).forEach((entry) => {
      if (entry.isCustom) {
        const key = entry.startingPoint?.ending?.name?.trim();
        if (!key) return;
        byDestination.set(`special:${normalizedName(key)}`, {
          key,
          kind: "special",
          value: entry as Record<string, unknown>,
        });
        return;
      }

      const key = entry.endPoint?.name?.trim();
      if (!key) return;
      byDestination.set(`normal:${normalizedName(key)}`, {
        key,
        kind: "normal",
        value: entry as Record<string, unknown>,
      });
    });
  });

  return Array.from(byDestination.values());
};

const validMonth = (year: number, month: number) =>
  year >= 2000 && year <= 2099 && month >= 1 && month <= 12;

/** Infer the likely document period from common Indian note date formats. */
export const inferExpectedMonthRange = (
  rawText: string,
  fallback: string,
) => {
  const found: Array<{ year: number; month: number }> = [];
  const localDate = /(?:^|\D)(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2}|\d{4})(?=\D|$)/g;
  const isoDate = /(?:^|\D)(20\d{2})-(\d{1,2})-\d{1,2}(?=\D|$)/g;

  let match: RegExpExecArray | null;
  while ((match = localDate.exec(rawText)) !== null) {
    const month = Number(match[2]);
    const rawYear = Number(match[3]);
    const year = rawYear < 100 ? 2000 + rawYear : rawYear;
    if (validMonth(year, month)) found.push({ year, month });
  }
  while ((match = isoDate.exec(rawText)) !== null) {
    const year = Number(match[1]);
    const month = Number(match[2]);
    if (validMonth(year, month)) found.push({ year, month });
  }

  if (!found.length) return { from: fallback, to: fallback, inferred: false };

  const yearFrequency = new Map<number, number>();
  found.forEach(({ year }) =>
    yearFrequency.set(year, (yearFrequency.get(year) || 0) + 1),
  );
  const dominantYear = Array.from(yearFrequency.entries()).sort(
    (a, b) => b[1] - a[1] || b[0] - a[0],
  )[0][0];
  const months = found
    .filter(({ year }) => year === dominantYear)
    .map(({ month }) => month);
  const formatMonth = (month: number) =>
    `${dominantYear}-${String(month).padStart(2, "0")}`;

  return {
    from: formatMonth(Math.min(...months)),
    to: formatMonth(Math.max(...months)),
    inferred: true,
  };
};

export const isQuestionResolvedByDefaults = (
  question: { entryIndex: number | null; field: string },
  entries: AiDraftEntry[],
  expectedFrom: string,
  expectedTo: string,
) => {
  if (question.entryIndex === null) return false;
  const entry = entries[question.entryIndex];
  if (!entry || !(question.field in entry)) return false;
  const value = (entry as Record<string, unknown>)[question.field];
  if (!valueIsPresent(value)) return false;
  return !validateDraftEntry(entry, expectedFrom, expectedTo).some(
    (issue) => issue.field === question.field,
  );
};
