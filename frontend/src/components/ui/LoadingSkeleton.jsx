export default function LoadingSkeleton({
  rows = 5,
  cards = true,
}) {
  return (
    <div className="animate-pulse">

      {/* Page Title */}

      <div className="h-8 w-72 rounded-xl bg-slate-200 dark:bg-slate-700 mb-8"></div>

      {/* KPI Cards */}

      {cards && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="
                rounded-3xl
                border
                border-slate-200
                dark:border-slate-700
                bg-white
                dark:bg-slate-900
                p-6
              "
            >
              <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700"></div>

              <div className="h-10 w-20 mt-6 rounded bg-slate-300 dark:bg-slate-600"></div>

              <div className="h-3 w-32 mt-8 rounded bg-slate-200 dark:bg-slate-700"></div>
            </div>
          ))}

        </div>
      )}

      {/* Table */}

      <div
        className="
          rounded-3xl
          border
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-900
          p-6
        "
      >
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className="
              h-12
              rounded-xl
              mb-4
              bg-slate-200
              dark:bg-slate-700
            "
          />
        ))}
      </div>

    </div>
  );
}