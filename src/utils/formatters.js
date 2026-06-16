export function formatVoltage(value, digits = 2) {
  if (!Number.isFinite(value)) return '-';
  return `${Number(value).toFixed(digits)} V`;
}

export function formatTime(value, digits = 4) {
  if (!Number.isFinite(value)) return '-';
  return `${Number(value).toFixed(digits)} s`;
}

export function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '-';
  return Number(value).toFixed(digits);
}
