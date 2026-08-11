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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div
        className="
        w-[520px]
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

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Add Container
        </h2>

        <div className="space-y-5">

          <input
            type="text"
            name="container_number"
            placeholder="Container Number"
            value={formData.container_number}
            onChange={handleChange}
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
            "
          />

          <input
            type="text"
            name="container_type"
            placeholder="Container Type"
            value={formData.container_type}
            onChange={handleChange}
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
            "
          />

          <input
            type="text"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
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
            "
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="
              px-6
              py-3
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              hover:bg-slate-100
              dark:hover:bg-slate-800
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