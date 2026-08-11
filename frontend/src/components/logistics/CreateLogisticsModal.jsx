import { useEffect, useState } from "react";
import { X, Truck } from "lucide-react";
import { toast } from "react-toastify";

import api from "../../api/axios";
import { getToken } from "../../utils/auth";
import { createLogistics } from "../../services/logisticsService";

export default function CreateLogisticsModal({
  isOpen,
  onClose,
  onSuccess,
}) {
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    user_id: "",
    company_name: "",
    contact_person: "",
    phone: "",
    email: "",
    vehicle_type: "",
    vehicle_number: "",
    capacity: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const token = getToken();

      const res = await api.get(
        "/users/logistics-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Unable to load Logistics users");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.user_id) {
      toast.error("Please select a Logistics User");
      return;
    }

    try {
      await createLogistics({
        ...form,
        user_id: Number(form.user_id),
      });

      toast.success(
        "Logistics Provider Created Successfully"
      );

      setForm({
        user_id: "",
        company_name: "",
        contact_person: "",
        phone: "",
        email: "",
        vehicle_type: "",
        vehicle_number: "",
        capacity: "",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.detail ||
          "Failed to create Logistics Provider"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/60
      backdrop-blur-md
      p-6
    "
    >
      <div
        className="
        w-full
        max-w-5xl
        rounded-3xl
        bg-white
        dark:bg-slate-900
        border
        border-slate-200
        dark:border-slate-700
        shadow-2xl
        overflow-hidden
      "
      >
        {/* Header */}

        <div
          className="
          flex
          items-center
          justify-between
          px-8
          py-6
          border-b
          border-slate-200
          dark:border-slate-700
        "
        >
          <div className="flex items-center gap-4">
            <div
              className="
              h-14
              w-14
              rounded-2xl
              bg-gradient-to-br
              from-blue-600
              to-cyan-500
              flex
              items-center
              justify-center
              shadow-lg
            "
            >
              <Truck
                size={28}
                className="text-white"
              />
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
                Add Logistics Provider
              </h2>

              <p className="mt-1 text-slate-500 dark:text-slate-400">
                Register a new logistics provider
                into CargoShare.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              h-12
              w-12
              rounded-xl
              hover:bg-slate-100
              dark:hover:bg-slate-800
              flex
              items-center
              justify-center
              transition
            "
          >
            <X className="text-slate-500" />
          </button>
        </div>

        {/* Body */}

        <div className="p-8 grid grid-cols-2 gap-6">
                    <select
            name="user_id"
            value={form.user_id}
            onChange={handleChange}
            className="
              w-full
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          >
            <option value="">
              Select Logistics User
            </option>

            {users.map((user) => (
              <option
                key={user.user_id}
                value={user.user_id}
              >
                {user.full_name} ({user.email})
              </option>
            ))}
          </select>

          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />

          <input
            type="text"
            name="contact_person"
            value={form.contact_person}
            onChange={handleChange}
            placeholder="Contact Person"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />

          <input
            type="text"
            name="vehicle_type"
            value={form.vehicle_type}
            onChange={handleChange}
            placeholder="Vehicle Type"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />
                    <input
            type="text"
            name="vehicle_number"
            value={form.vehicle_number}
            onChange={handleChange}
            placeholder="Vehicle Number"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />

          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Capacity (Tons)"
            className="
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-5
              py-4
              text-slate-700
              dark:text-white
              placeholder:text-slate-400
              outline-none
              focus:ring-4
              focus:ring-blue-500/20
              focus:border-blue-500
              transition
            "
          />

        </div>

        {/* Footer */}

        <div
          className="
            flex
            justify-end
            gap-4
            px-8
            py-6
            border-t
            border-slate-200
            dark:border-slate-700
            bg-slate-50
            dark:bg-slate-900/40
          "
        >
          <button
            onClick={onClose}
            className="
              px-6
              py-3
              rounded-2xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              text-slate-700
              dark:text-white
              hover:bg-slate-100
              dark:hover:bg-slate-700
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-8
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              text-white
              font-semibold
              shadow-lg
              hover:scale-105
              hover:shadow-xl
              transition-all
              duration-300
            "
          >
            Save Logistics
          </button>
        </div>
      </div>
    </div>
  );
}