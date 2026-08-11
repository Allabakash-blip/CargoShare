import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#F59E0B", // Pending
  "#3B82F6", // Assigned
  "#8B5CF6", // Transit
  "#22C55E", // Completed
];

export default function StatusChart({ dashboard }) {
  const data = [
    {
      name: "Pending",
      value: dashboard.pending_bookings,
    },
    {
      name: "Assigned",
      value: dashboard.assigned_bookings,
    },
    {
      name: "In Transit",
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

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Booking Status
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Shipment distribution
        </p>

      </div>

      <ResponsiveContainer
        width="100%"
        height={340}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={60}
            paddingAngle={4}
            animationDuration={1200}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index]}
              />

            ))}

          </Pie>

          <Tooltip
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

          <Legend
            verticalAlign="bottom"
            height={40}
            wrapperStyle={{
              color: "#94A3B8",
              paddingTop: "12px",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}