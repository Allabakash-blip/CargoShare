import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  CreditCard,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  getPayments,
  updatePayment,
  deletePayment,
} from "../services/paymentService";


import EditPaymentModal from "../components/Payments/EditPaymentModal";

import StatusBadge from "../components/ui/StatusBadge";
import ConfirmModal from "../components/ui/ConfirmModal";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import { getUser } from "../utils/auth";

import { toast } from "react-toastify";

export default function Payments() {

  const user = getUser();

  const [searchParams] = useSearchParams();

  const [highlightId, setHighlightId] = useState(
    Number(searchParams.get("highlight"))
  );

  useEffect(() => {
    setHighlightId(
      Number(searchParams.get("highlight"))
    );
  }, [searchParams]);

  const [payments, setPayments] = useState([]);

  

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedPaymentId, setSelectedPaymentId] =
    useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    if (!highlightId || payments.length === 0)
      return;

    const row = document.getElementById(
      `payment-${highlightId}`
    );

    if (row) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const timer = setTimeout(() => {
      setHighlightId(null);
    }, 2500);

    return () => clearTimeout(timer);

  }, [payments, highlightId]);

  const fetchPayments = async () => {
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to load payments"
      );
    }
  };

  

  const openEditModal = (payment) => {
    setSelectedPayment(payment);
    setEditModalOpen(true);
  };

  const handleUpdatePayment = async (paymentData) => {
  try {
    const updatedPayment = await updatePayment(
      selectedPayment.id,
      paymentData
    );

    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === updatedPayment.id
          ? updatedPayment
          : payment
      )
    );

    toast.success("Payment updated successfully!");

    setEditModalOpen(false);
    setSelectedPayment(null);

  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.detail ||
      "Failed to update payment"
    );
  }
};

  const openDeleteModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePayment(
        selectedPaymentId
      );

      toast.success(
        "Payment deleted successfully!"
      );

      fetchPayments();

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to delete payment"
      );
    }

    setConfirmOpen(false);
    setSelectedPaymentId(null);
  };

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Manage payment transactions and history."
      >
      </PageHeader>
      <div
  className="
    overflow-hidden
    rounded-3xl
    bg-white
    dark:bg-slate-900
    border
    border-slate-200
    dark:border-slate-700
    shadow-lg
    transition-all
  "
>

  <div className="overflow-x-auto">

    <table className="min-w-full">

      <thead
        className="
          bg-slate-100
          dark:bg-slate-800
          border-b
          border-slate-200
          dark:border-slate-700
        "
      >

        <tr>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            ID
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Booking
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Amount
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Method
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Status
          </th>

          {(user?.role === "Admin" ||
            user?.role === "Trader") && (

            <th className="px-6 py-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
              Actions
            </th>

          )}

        </tr>

      </thead>

      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">

        {payments.length > 0 ? (

          payments.map((payment) => (

            <tr
              key={payment.id}
              id={`payment-${payment.id}`}
              style={
                payment.id === highlightId
                  ? {
                      transition: "all 1s ease",
                      boxShadow:
                        "0 0 20px rgba(250,204,21,.8)",
                    }
                  : {}
              }
              className={`
                transition-all
                duration-300
                hover:bg-blue-50
                dark:hover:bg-slate-800

                ${
                  payment.id === highlightId
                    ? "bg-yellow-200 ring-2 ring-yellow-400 animate-pulse"
                    : ""
                }
              `}
            >

              <td className="px-6 py-5 font-semibold text-slate-800 dark:text-white">
                #{payment.id}
              </td>

              <td className="px-6 py-5">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      h-11
                      w-11
                      rounded-xl
                      bg-blue-100
                      dark:bg-blue-900
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <CreditCard
                      size={20}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="font-semibold text-slate-800 dark:text-white">
                      Booking #{payment.booking_id}
                    </p>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5">

                <span
                  className="
                    rounded-full
                    bg-green-100
                    dark:bg-green-900
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-green-700
                    dark:text-green-300
                  "
                >
                  ₹ {Number(payment.amount).toLocaleString("en-IN")}
                </span>

              </td>

              <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
  {payment.payment_method === "Auto"
    ? "Not Selected"
    : payment.payment_method ||"Not Selected"}
</td>

              <td className="px-6 py-5">
                <StatusBadge
                  status={payment.payment_status}
                />
              </td>

              {(user?.role === "Admin" ||
                user?.role === "Trader") && (

                <td className="px-6 py-5">

                  <div className="flex justify-center gap-3">

                    <button
                      onClick={() =>
                        openEditModal(payment)
                      }
                      className="
                        rounded-xl
                        bg-blue-100
                        dark:bg-blue-900
                        px-4
                        py-2
                        text-blue-600
                        dark:text-blue-300
                        font-medium
                        hover:scale-105
                        transition
                      "
                    >
                      <Pencil size={16} />
                    </button>

                    {user?.role === "Admin" && (

                      <button
                        onClick={() =>
                          openDeleteModal(payment.id)
                        }
                        className="
                          rounded-xl
                          bg-red-100
                          dark:bg-red-900
                          p-3
                          text-red-600
                          hover:scale-110
                          transition
                        "
                      >
                        <Trash2 size={18} />
                      </button>

                    )}

                  </div>

                </td>

              )}

            </tr>

          ))

        ) : (
                    <tr>

            <td
              colSpan={
                (user?.role === "Admin" ||
                  user?.role === "Trader")
                  ? 6
                  : 5
              }
              className="
                py-20
                text-center
                text-slate-500
                dark:text-slate-400
              "
            >

              <div className="flex flex-col items-center gap-4">

                <CreditCard
                  size={56}
                  className="text-slate-300 dark:text-slate-600"
                />

                <div>

                  <p className="text-xl font-semibold">
                    No Payments Found
                  </p>

                  <p className="mt-2 text-sm">
                    <p className="text-xl font-semibold">
  No Payments Found
</p>

<p className="mt-2 text-sm">
  Payments are automatically created when a booking is completed.
</p>
                  </p>

                </div>

              </div>

            </td>

          </tr>

        )}

      </tbody>

    </table>

  </div>

</div>

      

      {(user?.role === "Trader" ||
        user?.role === "Admin") &&
        selectedPayment && (

        <EditPaymentModal
          payment={selectedPayment}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedPayment(null);
          }}
          onUpdate={handleUpdatePayment}
        />

      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Payment"
        message="Are you sure you want to delete this payment? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setSelectedPaymentId(null);
        }}
      />

    </>
  );
}