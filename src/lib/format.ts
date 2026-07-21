export function fmt(n: number, decimals = 3): string {
  if (!isFinite(n)) return "0";
  const r = Number(n.toFixed(decimals));
  return r.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
