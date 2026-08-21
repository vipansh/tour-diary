import { z } from "zod/v4";

export const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
export const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const DATE_TIME_PATTERN =
  /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])T([01]\d|2[0-3]):[0-5]\d$/;

export const ReferenceRecordSchema = z.object({
  key: z.string(),
  kind: z.enum(["normal", "special"]),
  value: z.record(z.string(), z.unknown()),
}).strict();

export const AiDraftEntrySchema = z.object({
  kind: z.enum(["normal", "special"]),
  sourceLineIds: z.array(z.string()),
  sourceExcerpt: z.string(),
  referenceKey: z.string().nullable(),
  date: z.string().nullable(),
  startingPointName: z.string().nullable(),
  endPointName: z.string().nullable(),
  departureTime: z.string().nullable(),
  arrivalTime: z.string().nullable(),
  returnDepartureTime: z.string().nullable(),
  returnArrivalTime: z.string().nullable(),
  outboundStartDateTime: z.string().nullable(),
  outboundEndDateTime: z.string().nullable(),
  returnStartDateTime: z.string().nullable(),
  returnEndDateTime: z.string().nullable(),
  distanceByBus: z.number().nullable(),
  distanceOnFoot: z.number().nullable(),
  totalDays: z.number().nullable(),
  purpose: z.string().nullable(),
}).strict();

export const ClassifiedSourceLineSchema = z.object({
  lineId: z.string(),
  classification: z.enum([
    "journey",
    "non_journey",
    "summary",
    "unresolved",
  ]),
  entryIndex: z.number().int().nullable(),
  reason: z.string(),
}).strict();

export const DraftQuestionSchema = z.object({
  entryIndex: z.number().int().nullable(),
  field: z.string(),
  question: z.string(),
}).strict();

export const AiModelOutputSchema = z.object({
  entries: z.array(AiDraftEntrySchema),
  lines: z.array(ClassifiedSourceLineSchema),
  questions: z.array(DraftQuestionSchema),
}).strict();

export const AiParseRequestSchema = z.object({
  rawText: z.string().trim().min(1).max(20_000),
  expectedFrom: z.string().regex(MONTH_PATTERN),
  expectedTo: z.string().regex(MONTH_PATTERN),
  clarification: z.string().max(5_000).nullable(),
  localReferences: z.array(ReferenceRecordSchema).max(200),
}).strict();

export type AiDraftEntry = z.infer<typeof AiDraftEntrySchema>;
export type AiModelOutput = z.infer<typeof AiModelOutputSchema>;
export type ClassifiedSourceLine = z.infer<typeof ClassifiedSourceLineSchema>;
export type DraftQuestion = z.infer<typeof DraftQuestionSchema>;
export type ReferenceRecord = z.infer<typeof ReferenceRecordSchema>;

export type AiDraftEntryWithReview = AiDraftEntry & {
  clientId: string;
  draftIndex: number;
  referenceFields: string[];
  selected: boolean;
  destinationStatus: "matched" | "unresolved" | "new";
  conflictResolution: "unresolved" | "keep_existing" | "replace_existing";
};

export type AiParseResponse = {
  entries: Array<AiDraftEntry & { referenceFields: string[] }>;
  lines: ClassifiedSourceLine[];
  questions: DraftQuestion[];
  issues: string[];
  metadata: {
    model: string;
    responseId: string;
    promptVersion: string;
    schemaVersion: string;
    inputTokens: number;
    outputTokens: number;
  };
};
