import {
  AiDraftEntryWithReview,
  draftEntryToDiaryEntry,
  entryDate,
  validateDraftEntry,
} from "../../data";
import { convert24To12 } from "../../utils/time";
import { cn } from "../../utils/cn";
import {
  getEntryTotals,
  isDailyAllowanceApplicable,
} from "../../utils/tr7Calculations";

type Props = {
  entry: AiDraftEntryWithReview;
  expectedFrom: string;
  expectedTo: string;
  view: "tourDiary" | "tr7";
  hasConflict: boolean;
  destinationOptions: string[];
  onDestinationChange: (value: string) => void;
  onChange: (entry: AiDraftEntryWithReview) => void;
};

const inputClass =
  "mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-sm font-medium text-gray-800";
const cellClass = "border-r border-gray-300 p-2 align-top";

const displayDate = (value: string | null) => {
  if (!value) return "Date needed";
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
};

const DateAndTime = ({ date, time }: { date: string | null; time: string | null }) => (
  <span className="whitespace-nowrap tabular-nums">
    {displayDate(date)}
    <br />
    {convert24To12(time || undefined) || "Time needed"}
  </span>
);

const SplitDateTime = ({ value }: { value: string | null }) => {
  const [date = "", time = ""] = (value || "").split("T");
  return <DateAndTime date={date || null} time={time || null} />;
};

