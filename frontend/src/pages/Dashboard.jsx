import { useState, useCallback } from "react";

import StatCard from "../components/dashboard/StatCard";
import RevenueChart from "../components/dashboard/RevenueChart";
import StatusChart from "../components/dashboard/StatusChart";
import RecentBookings from "../components/dashboard/RecentBookings";

import { getDashboard } from "../services/dashboardService";
import { getUser } from "../utils/auth";

import {
  Package,
  Truck,
  CircleDollarSign,
  CheckCircle,
} from "lucide-react";
import LoadingSkeleton from "../components/ui/LoadingSkeleton";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import QuickActions from "../components/dashboard/QuickActions";
import RecentNotifications from "../components/dashboard/RecentNotifications";
import RecentActivity from "../components/dashboard/RecentActivity";
import useAutoRefresh from "../hooks/useAutoRefresh";
import TodaysAssignments from "../components/dashboard/TodaysAssignments";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [filter, setFilter] = useState("today");
  const user = getUser();

  const fetchDashboard = useCallback(async () => {
  try {
    const data = await getDashboard(filter);
    setDashboard(data);
  } catch (error) {
    console.error(error);
  }
}, [filter]);

useAutoRefresh(fetchDashboard, 30000);


  if (!dashboard) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <DashboardHeader />
      

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

        {/* ================= ADMIN ================= */}
        {user?.role === "Admin" && (
          <>
            <StatCard
              title="Total Users"
              value={dashboard.total_users}
              icon={Package}
              theme="blue"
            />

            <StatCard
              title="Logistics Providers"
              value={dashboard.total_logistics}
              icon={Truck}
              color="bg-green-600"
            />

            <StatCard
              title="Total Revenue"
              value={`$${dashboard.total_revenue}`}
              icon={CircleDollarSign}
              color="bg-purple-600"
            />

            <StatCard
              title="Completed Bookings"
              value={dashboard.completed_bookings}
              icon={CheckCircle}
              color="bg-orange-500"
            />
          </>
        )}

        {/* ================= TRADER ================= */}
        {user?.role === "Trader" && (
          <>
            <StatCard
              title="My Bookings"
              value={dashboard.total_bookings}
              icon={Package}
              theme="blue"
            />

            <StatCard
              title="Pending Bookings"
              value={dashboard.pending_bookings}
              icon={Truck}
              color="bg-yellow-500"
            />

            <StatCard
              title="Completed Bookings"
              value={dashboard.completed_bookings}
              icon={CheckCircle}
              color="bg-green-600"
            />

            <StatCard
              title="Payments"
              value={dashboard.total_payments}
              icon={CircleDollarSign}
              color="bg-purple-600"
            />
          </>
        )}

        {/* ================= LOGISTICS ================= */}
        {user?.role === "Logistics" && (
          <>
            <StatCard
              title="Containers"
              value={dashboard.total_containers}
              icon={Package}
              theme="blue"
            />

            <StatCard
              title="Assigned Bookings"
              value={dashboard.total_bookings}
              icon={Truck}
              color="bg-cyan-600"
            />

            <StatCard
              title="Pending Deliveries"
              value={dashboard.pending_bookings}
              icon={CircleDollarSign}
              color="bg-yellow-500"
            />

            <StatCard
              title="Completed Deliveries"
              value={dashboard.completed_bookings}
              icon={CheckCircle}
              color="bg-green-600"
            />
          </>
        )}

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">
        <RevenueChart dashboard={dashboard} />
        <StatusChart dashboard={dashboard} />
      </div>
      <div className="mt-10">
  <QuickActions />
</div>
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-10">

  <RecentNotifications />

  {user?.role === "Logistics" ? (
    <TodaysAssignments />
  ) : (
    <RecentActivity />
  )}

</div>

{user?.role !== "Logistics" && (
  <RecentBookings
    bookings={dashboard.recent_bookings}
  />
)}
    </>
  );
}