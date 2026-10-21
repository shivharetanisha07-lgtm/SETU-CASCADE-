// Deterministic QR-like SVG graphic for visual representation
export default function QRCode({ value = "SETU", size = 120 }: { value?: string; size?: number }) {
  // Generate a stable pattern from the value string
  const seed = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng = (n: number) => ((seed * 1103515245 + n * 12345 + 1234567891) >>> 0) % 2;

  const cells = 21;
  const cell = size / cells;

  const matrix: number[][] = Array.from({ length: cells }, (_, r) =>
    Array.from({ length: cells }, (_, c) => {
      // Finder patterns (top-left, top-right, bottom-left)
      if ((r < 7 && c < 7) || (r < 7 && c >= cells - 7) || (r >= cells - 7 && c < 7)) {
        const ir = r < 7 ? r : r - (cells - 7);
        const ic = c < 7 ? c : c - (cells - 7);
        if (ir === 0 || ir === 6 || ic === 0 || ic === 6) return 1;
        if (ir >= 2 && ir <= 4 && ic >= 2 && ic <= 4) return 1;
        return 0;
      }
      // Timing patterns
      if (r === 6 && c >= 8 && c <= cells - 9) return c % 2 === 0 ? 1 : 0;
      if (c === 6 && r >= 8 && r <= cells - 9) return r % 2 === 0 ? 1 : 0;
      // Data area
      return rng(r * cells + c + seed);
    })
  );

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg">
      <rect width={size} height={size} fill="white" />
      {matrix.map((row, r) =>
        row.map((v, c) =>
          v ? <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#050e1f" /> : null
        )
      )}
    </svg>
  );
}