export default function AiDraftCard({
  entry,
  expectedFrom,
  expectedTo,
  view,
  hasConflict,
  destinationOptions,
  onDestinationChange,
  onChange,
}: Props) {
  const issues = validateDraftEntry(entry, expectedFrom, expectedTo);
  const purposeError = issues.find((issue) => issue.field === "purpose");
  const purposeErrorId = `${entry.clientId}-purpose-error`;
  const destinationUnresolved = entry.destinationStatus === "unresolved";
  const needsAttention = destinationUnresolved || issues.length > 0 || hasConflict;
  const rowClass = cn(
    "border-b border-gray-300",
    destinationUnresolved
      ? "bg-red-50"
      : entry.destinationStatus === "new"
        ? "bg-amber-50"
        : "bg-white",
  );
  const change = (field: keyof AiDraftEntryWithReview, value: unknown) =>
    onChange({ ...entry, [field]: value });

  const textField = (
    field: keyof AiDraftEntryWithReview,
    label: string,
    type = "text",
  ) => {
    const error = issues.find((issue) => issue.field === field);
    const errorId = `${entry.clientId}-${String(field)}-error`;
    return (
      <label className={labelClass}>
        {label}
        <input
          type={type}
          value={(entry[field] as string | number | null) ?? ""}
          onChange={(event) =>
            change(
              field,
              type === "number"
                ? event.target.value === ""
                  ? null
                  : Number(event.target.value)
                : event.target.value,
            )
          }
          min={type === "number" ? 0 : undefined}
          step={type === "number" ? "any" : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(inputClass, error && "border-red-600")}
        />
        {error && (
          <span id={errorId} className="mt-1 block text-sm text-red-700">
            {error.message}
          </span>
        )}
      </label>
    );
  };

  const destinationSelectValue =
    entry.destinationStatus === "matched"
      ? entry.referenceKey || ""
      : entry.destinationStatus === "new"
        ? "__new__"
        : "";
  const journeyDate = entryDate(entry);
  const diaryEntry = draftEntryToDiaryEntry(entry);
  const tr7Totals = getEntryTotals(diaryEntry);
  const busFareOneWay = tr7Totals.totalFairForBus / 2;
  const footFareOneWay = tr7Totals.totalFairOnFoot / 2;
  const hasDailyAllowance = isDailyAllowanceApplicable(diaryEntry);
  const totalDays = Number(entry.totalDays || 0);
  const reviewCell = (
    <td rowSpan={2} className="p-2 align-top">
      <label className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-gray-900">
        <input
          type="checkbox"
          checked={entry.selected}
          disabled={destinationUnresolved}
          onChange={(event) => change("selected", event.target.checked)}
          aria-label={`Include ${journeyDate || "undated"} journey to ${entry.endPointName || "unresolved destination"}`}
          className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed"
        />
        Include
      </label>
      <p className={cn(
        "mt-2 text-xs font-medium",
        destinationUnresolved ? "text-red-800" : "text-gray-600",
      )}>
        {destinationUnresolved
          ? "Place needed"
          : entry.destinationStatus === "new"
            ? "New place"
            : `Matched: ${entry.referenceKey}`}
      </p>
      {needsAttention && (
        <p className="mt-1 text-xs font-medium text-red-800">Check details</p>
      )}
    </td>
  );

  return (
    <tbody className={cn(destinationUnresolved && "border-2 border-red-500")}>
      <tr className={rowClass}>
        <td className={cellClass}>{entry.startingPointName || "Station needed"}</td>
        <td className={cellClass}>
          {entry.kind === "normal" ? (
            <DateAndTime date={entry.date} time={entry.departureTime} />
          ) : (
            <SplitDateTime value={entry.outboundStartDateTime} />
          )}
        </td>
        <td className={cellClass}>{entry.endPointName || "Destination needed"}</td>
        <td className={cellClass}>
          {entry.kind === "normal" ? (
            <DateAndTime date={entry.date} time={entry.arrivalTime} />
          ) : (
            <SplitDateTime value={entry.outboundEndDateTime} />
          )}
        </td>
        {view === "tourDiary" ? (
          <>
            <td className={cellClass}>By Bus/<br />On foot</td>
            <td className={cn(cellClass, "whitespace-nowrap tabular-nums")}>
              {entry.distanceByBus ?? "?"}/{entry.distanceOnFoot ?? "?"} km
            </td>
            <td rowSpan={2} className={cn(cellClass, "min-w-fit text-pretty")}>
              {entry.purpose || "Purpose needed"}
            </td>
          </>
        ) : (
          <>
            <td className={cellClass}>By Bus/<br />On foot</td>
            <td className={cn(cellClass, "whitespace-nowrap tabular-nums")}>
              {entry.distanceByBus ?? "?"}/{entry.distanceOnFoot ?? "?"}
            </td>
            <td className={cn(cellClass, "tabular-nums")}>{busFareOneWay ? busFareOneWay.toFixed(2) : "-"}</td>
            <td className={cn(cellClass, "tabular-nums")}>{footFareOneWay ? footFareOneWay.toFixed(2) : "-"}</td>
            {entry.kind === "special" ? (
              <>
                <td className={cn(cellClass, "tabular-nums")}>{totalDays || "-"}</td>
                <td className={cellClass}>160/-</td>
                <td className={cn(cellClass, "tabular-nums")}>{(totalDays * 160).toFixed(2)}</td>
                <td rowSpan={2} className={cn(cellClass, "tabular-nums font-semibold")}>{tr7Totals.totalAmount.toFixed(2)}</td>
              </>
            ) : (
              <>
                <td rowSpan={2} className={cellClass}>{hasDailyAllowance ? "70%" : "-"}</td>
                <td rowSpan={2} className={cellClass}>{hasDailyAllowance ? "72/-" : "-"}</td>
                <td rowSpan={2} className={cn(cellClass, "tabular-nums")}>{hasDailyAllowance ? "50.00" : "-"}</td>
                <td rowSpan={2} className={cn(cellClass, "tabular-nums font-semibold")}>{tr7Totals.totalAmount.toFixed(2)}</td>
              </>
            )}
          </>
        )}
        {reviewCell}
      </tr>
      <tr className={rowClass}>
        <td className={cellClass}>{entry.endPointName || "Destination needed"}</td>
        <td className={cellClass}>
          {entry.kind === "normal" ? (
            <DateAndTime date={entry.date} time={entry.returnDepartureTime} />
          ) : (
            <SplitDateTime value={entry.returnStartDateTime} />
          )}
        </td>
        <td className={cellClass}>{entry.startingPointName || "Station needed"}</td>
        <td className={cellClass}>
          {entry.kind === "normal" ? (
            <DateAndTime date={entry.date} time={entry.returnArrivalTime} />
          ) : (
            <SplitDateTime value={entry.returnEndDateTime} />
          )}
        </td>
        <td className={cellClass}>By Bus/<br />On foot</td>
        <td className={cn(cellClass, "whitespace-nowrap tabular-nums")}>
          {entry.distanceByBus ?? "?"}/{entry.distanceOnFoot ?? "?"}{view === "tourDiary" ? " km" : ""}
        </td>
        {view === "tr7" && (
          <>
            <td className={cn(cellClass, "tabular-nums")}>{busFareOneWay ? busFareOneWay.toFixed(2) : "-"}</td>
            <td className={cn(cellClass, "tabular-nums")}>{footFareOneWay ? footFareOneWay.toFixed(2) : "-"}</td>
            {entry.kind === "special" && (
              <>
                <td className={cellClass}>70%</td>
                <td className={cellClass}>72/-</td>
                <td className={cn(cellClass, "tabular-nums")}>50.00</td>
              </>
            )}
          </>
        )}
      </tr>
      <tr className={rowClass}>
        <td colSpan={view === "tr7" ? 13 : 8} className="p-2">
          <details open={needsAttention ? true : undefined}>
            <summary className="cursor-pointer text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {needsAttention
                ? `Review ${issues.length || 1} item${issues.length === 1 ? "" : "s"}`
                : "Edit this journey"}
            </summary>
            <div className="mt-3 rounded-md border border-gray-300 bg-white p-3">
              <label className="block text-sm font-semibold text-gray-900">
                Saved destination
                <select
                  value={destinationSelectValue}
                  onChange={(event) => onDestinationChange(event.target.value)}
                  aria-describedby={destinationUnresolved ? `${entry.clientId}-destination-help` : undefined}
                  className={cn(inputClass, destinationUnresolved && "border-red-600")}
                >
                  <option value="">Select the closest saved destination</option>
                  {destinationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                  <option value="__new__">＋ Add as a new destination</option>
                </select>
              </label>
              {destinationUnresolved && (
                <p id={`${entry.clientId}-destination-help`} role="alert" className="mt-2 text-pretty text-sm font-medium text-red-800">
                  No reliable match was found for “{entry.endPointName || "this destination"}”. Choose a saved place or add it as new.
                </p>
              )}
              {entry.destinationStatus === "matched" && entry.referenceFields.length > 0 && (
                <p className="mt-2 text-pretty text-sm text-emerald-800">
                  Saved stations, times and distances were reused for {entry.referenceKey}.
                </p>
              )}
              {entry.destinationStatus === "new" && (
                <p className="mt-2 text-pretty text-sm font-medium text-amber-900">
                  This destination will be saved locally after import.
                </p>
              )}

              {hasConflict && (
                <label className="mt-3 block text-sm font-medium text-red-800">
                  A journey already exists for this date or departure time.
                  <select
                    value={entry.conflictResolution}
                    onChange={(event) => change("conflictResolution", event.target.value)}
                    className={cn(inputClass, "border-red-500")}
                  >
                    <option value="unresolved">Choose a resolution</option>
                    <option value="keep_existing">Keep existing and exclude this draft</option>
                    <option value="replace_existing">Replace existing after review</option>
                  </select>
                </label>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {entry.kind === "normal"
                  ? textField("date", "Journey date", "date")
                  : textField("outboundStartDateTime", "Outbound departure", "datetime-local")}
                {textField("startingPointName", "Starting station")}
                {entry.destinationStatus === "new" && textField("endPointName", "New destination name")}
                {entry.kind === "normal" ? (
                  <>
                    {textField("departureTime", "Outbound departure", "time")}
                    {textField("arrivalTime", "Outbound arrival", "time")}
                    {textField("returnDepartureTime", "Return departure", "time")}
                    {textField("returnArrivalTime", "Return arrival", "time")}
                  </>
                ) : (
                  <>
                    {textField("outboundEndDateTime", "Outbound arrival", "datetime-local")}
                    {textField("returnStartDateTime", "Return departure", "datetime-local")}
                    {textField("returnEndDateTime", "Return arrival", "datetime-local")}
                    {textField("totalDays", "Number of days", "number")}
                  </>
                )}
                {textField("distanceByBus", "Bus distance (km)", "number")}
                {textField("distanceOnFoot", "Foot distance (km)", "number")}
                <label className={cn(labelClass, "sm:col-span-2 lg:col-span-4")}>
                  Purpose of journey
                  <textarea
                    rows={2}
                    value={entry.purpose || ""}
                    onChange={(event) => change("purpose", event.target.value)}
                    aria-invalid={!!purposeError}
                    aria-describedby={purposeError ? purposeErrorId : undefined}
                    className={cn(inputClass, purposeError && "border-red-600")}
                  />
                  {purposeError && (
                    <span id={purposeErrorId} className="mt-1 block text-sm text-red-700">
                      {purposeError.message}
                    </span>
                  )}
                </label>
              </div>
              <p className="mt-3 text-pretty text-xs text-gray-600">
                Source: {entry.sourceExcerpt || "No source excerpt returned"}
              </p>
            </div>
          </details>
        </td>
      </tr>
    </tbody>
  );
}
