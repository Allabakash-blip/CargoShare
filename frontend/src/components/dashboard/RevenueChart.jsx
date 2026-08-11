import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function RevenueChart({ dashboard }) {
  const data = [
    {
      name: "Total",
      value: dashboard.total_bookings,
    },
    {
      name: "Pending",
      value: dashboard.pending_bookings,
    },
    {
      name: "Assigned",
      value: dashboard.assigned_bookings,
    },
    {
      name: "Transit",
      value: dashboard.in_transit_bookings,
    },
    {
      name: "Completed",
      value: dashboard.completed_bookings,
    },
  ];

  return (
    <div
      className="
      bg-white
      dark:bg-slate-800
      rounded-3xl
      shadow-md
      border
      border-slate-200
      dark:border-slate-700
      p-7
      hover:shadow-2xl
      transition-all
      duration-300
      "
    >

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Booking Overview
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Current shipment statistics
          </p>

        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={340}
      >

        <BarChart data={data}>

          <CartesianGrid
            strokeDasharray="4 4"
            stroke="#475569"
            opacity={0.25}
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94A3B8",
              fontSize: 13,
            }}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#94A3B8",
              fontSize: 13,
            }}
          />

          <Tooltip
            cursor={{
              fill: "rgba(59,130,246,0.08)",
            }}
            contentStyle={{
              background: "#1E293B",
              border: "1px solid #334155",
              borderRadius: "14px",
              color: "#fff",
              boxShadow:
                "0 12px 30px rgba(0,0,0,.35)",
            }}
            labelStyle={{
              color: "#fff",
              fontWeight: "600",
            }}
          />

          <Bar
            dataKey="value"
            fill="#2563EB"
            radius={[12, 12, 0, 0]}
            animationDuration={1200}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>
  );
}