import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getLogistics } from "../../services/logisticsService";
import Button from "../ui/Button";
export default function AssignLogisticsModal({
  booking,
  isOpen,
  onClose,
  onAssign,
}) {
  const [providers, setProviders] = useState([]);
  const [selected, setSelected] = useState("");
const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadProviders();
      setSelected("");
    }
  }, [isOpen]);

  const loadProviders = async () => {
    try {
      const data = await getLogistics();

      

      const availableProviders = data.filter(
        (item) => item.status === "Available"
      );

      

      setProviders(availableProviders);
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to load logistics providers"
      );
    }
  };

  const handleAssign = async () => {
  if (!selected) {
    toast.error("Please select a Logistics Provider");
    return;
  }

  try {
  setAssigning(true);

  await onAssign(
    booking.booking_id,
    Number(selected)
  );

  onClose();

} finally {
  setAssigning(false);
}
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 p-8">

        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          Assign Logistics
        </h2>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Booking #{booking.booking_id}
        </p>

        

        <div className="mt-5">

          <select
            value={selected}
            onChange={(e) =>
              setSelected(e.target.value)
            }
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-800
              dark:text-white
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            <option value="">
              Select Logistics Provider
            </option>

            {providers.map((item) => (
              <option
                key={item.logistics_id}
                value={item.logistics_id}
              >
                {item.company_name} -{" "}
                {item.vehicle_number}
              </option>
            ))}
          </select>

          {providers.length === 0 && (
            <p className="mt-3 text-sm text-red-500">
              No Available Logistics Providers Found
            </p>
          )}

        </div>

        <div className="mt-8 flex justify-end gap-4">

          <Button
  variant="outline"
  onClick={onClose}
  disabled={assigning}
>
  Cancel
</Button>

          <Button
  loading={assigning}
  disabled={assigning}
  onClick={handleAssign}
>
  Assign
</Button>

        </div>

      </div>

    </div>
  );
}