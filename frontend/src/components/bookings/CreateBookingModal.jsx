import { useState } from "react";
import { createPortal } from "react-dom";

import {
  X,
  MapPin,
  Package,
  Weight,
  IndianRupee,
} from "lucide-react";

import Button from "../ui/Button";

export default function CreateBookingModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    pickup_location: "",
    delivery_location: "",
    goods_description: "",
    weight: "",
    amount: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // ----------------------------------------------
    // Validate required fields
    // ----------------------------------------------

    if (
      !formData.pickup_location.trim() ||
      !formData.delivery_location.trim() ||
      !formData.goods_description.trim() ||
      !formData.weight ||
      !formData.amount
    ) {
      alert("Please fill in all fields.");
      return;
    }

    // ----------------------------------------------
    // Validate weight
    // ----------------------------------------------

    if (Number(formData.weight) <= 0) {
      alert("Weight must be greater than 0.");
      return;
    }

    // ----------------------------------------------
    // Validate amount
    // ----------------------------------------------

    if (Number(formData.amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      // --------------------------------------------
      // Create booking
      // --------------------------------------------

      await onCreate({
        pickup_location: formData.pickup_location.trim(),
        delivery_location: formData.delivery_location.trim(),
        goods_description: formData.goods_description.trim(),
        weight: Number(formData.weight),
        amount: Number(formData.amount),
      });

      // --------------------------------------------
      // Reset form
      // --------------------------------------------

      setFormData({
        pickup_location: "",
        delivery_location: "",
        goods_description: "",
        weight: "",
        amount: "",
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]

        flex
        items-center
        justify-center

        bg-black/50
        dark:bg-black/70

        backdrop-blur-sm

        p-6
      "
    >
      <div
        className="
          relative

          w-full
          max-w-xl

          rounded-3xl

          bg-white
          dark:bg-slate-900

          border
          border-slate-200
          dark:border-slate-700

          shadow-2xl

          transition-colors
          duration-300

          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* ==========================================
            HEADER
        ========================================== */}

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
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Create Booking
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                dark:text-slate-400
                mt-1
              "
            >
              Enter shipment information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              h-10
              w-10

              rounded-xl

              flex
              items-center
              justify-center

              hover:bg-slate-100
              dark:hover:bg-slate-800

              transition-all

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <X
              size={20}
              className="text-slate-600 dark:text-slate-300"
            />
          </button>
        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <div className="p-8 space-y-5">

          {/* Pickup Location */}

          <div className="relative">
            <MapPin
              size={18}
              className="
                absolute
                left-4
                top-4
                text-slate-400
              "
            />

            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="Pickup Location"
              disabled={loading}
              className="
                w-full

                rounded-2xl

                border
                border-slate-300
                dark:border-slate-600

                bg-white
                dark:bg-slate-800

                text-slate-900
                dark:text-white

                placeholder:text-slate-400

                pl-11
                pr-4
                py-3

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {/* Delivery Location */}

          <div className="relative">
            <MapPin
              size={18}
              className="
                absolute
                left-4
                top-4
                text-slate-400
              "
            />

            <input
              type="text"
              name="delivery_location"
              value={formData.delivery_location}
              onChange={handleChange}
              placeholder="Delivery Location"
              disabled={loading}
              className="
                w-full

                rounded-2xl

                border
                border-slate-300
                dark:border-slate-600

                bg-white
                dark:bg-slate-800

                text-slate-900
                dark:text-white

                placeholder:text-slate-400

                pl-11
                pr-4
                py-3

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {/* Goods Description */}

          <div className="relative">
            <Package
              size={18}
              className="
                absolute
                left-4
                top-4
                text-slate-400
              "
            />

            <input
              type="text"
              name="goods_description"
              value={formData.goods_description}
              onChange={handleChange}
              placeholder="Goods Description"
              disabled={loading}
              className="
                w-full

                rounded-2xl

                border
                border-slate-300
                dark:border-slate-600

                bg-white
                dark:bg-slate-800

                text-slate-900
                dark:text-white

                placeholder:text-slate-400

                pl-11
                pr-4
                py-3

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {/* Weight */}

          <div className="relative">
            <Weight
              size={18}
              className="
                absolute
                left-4
                top-4
                text-slate-400
              "
            />

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              min="0"
              step="0.01"
              disabled={loading}
              className="
                w-full

                rounded-2xl

                border
                border-slate-300
                dark:border-slate-600

                bg-white
                dark:bg-slate-800

                text-slate-900
                dark:text-white

                placeholder:text-slate-400

                pl-11
                pr-4
                py-3

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

          {/* Amount */}

          <div className="relative">
            <IndianRupee
              size={18}
              className="
                absolute
                left-4
                top-4
                text-slate-400
              "
            />

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount (₹)"
              min="0"
              step="0.01"
              disabled={loading}
              className="
                w-full

                rounded-2xl

                border
                border-slate-300
                dark:border-slate-600

                bg-white
                dark:bg-slate-800

                text-slate-900
                dark:text-white

                placeholder:text-slate-400

                pl-11
                pr-4
                py-3

                focus:outline-none
                focus:ring-2
                focus:ring-blue-500

                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            />
          </div>

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div
          className="
            flex
            justify-end
            gap-3

            px-8
            py-6

            border-t
            border-slate-200
            dark:border-slate-700
          "
        >

          {/* Cancel */}

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              px-6
              py-3

              rounded-2xl

              border
              border-slate-300
              dark:border-slate-600

              text-slate-700
              dark:text-slate-300

              hover:bg-slate-100
              dark:hover:bg-slate-800

              transition-all

              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            Cancel
          </button>

          {/* Create */}

          <Button
            loading={loading}
            disabled={loading}
            onClick={handleSubmit}
            className="
              rounded-2xl

              bg-gradient-to-r
              from-blue-600
              to-cyan-500

              shadow-lg
              shadow-blue-500/30

              hover:scale-105

              transition-all
            "
          >
            Create Booking
          </Button>

        </div>

      </div>
    </div>,
    document.body
  );
}