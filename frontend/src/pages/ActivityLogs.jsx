import { useEffect, useState } from "react";

import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";

import { getActivityLogs } from "../services/activityLogService";
import Button from "../components/ui/Button";
import { exportToExcel } from "../utils/exportExcel";
import { exportToPDF } from "../utils/exportPDF";
import StatCard from "../components/dashboard/StatCard";
import {
  PlusCircle,
  Trash2,
  Truck,
  Activity,
  ShieldCheck,
  Users,
} from "lucide-react";



export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getActivityLogs();
      setLogs(data);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      accessorKey: "log_id",
      header: "ID",
    },
    {
      accessorKey: "user_email",
      header: "User",
    },
    {
  accessorKey: "user_role",
  header: "Role",

  cell: ({ row }) => {
    const role = row.original.user_role;

    const colors = {
      Admin: "bg-red-100 text-red-700",
      Trader: "bg-blue-100 text-blue-700",
      Logistics: "bg-green-100 text-green-700",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[role] ||
          "bg-gray-100 text-gray-700"
        }`}
      >
        {role}
      </span>
    );
  },
},
    {
  accessorKey: "action",
  header: "Action",

  cell: ({ row }) => {
    const action = row.original.action;

    let Icon = PlusCircle;
    let color =
      "bg-blue-100 text-blue-700";

    if (action.includes("Deleted")) {
      Icon = Trash2;
      color =
        "bg-red-100 text-red-700";
    }

    if (action.includes("Assigned")) {
      Icon = Truck;
      color =
        "bg-green-100 text-green-700";
    }

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        <Icon size={14} />
        {action}
      </div>
    );
  },
},
    {
  accessorKey: "created_at",
  header: "Time",

  cell: ({ row }) => {
    const date = new Date(
      row.original.created_at
    );

    return (
      <div className="flex flex-col">

        <span className="font-medium text-slate-800">
          {date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>

        <span className="text-xs text-slate-500">
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>

      </div>
    );
  },
},
  ];
  const handleExportExcel = () => {
  const exportData = logs.map((log) => ({
    ID: log.log_id,
    User: log.user_email,
    Role: log.user_role,
    Action: log.action,
    Time: new Date(log.created_at).toLocaleString(),
  }));

  exportToExcel(exportData, "Activity Logs");
};

const handleExportPDF = () => {
  const exportData = logs.map((log) => ({
    ID: log.log_id,
    User: log.user_email,
    Role: log.user_role,
    Action: log.action,
    Time: new Date(log.created_at).toLocaleString(),
  }));

  exportToPDF(
    exportData,
    "Activity Logs",
    "CargoShare Activity Logs"
  );
};
const totalLogs = logs.length;

const adminLogs = logs.filter(
  (log) => log.user_role === "Admin"
).length;

const traderLogs = logs.filter(
  (log) => log.user_role === "Trader"
).length;

const logisticsLogs = logs.filter(
  (log) => log.user_role === "Logistics"
).length;

  return (
    <>
      <PageHeader
  title="Activity Logs"
  subtitle="System activity history"
>
  <div className="flex gap-3">

    <Button
  onClick={handleExportExcel}
  className="
    border
    border-emerald-200
    dark:border-emerald-800
    bg-emerald-50
    dark:bg-emerald-900/20
    text-emerald-700
    dark:text-emerald-300
    hover:bg-emerald-100
    dark:hover:bg-emerald-900/40
  "
>
  Export Excel
</Button>

<Button
  onClick={handleExportPDF}
  className="
    border
    border-rose-200
    dark:border-rose-800
    bg-rose-50
    dark:bg-rose-900/20
    text-rose-700
    dark:text-rose-300
    hover:bg-rose-100
    dark:hover:bg-rose-900/40
  "
>
  Export PDF
</Button>

  </div>
</PageHeader>
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

  <StatCard
    title="Total Logs"
    value={totalLogs}
    icon={Activity}
    color="bg-blue-600"
  />

  <StatCard
    title="Admin Actions"
    value={adminLogs}
    icon={ShieldCheck}
    color="bg-red-600"
  />

  <StatCard
    title="Trader Actions"
    value={traderLogs}
    icon={Users}
    color="bg-green-600"
  />

  <StatCard
    title="Logistics Actions"
    value={logisticsLogs}
    icon={Truck}
    color="bg-cyan-600"
  />

</div>

      <DataTable
        columns={columns}
        data={logs}
      />
    </>
  );
}