import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function TopLogisticsChart({
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
          Top Logistics Providers
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Providers ranked by completed bookings
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={340}
      >

        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 20,
            left: 30,
            bottom: 5,
          }}
        >

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#334155"
            opacity={0.25}
          />

          <XAxis
            type="number"
            allowDecimals={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 13,
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            dataKey="name"
            type="category"
            width={140}
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

          <Bar
            dataKey="bookings"
            fill="#3b82f6"
            radius={[0, 12, 12, 0]}
            animationDuration={1200}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}