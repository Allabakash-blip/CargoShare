import { useState } from "react";
import Button from "../ui/Button";

export default function CreateContainerModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    container_number: "",
    container_type: "",
    capacity: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await onCreate(formData);

      setFormData({
        container_number: "",
        container_type: "",
        capacity: "",
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          z-[10000]
          w-[520px]
          max-w-[90vw]
          rounded-3xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-700
          shadow-2xl
          p-8
          transition-colors
          duration-300
        "
      >
        {/* Header */}

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Add Container
        </h2>

        {/* Form */}

        <div className="space-y-5">

          {/* Container Number */}

          <input
            type="text"
            name="container_number"
            placeholder="Container Number"
            value={formData.container_number}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
              disabled:opacity-60
            "
          />

          {/* Container Type */}

          <input
            type="text"
            name="container_type"
            placeholder="Container Type"
            value={formData.container_type}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
              disabled:opacity-60
            "
          />

          {/* Capacity */}

          <input
            type="text"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            disabled={loading}
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-800
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              px-4
              py-3
              focus:ring-2
              focus:ring-blue-500
              outline-none
              disabled:opacity-60
            "
          />

        </div>

        {/* Buttons */}

        <div className="flex justify-end gap-4 mt-8">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              px-6
              py-3
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              text-slate-700
              dark:text-slate-300
              hover:bg-slate-100
              dark:hover:bg-slate-800
              disabled:opacity-50
              transition
            "
          >
            Cancel
          </button>

          <Button
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            className="
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              hover:from-blue-700
              hover:to-indigo-700
              text-white
              font-semibold
            "
          >
            Add Container
          </Button>

        </div>
      </div>
    </div>
  );
}