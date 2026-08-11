import { useState } from "react";
import { X, MapPin, Package, Weight } from "lucide-react";
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
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);

    await onCreate({
      ...formData,
      weight: Number(formData.weight),
    });

    setFormData({
      pickup_location: "",
      delivery_location: "",
      goods_description: "",
      weight: "",
    });

    onClose();
  } finally {
    setLoading(false);
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

      bg-black/50
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
          <div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create Booking
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Enter shipment information
            </p>

          </div>

          <button
            onClick={onClose}
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
            "
          >
            <X
              size={20}
              className="text-slate-600 dark:text-slate-300"
            />
          </button>

        </div>

        {/* Form */}

        <div className="p-8 space-y-5">

          <div className="relative">

            <MapPin
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="Pickup Location"
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
              "
            />

          </div>

          <div className="relative">

            <MapPin
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              name="delivery_location"
              value={formData.delivery_location}
              onChange={handleChange}
              placeholder="Delivery Location"
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
              "
            />

          </div>

          <div className="relative">

            <Package
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              name="goods_description"
              value={formData.goods_description}
              onChange={handleChange}
              placeholder="Goods Description"
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
              "
            />

          </div>

          <div className="relative">

            <Weight
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
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
              "
            />

          </div>

        </div>

        {/* Footer */}

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
          <button
            onClick={onClose}
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
            "
          >
            Cancel
          </button>

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
  "
>
  Create Booking
</Button>

        </div>

      </div>
    </div>
  );
}