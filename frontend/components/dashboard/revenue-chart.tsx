"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { date: string; revenue: number; orders: number };

type RevenueChartProps = {
  data: Point[];
  currency: string;
};

function formatDate(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function RevenueChart({ data, currency }: RevenueChartProps) {
  const chartData = data.map((p) => ({
    ...p,
    label: formatDate(p.date),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${currency === "EUR" ? "€" : currency}${v}`}
            width={48}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 10,
              border: "1px solid var(--border)",
              fontSize: 13,
            }}
            formatter={(value, name) => {
              if (name === "revenue") {
                return [
                  `${Number(value).toFixed(2)} ${currency}`,
                  "Revenue",
                ];
              }
              return [value, "Orders"];
            }}
            labelFormatter={(label) => String(label)}
          />
          <Bar
            dataKey="revenue"
            fill="var(--primary)"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
