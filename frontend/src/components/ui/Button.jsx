import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",

    success:
      "bg-green-600 hover:bg-green-700 text-white",

    danger:
      "bg-red-600 hover:bg-red-700 text-white",

    warning:
      "bg-yellow-500 hover:bg-yellow-600 text-white",

    secondary:
      `
      bg-slate-200
      dark:bg-slate-700
      hover:bg-slate-300
      dark:hover:bg-slate-600
      text-slate-700
      dark:text-white
      `,

    outline:
      `
      border
      border-slate-300
      dark:border-slate-600
      bg-white
      dark:bg-slate-800
      hover:bg-slate-50
      dark:hover:bg-slate-700
      text-slate-700
      dark:text-white
      `,
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        font-semibold
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-0.5
        active:scale-95
        disabled:opacity-60
        disabled:cursor-not-allowed
        focus:outline-none
        focus:ring-2
        focus:ring-blue-500
        focus:ring-offset-2
        dark:focus:ring-offset-slate-900
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2
          size={18}
          className="animate-spin"
        />
      ) : (
        <>
          {LeftIcon && (
            <LeftIcon size={18} />
          )}

          {children}

          {RightIcon && (
            <RightIcon size={18} />
          )}
        </>
      )}
    </button>
  );
}