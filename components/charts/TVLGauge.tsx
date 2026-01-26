"use client";

import * as React from "react";
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

type Segment = {
  label: string;
  value: number; // 0..1 share of total
  color?: string; // optional (hex/hsl/var)
};

type TVLGaugeProps = {
  segments?: Segment[];
  label?: string; // center big text (e.g. "$189.32")
  subtitle?: string; // center small text
  className?: string;

  // optional sizing knobs
  innerRadius?: number;
  outerRadius?: number;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export default function TVLGauge({
  segments = [],
  label = "",
  subtitle = "Total Wallet Value",
  className,
  innerRadius = 80,
  outerRadius = 130,
}: TVLGaugeProps) {
  // keep only >0, normalize to sum=1
  const clean = React.useMemo(() => {
    const positive = segments.filter((s) => (s.value ?? 0) > 0);
    const sum = positive.reduce((a, s) => a + s.value, 0) || 1;
    return positive.map((s) => ({ ...s, value: clamp01(s.value / sum) }));
  }, [segments]);

  // Recharts stacked radial wants one row of data with many keys
  const data = React.useMemo(() => {
    const row: Record<string, number | string> = { name: "tvl" };
    clean.forEach((s, i) => {
      row[`seg_${i}`] = s.value * 100; // use percentages so tooltip looks nice
    });
    return [row];
  }, [clean]);

  // Build chart config + css variables used by shadcn ChartContainer
  const chartConfig = React.useMemo(() => {
    const cfg: ChartConfig = {};
    clean.forEach((s, i) => {
      cfg[`seg_${i}`] = {
        label: s.label,
        color:
          s.color ??
          (i === 0 ? "hsl(var(--primary))" : i === 1 ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground))"),
      };
    });
    return cfg;
  }, [clean]);

  // If no segments, show an empty track
  const hasSegments = clean.length > 0;

  return (
    <div className={cn("w-full flex items-center justify-center", className)}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-[2/1] w-full max-w-[560px]"
      >
        <RadialBarChart
          data={data}
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

          {/* hide ticks/axis line, but use Label for center text */}
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;
                const cx = viewBox.cx as number;
                const cy = viewBox.cy as number;

                return (
                  <text x={cx} y={cy} textAnchor="middle">
                    <tspan x={cx} y={cy - 12} className="fill-muted-foreground text-sm">
                      {subtitle}
                    </tspan>
                    <tspan x={cx} y={cy + 18} className="fill-foreground text-3xl font-semibold">
                      {label}
                    </tspan>
                  </text>
                );
              }}
            />
          </PolarRadiusAxis>

          {/* Track (optional): if you want the faint background ring */}
          {!hasSegments ? (
            <RadialBar
              dataKey="__empty"
              fill="hsl(var(--border))"
              cornerRadius={8}
              className="opacity-60 stroke-transparent stroke-2"
            />
          ) : null}

          {/* Stacked segments */}
          {clean.map((s, i) => (
            <RadialBar
              key={s.label + i}
              dataKey={`seg_${i}`}
              stackId="a"
              cornerRadius={8}
              fill={`var(--color-seg_${i})`}
              className="stroke-transparent stroke-2"
            />
          ))}
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
}
