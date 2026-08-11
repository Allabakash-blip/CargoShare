export default function Table({
  columns,
  data,
  renderRow,
  emptyMessage = "No data found",
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-50 border-b">

            <tr>

              {columns.map((column) => (

                <th
                  key={column}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-600 uppercase tracking-wide"
                >
                  {column}
                </th>

              ))}

            </tr>

          </thead>

          <tbody>

            {data.length > 0 ? (

              data.map(renderRow)

            ) : (

              <tr>

                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}