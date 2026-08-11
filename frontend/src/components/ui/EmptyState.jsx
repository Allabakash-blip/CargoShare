import { PackageOpen } from "lucide-react";

export default function EmptyState({
  title = "No Data Found",
  subtitle = "There is nothing to display.",
}) {
  return (
    <div className="py-16 flex flex-col items-center">

      <div className="bg-slate-100 rounded-full p-5">
        <PackageOpen
          size={42}
          className="text-slate-500"
        />
      </div>

      <h2 className="mt-6 text-2xl font-semibold text-slate-700">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}