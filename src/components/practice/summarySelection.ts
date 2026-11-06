/* Which students the period summary exports and in what order, per course or homework, kept
   in localStorage: the teacher unticks a test account once and it stays unticked on this
   device, and sorts the list once to match the grade book. */

const STORAGE_KEY_PREFIX: string = 'learn.practice.summary.';

export type SummarySelection = {
  /** Student uids, top first; students not listed follow in alphabetical order. */
  order: string[];
  /** Ticks the teacher set by hand; a student not listed is ticked while they have activity. */
  checked: Record<string, boolean>;
};

export const EMPTY_SELECTION: SummarySelection = { order: [], checked: {} };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function checkedOf(value: unknown): Record<string, boolean> {
  if (typeof value !== 'object' || value === null) return {};
  const checked: Record<string, boolean> = {};
  for (const [uid, isChecked] of Object.entries(value)) {
    if (typeof isChecked === 'boolean') checked[uid] = isChecked;
  }
  return checked;
}

export function readSummarySelection(scopeKey: string): SummarySelection {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY_PREFIX + scopeKey);
    if (!stored) return EMPTY_SELECTION;
    const parsed: unknown = JSON.parse(stored);
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_SELECTION;
    const { order, checked } = parsed as { order?: unknown; checked?: unknown };
    return { order: isStringArray(order) ? order : [], checked: checkedOf(checked) };
  } catch {
    // Private windows and blocked site data throw on access; the defaults still work.
    return EMPTY_SELECTION;
  }
}

export function saveSummarySelection(scopeKey: string, selection: SummarySelection): void {
  try {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + scopeKey, JSON.stringify(selection));
  } catch {
    // Nothing to do: the selection just will not survive a reload.
  }
}

/** The students in the stored order first, then the rest as given. */
export function orderedBy<T extends { uid: string }>(students: readonly T[], order: readonly string[]): T[] {
  const byUid = new Map(students.map((student) => [student.uid, student]));
  const placed = order.map((uid) => byUid.get(uid)).filter((student): student is T => student !== undefined);
  const placedUids = new Set(placed.map((student) => student.uid));
  return [...placed, ...students.filter((student) => !placedUids.has(student.uid))];
}

/** `uids` with the one at `index` swapped with its neighbour `delta` places away. */
export function movedOrder(uids: readonly string[], index: number, delta: number): string[] {
  const target = index + delta;
  const moved = [...uids];
  if (target < 0 || target >= uids.length) return moved;
  [moved[index], moved[target]] = [moved[target], moved[index]];
  return moved;
}
