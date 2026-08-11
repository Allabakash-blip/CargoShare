export default function PageHeader({
  title,
  subtitle,
  children,
}) {
  return (
    <div
      className="
      flex
      flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-6
      mb-8
      pb-5
      border-b
      border-slate-200
      dark:border-slate-700
      transition-colors
      duration-300
      "
    >

      {/* Left Section */}

      <div>

        <h1
          className="
          text-4xl
          font-extrabold
          tracking-tight
          text-slate-800
          dark:text-white
          transition-colors
          duration-300
          "
        >
          {title}
        </h1>

        {subtitle && (

          <p
            className="
            mt-3
            text-base
            text-slate-500
            dark:text-slate-400
            transition-colors
            duration-300
            "
          >
            {subtitle}
          </p>

        )}

      </div>

      {/* Right Section */}

      {children && (

        <div className="flex items-center gap-3">

          {children}

        </div>

      )}

    </div>
  );
}