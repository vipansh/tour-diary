import { Dialog, RadioGroup } from "@headlessui/react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  AiDraftEntryWithReview,
  AiParseResponse,
  applyPresentationDefaults,
  applyReferenceDefaults,
  draftEntryToDiaryEntry,
  entryDate,
  existingEntryForDraft,
  inferExpectedMonthRange,
  makeReferenceCatalog,
  makeReferenceCatalogFromDetails,
  monthNameFromDate,
  ReferenceRecord,
  validateDraftEntry,
  useTourDiaryDetails,
} from "../../data";
import { record, specialJourneyRecord } from "../../data/oldRecord";
import {
  addLocalStorageItem,
  getLocalStorageItem,
  STORAGE_KEYS,
} from "../../utils/localStorage";
import { cn } from "../../utils/cn";
import AiDraftCard from "./AiDraftCard";
import {
  addTr7Totals,
  getEntryTotals,
  ZERO_TR7_TOTALS,
} from "../../utils/tr7Calculations";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const fieldClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";

const readReferenceDatabase = (key: string) => {
  const value = getLocalStorageItem(key);
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_error) {
    return {};
  }
};

const currentMonth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

const dedupeReferences = (references: ReferenceRecord[]) => {
  const catalog = new Map<string, ReferenceRecord>();
  references.forEach((reference) =>
    catalog.set(`${reference.kind}:${reference.key.toLocaleLowerCase()}`, reference),
  );
  return Array.from(catalog.values()).slice(-200);
};

const monthLabel = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, 1));
};

