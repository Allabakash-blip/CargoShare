import { useState } from "react";

export default function CreatePaymentModal({
  isOpen,
  onClose,
  onCreate,
}) {
  const [formData, setFormData] = useState({
    booking_id: "",
    amount: "",
    payment_method: "UPI",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    await onCreate({
      booking_id: Number(formData.booking_id),
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
    });

    setFormData({
      booking_id: "",
      amount: "",
      payment_method: "UPI",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700">

        {/* Header */}

        <div className="border-b border-slate-200 dark:border-slate-700 px-8 py-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Create Payment
          </h2>

          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Enter payment details below.
          </p>
        </div>

        {/* Body */}

        <div className="space-y-5 px-8 py-6">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Booking ID
            </label>

            <input
              type="number"
              name="booking_id"
              value={formData.booking_id}
              onChange={handleChange}
              placeholder="Enter Booking ID"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter Amount"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Payment Method
            </label>

            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-8 py-5">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 dark:border-slate-600 dark:text-white dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-xl bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
          >
            Create Payment
          </button>

        </div>

      </div>

    </div>
  );
}