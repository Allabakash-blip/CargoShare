import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
];

export default function BookingStatusChart({
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
          Booking Status Distribution
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Shipment status overview
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
            innerRadius={55}
            paddingAngle={3}
            label
          >

            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}

          </Pie>

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

          <Legend
            verticalAlign="bottom"
            height={40}
            wrapperStyle={{
              color: "#94a3b8",
            }}
          />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}