const hashText = async (value: string) => {
  if (!globalThis.crypto?.subtle) return null;
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export default function AiImportModal({ isOpen, onClose }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { details, importReviewedEntries } = useTourDiaryDetails();
  const [rawText, setRawText] = useState("");
  const [expectedFrom, setExpectedFrom] = useState(currentMonth);
  const [expectedTo, setExpectedTo] = useState(currentMonth);
  const [periodEdited, setPeriodEdited] = useState(false);
  const [clarification, setClarification] = useState("");
  const [draft, setDraft] = useState<AiParseResponse | null>(null);
  const [entries, setEntries] = useState<AiDraftEntryWithReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attested, setAttested] = useState(false);
  const [draftView, setDraftView] = useState<"tourDiary" | "tr7">("tourDiary");
  const localReferences = dedupeReferences([
    ...makeReferenceCatalog(
      record as unknown as Record<string, unknown>,
      specialJourneyRecord as unknown as Record<string, unknown>,
    ),
    ...makeReferenceCatalogFromDetails(details),
    ...makeReferenceCatalog(
      readReferenceDatabase(STORAGE_KEYS.DATABASE),
      readReferenceDatabase(STORAGE_KEYS.ADVANCE_DATABASE),
    ),
  ]);

  const updateRawText = (value: string) => {
    setRawText(value);
    if (!periodEdited) {
      const period = inferExpectedMonthRange(value, currentMonth());
      setExpectedFrom(period.from);
      setExpectedTo(period.to);
    }
  };

  const generateDraft = async () => {
    setError("");
    if (!rawText.trim()) {
      setError("Paste the journey notes before creating a draft.");
      return;
    }
    const inferredPeriod = periodEdited
      ? { from: expectedFrom, to: expectedTo }
      : inferExpectedMonthRange(rawText, currentMonth());
    const requestFrom = inferredPeriod.from;
    const requestTo = inferredPeriod.to;
    setExpectedFrom(requestFrom);
    setExpectedTo(requestTo);
    if (requestFrom > requestTo) {
      setError("The start month must be before the end month.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/ai/parse-tour-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawText,
          expectedFrom: requestFrom,
          expectedTo: requestTo,
          clarification: clarification.trim() || null,
          localReferences,
        }),
      });
      // ponytail: Vercel returns plain-text pages (timeouts, crashes), not JSON.
      const body = await response.text();
      let result: any;
      try {
        result = JSON.parse(body);
      } catch (_error) {
        throw new Error(
          /TIMEOUT/i.test(body)
            ? "The assistant took too long. Try again with fewer lines."
            : "The assistant is unavailable right now. Nothing was saved.",
        );
      }
      if (!response.ok) throw new Error(result.error || "The assistant could not create a draft.");
      const parsed = result as AiParseResponse;
      const reviewedEntries = parsed.entries.map((entry, index) => {
        const existing = existingEntryForDraft(entry, details);
        const hasQuestions = parsed.questions.some((question) => question.entryIndex === index);
        const hasIssues = validateDraftEntry(entry, requestFrom, requestTo).length > 0;
        const destinationStatus = entry.referenceKey
          ? "matched"
          : "unresolved";
        return {
          ...entry,
          clientId: `draft-${Date.now()}-${index}`,
          draftIndex: index,
          destinationStatus,
          selected: !existing && !hasQuestions && !hasIssues && destinationStatus === "matched",
          conflictResolution: existing ? "unresolved" : "keep_existing",
        } as AiDraftEntryWithReview;
      });
      setDraft(parsed);
      setEntries(reviewedEntries);
      setAttested(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The assistant could not create a draft.");
    } finally {
      setLoading(false);
    }
  };

  const selectedEntries = entries.filter((entry) => entry.selected);
  const selectedTr7Totals = selectedEntries.reduce(
    (total, entry) =>
      addTr7Totals(total, getEntryTotals(draftEntryToDiaryEntry(entry))),
    ZERO_TR7_TOTALS,
  );
  const selectedHaveBlockers = selectedEntries.some((entry) => {
    const existing = existingEntryForDraft(entry, details);
    return (
      validateDraftEntry(entry, expectedFrom, expectedTo).length > 0 ||
      entry.destinationStatus === "unresolved" ||
      !!draft?.questions.some(
        (question) => question.entryIndex === entry.draftIndex,
      ) ||
      (!!existing && entry.conflictResolution !== "replace_existing")
    );
  });
  const coverageBlocked = !!draft?.issues.length;
  const generalQuestionBlocked = !!draft?.questions.some(
    (question) => question.entryIndex === null,
  );
  const canImport =
    selectedEntries.length > 0 &&
    !selectedHaveBlockers &&
    !coverageBlocked &&
    !generalQuestionBlocked &&
    attested &&
    !loading;

  const changeDestination = (entryIndex: number, value: string) => {
    setEntries((current) =>
      current.map((entry, index) => {
        if (index !== entryIndex) return entry;
        if (value === "__new__") {
          const next = {
            ...entry,
            referenceKey: null,
            destinationStatus: "new" as const,
            referenceFields: [],
          };
          return {
            ...next,
            selected:
              !existingEntryForDraft(next, details) &&
              validateDraftEntry(next, expectedFrom, expectedTo).length === 0,
          };
        }

        const reference = localReferences.find(
          (item) => item.kind === entry.kind && item.key === value,
        );
        if (!reference) {
          return {
            ...entry,
            referenceKey: null,
            destinationStatus: "unresolved" as const,
            selected: false,
          };
        }

        const cleared = entry.kind === "normal"
          ? {
              ...entry,
              referenceKey: reference.key,
              endPointName: reference.key,
              startingPointName: null,
              departureTime: null,
              arrivalTime: null,
              returnDepartureTime: null,
              returnArrivalTime: null,
              distanceByBus: null,
              distanceOnFoot: null,
            }
          : {
              ...entry,
              referenceKey: reference.key,
              endPointName: reference.key,
              startingPointName: null,
              distanceByBus: null,
              distanceOnFoot: null,
            };
        const applied = applyReferenceDefaults(cleared, localReferences);
        const completed = applyPresentationDefaults(applied.entry);
        const next = {
          ...entry,
          ...completed,
          referenceFields: applied.referenceFields,
          destinationStatus: "matched" as const,
        };
        const hasQuestions = !!draft?.questions.some(
          (question) => question.entryIndex === entry.draftIndex,
        );
        return {
          ...next,
          selected:
            !existingEntryForDraft(next, details) &&
            !hasQuestions &&
            validateDraftEntry(next, expectedFrom, expectedTo).length === 0,
        };
      }),
    );
  };

  const importDraft = async () => {
    if (!canImport || !draft) return;
    try {
      const importRows = selectedEntries.map((entry) => {
        const date = entryDate(entry);
        if (!date) throw new Error("Every selected entry needs a valid date.");
        const existing = existingEntryForDraft(entry, details);
        return {
          monthName: monthNameFromDate(date),
          value: draftEntryToDiaryEntry(entry),
          replaceEntryId:
            entry.conflictResolution === "replace_existing" ? existing?.id : undefined,
        };
      });
      const rawTextHash = await hashText(rawText);
      importReviewedEntries(importRows);
      selectedEntries
        .filter((entry) => entry.destinationStatus === "new")
        .forEach((entry) => {
          const key = entry.endPointName?.trim();
          if (!key) return;
          const storageKey = entry.kind === "special"
            ? STORAGE_KEYS.ADVANCE_DATABASE
            : STORAGE_KEYS.DATABASE;
          const database = readReferenceDatabase(storageKey);
          const value = draftEntryToDiaryEntry(entry);
          delete value.id;
          delete value.date;
          addLocalStorageItem(
            storageKey,
            JSON.stringify({ ...database, [key]: value }),
          );
        });
      try {
        addLocalStorageItem(
          STORAGE_KEYS.AI_IMPORT_AUDIT,
          JSON.stringify({
            createdAt: new Date().toISOString(),
            importedCount: importRows.length,
            importedEntryIds: importRows.map((row) => row.value.id),
            rawTextHash,
            hadOperatorClarification: !!clarification.trim(),
            model: draft.metadata.model,
            responseId: draft.metadata.responseId,
            promptVersion: draft.metadata.promptVersion,
            schemaVersion: draft.metadata.schemaVersion,
            inputTokens: draft.metadata.inputTokens,
            outputTokens: draft.metadata.outputTokens,
          }),
        );
      } catch (_auditError) {
        // The reviewed data is already committed. Audit storage must not make a
        // successful atomic import look like a failed import.
      }
      toast.success(`${importRows.length} reviewed journeys imported.`);
      closeAndReset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The reviewed entries could not be imported.");
    }
  };

  const closeAndReset = () => {
    setDraft(null);
    setEntries([]);
    setClarification("");
    setAttested(false);
    setPeriodEdited(false);
    setDraftView("tourDiary");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={closeAndReset}
      initialFocus={titleRef}
      className="relative z-20"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
      <div className="fixed inset-0 overflow-y-auto p-4">
        <div className="flex min-h-full items-start justify-center">
          <Dialog.Panel className="max-h-full w-full max-w-6xl overflow-y-auto rounded-lg bg-gray-50 p-5 text-left shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title
                  ref={titleRef}
                  tabIndex={-1}
                  className="text-balance text-2xl font-semibold text-gray-950 focus:outline-none"
                >
                  Paste notes with AI
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-pretty text-sm text-gray-600">
                  Paste the notes. Saved destinations automatically supply the established stations, times and distances.
                </Dialog.Description>
              </div>
              <button
                type="button"
                onClick={closeAndReset}
                aria-label="Close AI import"
                className="rounded-md p-2 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <label className="mt-6 block text-sm font-medium text-gray-800">
              Raw journey notes
              <textarea
                rows={10}
                value={rawText}
                onChange={(event) => updateRawText(event.target.value)}
                className={fieldClass}
                placeholder="Paste all daily notes here…"
                required
              />
            </label>

            <details className="mt-4 rounded-md border border-gray-300 bg-white p-3">
              <summary className="cursor-pointer text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Document period: {monthLabel(expectedFrom)}
                {expectedTo !== expectedFrom ? ` to ${monthLabel(expectedTo)}` : ""}
                {periodEdited ? " (manually set)" : " (detected automatically)"}
              </summary>
              <p className="mt-2 text-pretty text-sm text-gray-600">
                Change this only if the dates detected from the notes are not the intended document period.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-gray-800">
                  First month
                  <input
                    type="month"
                    value={expectedFrom}
                    onChange={(event) => {
                      setExpectedFrom(event.target.value);
                      setPeriodEdited(true);
                    }}
                    className={fieldClass}
                    required
                  />
                </label>
                <label className="block text-sm font-medium text-gray-800">
                  Last month
                  <input
                    type="month"
                    value={expectedTo}
                    onChange={(event) => {
                      setExpectedTo(event.target.value);
                      setPeriodEdited(true);
                    }}
                    className={fieldClass}
                    required
                  />
                </label>
              </div>
            </details>

            {draft && (
              <label className="mt-4 block text-sm font-medium text-gray-800">
                Answer the assistant’s questions or add corrections
                <textarea
                  rows={3}
                  value={clarification}
                  onChange={(event) => setClarification(event.target.value)}
                  className={fieldClass}
                  placeholder="Example: 9.10.28 should be 9.10.25. The Chamba trip returned on 10.10.25 at 18:00."
                />
              </label>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={generateDraft}
                disabled={loading}
                className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {draft ? "Regenerate reviewed draft" : "Create draft"}
              </button>
              {draft && (
                <p className="text-sm tabular-nums text-gray-600">
                  Model: {draft.metadata.model} · {draft.metadata.inputTokens} input / {draft.metadata.outputTokens} output tokens
                </p>
              )}
            </div>

            <div aria-live="polite" aria-busy={loading} className="mt-4">
              {loading && (
                <div role="status" className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <span className="sr-only">Creating a structured draft.</span>
                </div>
              )}
              {error && (
                <p role="alert" className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </p>
              )}
            </div>

            {draft && !loading && (
              <div className="mt-6 space-y-6">
                {(draft.issues.length > 0 || draft.questions.length > 0) && (
                  <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                    <h2 className="text-balance text-lg font-semibold text-amber-950">Questions and blocking checks</h2>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950">
                      {draft.issues.map((issue) => <li key={issue}>{issue}</li>)}
                      {draft.questions.map((question, index) => (
                        <li key={`${question.field}-${index}`}>{question.question}</li>
                      ))}
                    </ul>
                    {draft.questions.length > 0 && (
                      <p className="mt-3 text-pretty text-sm font-medium text-amber-950">
                        Add only the requested correction above and regenerate. Journeys without a question can still be imported.
                      </p>
                    )}
                  </section>
                )}

                <section>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-balance text-xl font-semibold text-gray-950">Journey drafts</h2>
                      <p className="mt-1 text-pretty text-sm text-gray-600">
                        {entries.length} journeys shown as they will appear in the selected official form.
                      </p>
                    </div>
                    <RadioGroup
                      value={draftView}
                      onChange={(value: "tourDiary" | "tr7") => setDraftView(value)}
                      className="flex rounded-md border border-gray-300 bg-white p-1"
                    >
                      <RadioGroup.Label className="sr-only">Journey draft preview format</RadioGroup.Label>
                      <RadioGroup.Option
                        value="tourDiary"
                        className={({ checked, active }) => cn(
                          "cursor-pointer rounded px-3 py-2 text-sm font-medium focus:outline-none",
                          checked ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100",
                          active && "ring-2 ring-indigo-500 ring-offset-1",
                        )}
                      >
                        Tour Diary
                      </RadioGroup.Option>
                      <RadioGroup.Option
                        value="tr7"
                        className={({ checked, active }) => cn(
                          "cursor-pointer rounded px-3 py-2 text-sm font-medium focus:outline-none",
                          checked ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100",
                          active && "ring-2 ring-indigo-500 ring-offset-1",
                        )}
                      >
                        TR7
                      </RadioGroup.Option>
                    </RadioGroup>
                  </div>
                  {entries.length === 0 ? (
                    <p className="mt-4 rounded-lg border border-dashed border-gray-400 p-6 text-center text-gray-700">
                      No journeys were found. Add a clarification or revise the notes, then regenerate.
                    </p>
                  ) : (
                    <div className="mt-4 overflow-x-auto rounded-lg border border-gray-400 bg-white">
                      <table className="min-w-full table-auto text-left text-xs text-gray-900 sm:text-sm">
                        {draftView === "tourDiary" ? (
                        <thead className="border-b-2 border-gray-400 bg-gray-100">
                          <tr>
                            <th colSpan={2} scope="colgroup" className="border-r border-gray-400 p-2 text-center">Departure</th>
                            <th colSpan={2} scope="colgroup" className="border-r border-gray-400 p-2 text-center">Arrival</th>
                            <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Mode of journey</th>
                            <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Distance</th>
                            <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Purpose of journey</th>
                            <th rowSpan={2} scope="col" className="p-2 text-center">Review</th>
                          </tr>
                          <tr className="border-t border-gray-300">
                            <th scope="col" className="border-r border-gray-300 p-2">Station</th>
                            <th scope="col" className="border-r border-gray-400 p-2">Date &amp; hour</th>
                            <th scope="col" className="border-r border-gray-300 p-2">Station</th>
                            <th scope="col" className="border-r border-gray-400 p-2">Date &amp; hour</th>
                          </tr>
                        </thead>
                        ) : (
                          <thead className="border-b-2 border-gray-400 bg-gray-100">
                            <tr>
                              <th colSpan={2} scope="colgroup" className="border-r border-gray-400 p-2 text-center">Departure</th>
                              <th colSpan={2} scope="colgroup" className="border-r border-gray-400 p-2 text-center">Arrival</th>
                              <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Mode</th>
                              <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Rate class / km</th>
                              <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Actual fare</th>
                              <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">On foot</th>
                              <th colSpan={3} scope="colgroup" className="border-r border-gray-400 p-2 text-center">Daily allowance</th>
                              <th rowSpan={2} scope="col" className="border-r border-gray-400 p-2 text-center">Total line</th>
                              <th rowSpan={2} scope="col" className="p-2 text-center">Review</th>
                            </tr>
                            <tr className="border-t border-gray-300">
                              <th scope="col" className="border-r border-gray-300 p-2">Station</th>
                              <th scope="col" className="border-r border-gray-400 p-2">Date &amp; hour</th>
                              <th scope="col" className="border-r border-gray-300 p-2">Station</th>
                              <th scope="col" className="border-r border-gray-400 p-2">Date &amp; hour</th>
                              <th scope="col" className="border-r border-gray-300 p-2">Days</th>
                              <th scope="col" className="border-r border-gray-300 p-2">Rate</th>
                              <th scope="col" className="border-r border-gray-400 p-2">Amount</th>
                            </tr>
                          </thead>
                        )}
                      {entries.map((entry, index) => (
                        <AiDraftCard
                          key={entry.clientId}
                          entry={entry}
                          expectedFrom={expectedFrom}
                          expectedTo={expectedTo}
                          view={draftView}
                          hasConflict={!!existingEntryForDraft(entry, details)}
                          destinationOptions={localReferences
                            .filter((reference) => reference.kind === entry.kind)
                            .map((reference) => reference.key)
                            .sort((a, b) => a.localeCompare(b))}
                          onDestinationChange={(value) =>
                            changeDestination(index, value)
                          }
                          onChange={(next) =>
                            setEntries((current) => current.map((item, itemIndex) => itemIndex === index ? next : item))
                          }
                        />
                      ))}
                      {draftView === "tr7" && (
                        <tfoot className="border-t-2 border-gray-500 bg-gray-100 font-semibold tabular-nums">
                          <tr>
                            <td colSpan={6} className="border-r border-gray-400 p-2 text-right">Selected journeys total</td>
                            <td className="border-r border-gray-400 p-2">{selectedTr7Totals.totalFairForBus.toFixed(2)}</td>
                            <td className="border-r border-gray-400 p-2">{selectedTr7Totals.totalFairOnFoot.toFixed(2)}</td>
                            <td className="border-r border-gray-400 p-2"></td>
                            <td className="border-r border-gray-400 p-2"></td>
                            <td className="border-r border-gray-400 p-2">{selectedTr7Totals.totalDaily.toFixed(2)}</td>
                            <td className="border-r border-gray-400 p-2">{selectedTr7Totals.totalAmount.toFixed(2)}</td>
                            <td className="p-2"></td>
                          </tr>
                        </tfoot>
                      )}
                      </table>
                    </div>
                  )}
                </section>

                <section className="rounded-lg border border-gray-300 bg-white p-4">
                  <h2 className="text-balance text-lg font-semibold text-gray-950">Excluded and unresolved source lines</h2>
                  <ul className="mt-2 space-y-2 text-sm text-gray-700">
                    {draft.lines
                      .filter((line) => line.classification !== "journey")
                      .map((line) => (
                        <li key={line.lineId} className="flex gap-2">
                          <span className="font-medium tabular-nums">{line.lineId}</span>
                          <span>{line.classification.replace("_", " ")}: {line.reason}</span>
                        </li>
                      ))}
                  </ul>
                </section>

                <div className="rounded-lg border border-gray-300 bg-white p-4">
                  <label className="flex items-start gap-3 text-sm font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={attested}
                      onChange={(event) => setAttested(event.target.checked)}
                      className="mt-0.5 size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    I reviewed the selected dates, stations, times, distances, purposes, exclusions, and saved-place values against my original notes.
                  </label>
                  <button
                    type="button"
                    onClick={importDraft}
                    disabled={!canImport}
                    aria-describedby="import-help"
                    className="mt-4 rounded-md bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Add {selectedEntries.length} reviewed journeys
                  </button>
                  <p id="import-help" className={cn("mt-2 text-sm", canImport ? "text-gray-600" : "text-amber-800")}>
                    {!attested
                      ? "Confirm the review statement before importing."
                      : selectedEntries.length === 0
                        ? "Select at least one journey."
                        : selectedHaveBlockers || coverageBlocked || generalQuestionBlocked
                          ? "Resolve the highlighted new destinations, questions, errors, and duplicate conflicts in selected records."
                          : "Only the selected records will be added in one transaction."}
                  </p>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
