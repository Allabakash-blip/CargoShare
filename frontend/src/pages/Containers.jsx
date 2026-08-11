import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Package,
  Plus,
  Trash2,
} from "lucide-react";

import {
  getContainers,
  createContainer,
  deleteContainer,
} from "../services/containerService";

import CreateContainerModal from "../components/containers/CreateContainerModal";

import StatusBadge from "../components/ui/StatusBadge";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";

import { getUser } from "../utils/auth";

import { toast } from "react-toastify";
import ConfirmModal from "../components/ui/ConfirmModal";

export default function Containers() {
  const [containers, setContainers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

const [containerToDelete, setContainerToDelete] =
  useState(null);

const [deleting, setDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
const [selectedContainer, setSelectedContainer] = useState(null);

  const user = getUser();

  // ====================================
  // Global Search Highlight
  // ====================================

  const [searchParams] = useSearchParams();

  const [highlightId, setHighlightId] = useState(
    Number(searchParams.get("highlight"))
  );

  useEffect(() => {
    setHighlightId(
      Number(searchParams.get("highlight"))
    );
  }, [searchParams]);

  useEffect(() => {
    fetchContainers();
  }, []);

  useEffect(() => {
    if (!highlightId) return;

    const row = document.getElementById(
      `container-${highlightId}`
    );

    if (row) {
      row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    const timer = setTimeout(() => {
      setHighlightId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [containers, highlightId]);

  const fetchContainers = async () => {
    try {
      const data = await getContainers();
      setContainers(data);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to load containers"
      );
    }
  };

  const handleCreateContainer = async (
    containerData
  ) => {
    try {
      await createContainer(containerData);

      toast.success(
        "Container created successfully!"
      );

      fetchContainers();

      setOpenModal(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to create container"
      );
    }
  };

  const handleDelete = (containerId) => {
  setSelectedContainer(containerId);
  setConfirmOpen(true);
};

const confirmDelete = async () => {
  try {
    await deleteContainer(selectedContainer);

    toast.success("Container deleted successfully!");

    fetchContainers();
  } catch (error) {
    console.error(error);

    toast.error(
      error.response?.data?.detail ||
      "Failed to delete container"
    );
  } finally {
    setConfirmOpen(false);
    setSelectedContainer(null);
  }
};


  return (
    <>
      <PageHeader
        title="Containers"
        subtitle="Manage shipping containers and their availability."
      >
        {user?.role === "Logistics" && (
          <Button
  leftIcon={Plus}
  onClick={() => {
    console.log("Add Container clicked");
    setOpenModal(true);
  }}
>
  Add Container
</Button>
        )}
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
            Container
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Type
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Capacity
          </th>

          <th className="px-6 py-5 text-left text-sm font-bold text-slate-700 dark:text-slate-200">
            Status
          </th>

          {user?.role === "Logistics" && (

            <th className="px-6 py-5 text-center text-sm font-bold text-slate-700 dark:text-slate-200">
              Actions
            </th>

          )}

        </tr>

      </thead>

      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">

        {containers.length > 0 ? (

          containers.map((container) => (

            <tr
              key={container.container_id}
              id={`container-${container.container_id}`}
              style={
                container.container_id === highlightId
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
                  container.container_id ===
                  highlightId
                    ? "bg-yellow-200 ring-2 ring-yellow-400 animate-pulse"
                    : ""
                }
              `}
            >

              <td className="px-6 py-5 font-semibold text-slate-800 dark:text-white">
                #{container.container_id}
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

                    <Package
                      size={20}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="font-semibold text-slate-800 dark:text-white">
                      {container.container_number}
                    </p>

                  </div>

                </div>

              </td>

              <td className="px-6 py-5 text-slate-700 dark:text-slate-300">
                {container.container_type}
              </td>

              <td className="px-6 py-5">

                <span
                  className="
                    rounded-full
                    bg-cyan-100
                    dark:bg-cyan-900
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-cyan-700
                    dark:text-cyan-300
                  "
                >
                  {container.capacity}
                </span>

              </td>

              <td className="px-6 py-5">

                <StatusBadge
                  status={container.status}
                />

              </td>

              {user?.role === "Logistics" && (

                <td className="px-6 py-5">

                  <div className="flex justify-center">

                    <button
                      onClick={() =>
                        handleDelete(
                          container.container_id
                        )
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

                  </div>

                </td>

              )}

            </tr>

          ))

        ) : (
                    <tr>

            <td
              colSpan={
                user?.role === "Logistics"
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

                <Package
                  size={56}
                  className="text-slate-300 dark:text-slate-600"
                />

                <div>

                  <p className="text-xl font-semibold">
                    No Containers Found
                  </p>

                  <p className="mt-2 text-sm">
                    Create a new container to get started.
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

      {user?.role === "Logistics" && (
  <>
    <CreateContainerModal
      isOpen={openModal}
      onClose={() => setOpenModal(false)}
      onCreate={handleCreateContainer}
    />

    <ConfirmModal
      isOpen={confirmOpen}
      title="Delete Container"
      message="Are you sure you want to delete this container?"
      confirmText="Delete"
      cancelText="Cancel"
      onConfirm={confirmDelete}
      onCancel={() => {
        setConfirmOpen(false);
        setSelectedContainer(null);
      }}
    />
  </>
)}

    </>
  );
}