export default function Card({
  title,
  subtitle,
  children,
  action,
  className = "",
}) {
  return (
    <div
      className={`
        bg-white
        rounded-3xl
        border
        border-slate-200
        shadow-sm
        hover:shadow-lg
        transition-all
        duration-300
        ${className}
      `}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

          <div>

            {title && (
              <h2 className="text-xl font-bold text-slate-800">
                {title}
              </h2>
            )}

            {subtitle && (
              <p className="text-sm text-slate-500 mt-1">
                {subtitle}
              </p>
            )}

          </div>

          {action && action}

        </div>
      )}

      <div className="p-6">
        {children}
      </div>
    </div>
  );
}