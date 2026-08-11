import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  Truck,
  CreditCard,
  BellRing,
  ArrowRight,
} from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Bookings",
      subtitle: "Manage cargo bookings",
      icon: PackagePlus,
      path: "/dashboard/bookings",
      gradient: "from-blue-500 to-blue-700",
    },
    {
      title: "Logistics",
      subtitle: "Manage providers",
      icon: Truck,
      path: "/dashboard/logistics",
      gradient: "from-emerald-500 to-green-700",
    },
    {
      title: "Payments",
      subtitle: "View transactions",
      icon: CreditCard,
      path: "/dashboard/payments",
      gradient: "from-violet-500 to-purple-700",
    },
    {
      title: "Notifications",
      subtitle: "Latest updates",
      icon: BellRing,
      path: "/dashboard/notifications",
      gradient: "from-orange-400 to-red-500",
    },
  ];

  return (
    <div className="mt-10">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

        <div>

          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            ⚡ Quick Actions
          </h2>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Frequently used shortcuts
          </p>

        </div>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {actions.map((action) => {

          const Icon = action.icon;

          return (

            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className="
              group
              relative
              overflow-hidden
              rounded-3xl
              bg-white
              dark:bg-slate-800
              border
              border-slate-200
              dark:border-slate-700
              p-6
              text-left
              shadow-md
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
              "
            >

              {/* Background Glow */}

              <div
                className="
                absolute
                -top-10
                -right-10
                w-32
                h-32
                rounded-full
                bg-blue-500/10
                blur-3xl
                opacity-0
                group-hover:opacity-100
                transition
                duration-500
                "
              />

              {/* Icon */}

              <div
                className={`
                relative
                w-16
                h-16
                rounded-2xl
                bg-gradient-to-br
                ${action.gradient}
                flex
                items-center
                justify-center
                shadow-xl
                group-hover:scale-110
                transition-transform
                duration-300
                `}
              >

                <Icon
                  size={30}
                  className="text-white"
                />

              </div>

              {/* Title */}

              <h3 className="mt-6 text-xl font-bold text-slate-800 dark:text-white">

                {action.title}

              </h3>

              {/* Subtitle */}

              <p className="mt-2 text-slate-500 dark:text-slate-400">

                {action.subtitle}

              </p>

              {/* Footer */}

              <div className="flex items-center mt-6 text-blue-600 dark:text-blue-400 font-semibold">

                Open

                <ArrowRight
                  size={18}
                  className="
                  ml-2
                  group-hover:translate-x-2
                  transition-transform
                  duration-300
                  "
                />

              </div>

            </button>

          );

        })}

      </div>

    </div>
  );
}