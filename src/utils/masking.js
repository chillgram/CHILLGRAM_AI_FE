export function maskName(name = "") {
  const trimmed = String(name).trim();
  if (!trimmed) return "익명";

  return trimmed[0] + "*".repeat(trimmed.length - 1);
}