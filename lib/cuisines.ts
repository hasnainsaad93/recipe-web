export const CUISINES = [
  "Italian",
  "Indian",
  "Mexican",
  "Chinese",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Korean",
  "Other",
] as const;

export function isCuisine(v: unknown): v is string {
  return typeof v === "string" && (CUISINES as readonly string[]).includes(v);
}
