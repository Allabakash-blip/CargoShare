import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "from-blue-600 to-cyan-500",
}) {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-3xl
      bg-white
      dark:bg-slate-800
      p-7
      border
      border-slate-200
      dark:border-slate-700
      shadow-md
      hover:shadow-2xl
      hover:-translate-y-2
      transition-all
      duration-500
      "
    >

      {/* Glow Effect */}

      <div
        className="
        absolute
        -top-8
        -right-8
        h-28
        w-28
        rounded-full
        bg-blue-200
        dark:bg-blue-700
        opacity-0
        group-hover:opacity-40
        blur-3xl
        transition-all
        duration-500
        "
      />

      <div className="flex justify-between items-start">

        <div>

          <p
            className="
            text-slate-500
            dark:text-slate-400
            text-sm
            font-semibold
            uppercase
            tracking-widest
            "
          >
            {title}
          </p>

          <h1
            className="
            text-5xl
            font-extrabold
            mt-4
            text-slate-800
            dark:text-white
            "
          >
            {value}
          </h1>

          <div
            className="
            flex
            items-center
            mt-5
            text-green-600
            dark:text-green-400
            text-sm
            font-semibold
            "
          >

            <ArrowUpRight size={17} />

            <span className="ml-1">
              Updated Live
            </span>

          </div>

        </div>

        {Icon && (

          <div
            className={`
              h-20
              w-20
              rounded-3xl
              bg-gradient-to-br
              ${color}
              flex
              items-center
              justify-center
              shadow-xl
              group-hover:scale-110
              transition-all
              duration-500
            `}
          >

            <Icon
              size={38}
              className="text-white"
            />

          </div>

        )}

      </div>

    </div>
  );
}