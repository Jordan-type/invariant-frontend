"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Segment = {
  label: string;
  value: number; // 0..1 (share of total)
};

type TVLGaugeProps = {
  value?: number; // 0..1 overall fill; if omitted we draw full arc using segments
  segments?: Segment[]; // shares that sum ~ 1
  label?: string; // center big text (e.g. "$199.05")
  subtitle?: string; // center small text (e.g. "Total Wallet Value")
  className?: string;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

/**
 * Semi-circle gauge (180°) from left (180°) to right (0°).
 * We render an "outer arc" track and then draw segmented strokes on top.
 */
export default function TVLGauge({
  value,
  segments,
  label = "",
  subtitle = "Total Wallet Value",
  className,
}: TVLGaugeProps) {
  const W = 520;
  const H = 300;

  // Gauge geometry
  const cx = W / 2;
  const cy = 250;
  const r = 180;
  const thickness = 44;

  const startAngle = 180;
  const endAngle = 0;

  const trackPath = describeArc(cx, cy, r, startAngle, endAngle);

  // If segments provided, use them. Else, fallback to single segment fill using `value`.
  const segs: Segment[] = React.useMemo(() => {
    const clean = (segments ?? []).filter((s) => s.value > 0);
    if (clean.length > 0) {
      // Normalize in case they don't sum exactly to 1
      const sum = clean.reduce((a, s) => a + s.value, 0) || 1;
      return clean.map((s) => ({ ...s, value: s.value / sum }));
    }
    return [{ label: "value", value: clamp01(value ?? 0) }];
  }, [segments, value]);

  // Tooltip state
  const [hover, setHover] = React.useState<{
    label: string;
    pct: number;
    x: number;
    y: number;
  } | null>(null);

  // Color strategy:
  // We keep it simple and CSS-variable-friendly.
  // - First segment: primary (Invariant gold)
  // - Second segment: secondary (signal teal)
  // - Others: muted foreground with opacity
  const segColors = (idx: number) => {
    if (idx === 0) return "hsl(var(--primary))";
    if (idx === 1) return "hsl(var(--secondary))";
    return "hsl(var(--muted-foreground))";
  };

  // Convert segment shares into angle ranges along 180° arc
// Convert segment shares into angle ranges along 180° arc (immutable)
const segmentsWithAngles = React.useMemo(() => {
  return segs.reduce<
    Array<Segment & { idx: number; segStart: number; segEnd: number }>
  >((acc, s, idx) => {
    const prevEnd = acc.length === 0 ? startAngle : acc[acc.length - 1].segEnd;
    const span = 180 * s.value;
    const segStart = prevEnd;
    const segEnd = prevEnd - span;
    acc.push({ ...s, idx, segStart, segEnd });
    return acc;
  }, []);
}, [segs, startAngle]);


  return (
    <div className={cn("relative w-full flex items-center justify-center", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[560px]">
        {/* Track */}
        <path
          d={trackPath}
          stroke="hsl(var(--border))"
          strokeWidth={thickness}
          strokeLinecap="butt"
          fill="none"
          opacity={0.6}
        />

        {/* Segments */}
        {segmentsWithAngles.map((s) => {
          // tiny padding between segments for separation
          const pad = 0.9;
          const segPath = describeArc(cx, cy, r, s.segStart - pad, s.segEnd + pad);

          // compute a tooltip anchor at the middle angle
          const mid = (s.segStart + s.segEnd) / 2;
          const p = polarToCartesian(cx, cy, r, mid);

          return (
            <path
              key={`${s.label}-${s.idx}`}
              d={segPath}
              stroke={segColors(s.idx)}
              strokeWidth={thickness}
              strokeLinecap="butt"
              fill="none"
              style={{ cursor: "default" }}
              onMouseEnter={() => {
                setHover({
                  label: s.label,
                  pct: Math.round(s.value * 1000) / 10, // 1 decimal
                  x: p.x,
                  y: p.y,
                });
              }}
              onMouseMove={() => {
                setHover({
                  label: s.label,
                  pct: Math.round(s.value * 1000) / 10,
                  x: p.x,
                  y: p.y,
                });
              }}
              onMouseLeave={() => setHover(null)}
            />
          );
        })}

        {/* Center labels */}
        <text x={cx} y={150} textAnchor="middle" className="fill-muted-foreground" fontSize="16">
          {subtitle}
        </text>
        <text x={cx} y={190} textAnchor="middle" className="fill-foreground" fontSize="34" fontWeight="600">
          {label}
        </text>

        {/* Tooltip */}
        {hover && (
          <g>
            {/* Tooltip background */}
            <rect
              x={Math.min(Math.max(hover.x - 62, 16), W - 140)}
              y={Math.min(Math.max(hover.y - 56, 16), H - 52)}
              width="124"
              height="44"
              rx="10"
              fill="hsl(var(--background))"
              stroke="hsl(var(--border))"
              opacity="0.95"
            />
            <text
              x={Math.min(Math.max(hover.x, 16 + 62), W - 16 - 62)}
              y={Math.min(Math.max(hover.y - 30, 16 + 16), H - 16 - 18)}
              textAnchor="middle"
              className="fill-foreground"
              fontSize="12"
              fontWeight="600"
            >
              {hover.label.toUpperCase()}
            </text>
            <text
              x={Math.min(Math.max(hover.x, 16 + 62), W - 16 - 62)}
              y={Math.min(Math.max(hover.y - 14, 16 + 30), H - 16 - 4)}
              textAnchor="middle"
              className="fill-muted-foreground"
              fontSize="12"
            >
              {hover.pct}% of total
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
