import { useEffect, useState } from "react";

import {
  Users,
  Package,
  Truck,
  CreditCard,
  CircleDollarSign,
  CheckCircle,
} from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";

import StatCard from "../components/dashboard/StatCard";

import MonthlyBookingsChart from "../components/analytics/MonthlyBookingsChart";
import BookingStatusChart from "../components/analytics/BookingStatusChart";
import PaymentStatusChart from "../components/analytics/PaymentStatusChart";
import TopLogisticsChart from "../components/analytics/TopLogisticsChart";

import { getAnalytics } from "../services/analyticsService";

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {

      const data = await getAnalytics();

      setAnalytics(data);

    } catch (error) {

      console.error(error);

    }
  };

  if (!analytics) {
    return <LoadingSkeleton />;
  }

  return (
    <>

      <PageHeader
        title="Analytics Dashboard"
        subtitle="Business insights and performance metrics."
      />
      {/* KPI Cards */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

  <StatCard
    title="Total Revenue"
    value={`₹${analytics.total_revenue}`}
    icon={CircleDollarSign}
    color="from-green-500 to-emerald-600"
  />

  <StatCard
    title="Total Bookings"
    value={analytics.total_bookings}
    icon={Package}
    color="from-blue-500 to-cyan-600"
  />

  <StatCard
    title="Total Containers"
    value={analytics.total_containers}
    icon={Truck}
    color="from-cyan-500 to-sky-600"
  />

  <StatCard
    title="Total Payments"
    value={analytics.total_payments}
    icon={CreditCard}
    color="from-violet-500 to-purple-600"
  />

  <StatCard
    title="Completed Bookings"
    value={analytics.completed_bookings}
    icon={CheckCircle}
    color="from-orange-500 to-red-500"
  />

  <StatCard
    title="Total Users"
    value={analytics.total_users}
    icon={Users}
    color="from-pink-500 to-rose-600"
  />

</div>
{/* Charts */}

<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-10">

  <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
    "
  >
    <MonthlyBookingsChart
      data={analytics.monthly_bookings}
    />
  </div>

  <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
    "
  >
    <BookingStatusChart
      data={analytics.booking_status}
    />
  </div>

  <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
    "
  >
    <PaymentStatusChart
      data={analytics.payment_status}
    />
  </div>

</div>

{/* Top Logistics */}

<div
  className="
    mt-10
    rounded-3xl
    bg-white
    dark:bg-slate-900
    border
    border-slate-200
    dark:border-slate-700
    shadow-lg
    p-6
    transition-all
  "
>

  <TopLogisticsChart
    data={analytics.top_logistics}
  />

</div>
{/* Summary Cards */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

  <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
      hover:shadow-xl
      hover:-translate-y-1
    "
  >
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      Pending Bookings
    </h3>

    <p className="mt-4 text-5xl font-bold text-yellow-500">
      {analytics.pending_bookings}
    </p>
  </div>

  <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
      hover:shadow-xl
      hover:-translate-y-1
    "
  >
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      Assigned Bookings
    </h3>

    <p className="mt-4 text-5xl font-bold text-blue-600">
      {analytics.assigned_bookings}
    </p>
  </div>

  <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
      hover:shadow-xl
      hover:-translate-y-1
    "
  >
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      In Transit
    </h3>

    <p className="mt-4 text-5xl font-bold text-purple-600">
      {analytics.in_transit_bookings}
    </p>
  </div>

    <div
    className="
      rounded-3xl
      bg-white
      dark:bg-slate-900
      border
      border-slate-200
      dark:border-slate-700
      shadow-lg
      p-6
      transition-all
      hover:shadow-xl
      hover:-translate-y-1
    "
  >
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
      Completed Payments
    </h3>

    <p className="mt-4 text-5xl font-bold text-green-600">
      {analytics.completed_payments}
    </p>
  </div>

</div>

    </>
  );
}