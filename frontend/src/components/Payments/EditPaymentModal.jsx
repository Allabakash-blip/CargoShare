import { useEffect, useState } from "react";
import {
  X,
  CreditCard,
  IndianRupee,
  BadgeCheck,
} from "lucide-react";

export default function EditPaymentModal({
  isOpen,
  onClose,
  payment,
  onUpdate,
}) {
  const [paymentStatus, setPaymentStatus] =
    useState("Pending");

  useEffect(() => {
    if (payment) {
      setPaymentStatus(
        payment.payment_status
      );
    }
  }, [payment]);

  const handleSubmit = async () => {
    await onUpdate({
      payment_status: paymentStatus,
    });

    onClose();
  };

  if (!isOpen || !payment) return null;

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
              Update Payment
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Modify payment status
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

            transition
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

          {/* Booking */}

          <div className="relative">

            <CreditCard
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              disabled
              value={`Booking #${payment.booking_id}`}
              className="
              w-full

              rounded-2xl

              border
              border-slate-300
              dark:border-slate-600

              bg-slate-100
              dark:bg-slate-800

              text-slate-700
              dark:text-white

              pl-11
              pr-4
              py-3
              "
            />

          </div>

          {/* Amount */}

          <div className="relative">

            <IndianRupee
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <input
              type="text"
              disabled
              value={payment.amount}
              className="
              w-full

              rounded-2xl

              border
              border-slate-300
              dark:border-slate-600

              bg-slate-100
              dark:bg-slate-800

              text-slate-700
              dark:text-white

              pl-11
              pr-4
              py-3
              "
            />

          </div>

          {/* Status */}

          <div className="relative">

            <BadgeCheck
              size={18}
              className="absolute left-4 top-4 text-slate-400"
            />

            <select
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(
                  e.target.value
                )
              }
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

              pl-11
              pr-4
              py-3

              focus:outline-none
              focus:ring-2
              focus:ring-blue-500

              transition
              "
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Failed">
                Failed
              </option>

            </select>

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

            transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
            px-7
            py-3

            rounded-2xl

            bg-gradient-to-r
            from-blue-600
            to-cyan-500

            text-white
            font-semibold

            shadow-lg
            shadow-blue-500/30

            hover:scale-105

            transition-all
            duration-300
            "
          >
            Update Payment
          </button>

        </div>

      </div>
    </div>
  );
}