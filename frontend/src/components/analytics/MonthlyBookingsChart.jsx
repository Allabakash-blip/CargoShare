import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MonthlyBookingsChart({
  data,
}) {
  return (
    <div
      className="
        rounded-3xl
        bg-white
        dark:bg-slate-900
        transition-all
      "
    >
      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Monthly Bookings Trend
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Monthly shipment growth overview
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={340}
      >

        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#334155"
            opacity={0.25}
          />

          <XAxis
            dataKey="month"
            tick={{
              fill: "#94a3b8",
              fontSize: 13,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            allowDecimals={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 13,
            }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "none",
              borderRadius: "16px",
              color: "#fff",
              boxShadow:
                "0 12px 30px rgba(0,0,0,.35)",
            }}
            labelStyle={{
              color: "#fff",
              fontWeight: 600,
            }}
          />

          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#3b82f6"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#3b82f6",
            }}
            activeDot={{
              r: 8,
              fill: "#2563eb",
            }}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}