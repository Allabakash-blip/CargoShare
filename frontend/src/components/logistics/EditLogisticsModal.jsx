import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { updateLogistics } from "../../services/logisticsService";

const EditLogisticsModal = ({ logistics, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    user_id: "",
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    vehicle_type: "",
    vehicle_number: "",
    capacity: "",
    status: "",
  });

  useEffect(() => {
    if (logistics) {
      setForm({
        user_id: logistics.user_id,
        company_name: logistics.company_name,
        contact_person: logistics.contact_person,
        phone: logistics.phone,
        email: logistics.email,
        vehicle_type: logistics.vehicle_type,
        vehicle_number: logistics.vehicle_number,
        capacity: logistics.capacity,
        status: logistics.status,
      });
    }
  }, [logistics]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateLogistics(logistics.logistics_id, form);

      toast.success("Logistics updated successfully");

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update logistics");
    }
  };

  return (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div
      className="
        w-full
        max-w-2xl
        rounded-2xl
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-700
        shadow-2xl
        p-6
        relative
      "
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 text-slate-500 hover:text-red-500 transition"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
        Edit Logistics Provider
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4"
      >
        <input
          name="company_name"
          value={form.company_name}
          onChange={handleChange}
          placeholder="Company Name"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <input
          name="contact_person"
          value={form.contact_person}
          onChange={handleChange}
          placeholder="Contact Person"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <input
          name="vehicle_type"
          value={form.vehicle_type}
          onChange={handleChange}
          placeholder="Vehicle Type"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <input
          name="vehicle_number"
          value={form.vehicle_number}
          onChange={handleChange}
          placeholder="Vehicle Number"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <input
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacity"
          required
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            placeholder:text-slate-400
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="
            w-full
            rounded-lg
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            p-3
            focus:ring-2
            focus:ring-blue-500
            outline-none
          "
        >
          <option value="Available">Available</option>
          <option value="Busy">Busy</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="col-span-2 flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="
              px-5
              py-2
              rounded-lg
              border
              border-slate-300
              dark:border-slate-600
              text-slate-700
              dark:text-white
              hover:bg-slate-100
              dark:hover:bg-slate-800
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
              px-5
              py-2
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              text-white
            "
          >
            Update Logistics
          </button>
        </div>
      </form>
    </div>
  </div>
);
};

export default EditLogisticsModal;