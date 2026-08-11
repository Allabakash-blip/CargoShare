import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../components/ui/PageHeader";
import DataTable from "../components/ui/DataTable";
import Button from "../components/ui/Button";

import {
  getAllUsers,
  approveUser,
} from "../services/adminService";

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    }
  };

  const handleApprove = async (
    userId
  ) => {
    try {
      await approveUser(userId);

      toast.success(
        "User approved successfully!"
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(
        "Approval failed"
      );
    }
  };

  const columns = [
    {
      accessorKey: "user_id",
      header: "ID",
    },
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",

      cell: ({ row }) => (
        row.original.status ===
        "Pending" ? (
          <Button
            onClick={() =>
              handleApprove(
                row.original.user_id
              )
            }
          >
            Approve
          </Button>
        ) : (
          <span className="text-green-600 font-semibold">
            Approved
          </span>
        )
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Approve registered users"
      />

      <DataTable
  title="Users"
  columns={columns}
  data={users}
  onRefresh={fetchUsers}
/>
    </>
  );
}