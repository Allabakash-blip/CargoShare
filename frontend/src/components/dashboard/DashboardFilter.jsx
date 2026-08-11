export default function DashboardFilter({
  filter,
  setFilter,
}) {
  return (
    <div className="flex items-center gap-3">

      <span className="text-sm font-semibold text-slate-600">
        Filter:
      </span>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-4 py-2 rounded-xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="today">
          Today
        </option>

        <option value="7days">
          Last 7 Days
        </option>

        <option value="30days">
          Last 30 Days
        </option>

        <option value="month">
          This Month
        </option>

        <option value="year">
          This Year
        </option>

      </select>

    </div>
  );
}