import React, { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DataTable({
  title = "Records",
  columns,
  data,
  onRefresh,
}) {

  const [sorting, setSorting] = useState([]);

  const [globalFilter, setGlobalFilter] =
    useState("");

  const [pagination, setPagination] =
    useState({
      pageIndex: 0,
      pageSize: 10,
    });

  // ===========================
  // Export Excel
  // ===========================

  const exportExcel = () => {

    const exportData = data.map((row) => {

      const obj = {};

      columns.forEach((col) => {

        if (col.accessorKey) {
          obj[col.header] = row[col.accessorKey];
        }

      });

      return obj;

    });

    const worksheet =
      XLSX.utils.json_to_sheet(exportData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      title
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    saveAs(
      new Blob([excelBuffer]),
      `${title}.xlsx`
    );

  };

  // ===========================
  // Export PDF
  // ===========================

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(title, 14, 18);

    autoTable(doc, {
      startY: 28,

      head: [
        columns
          .filter((c) => c.accessorKey)
          .map((c) => c.header),
      ],

      body: data.map((row) =>
        columns
          .filter((c) => c.accessorKey)
          .map((c) => row[c.accessorKey])
      ),
    });

    doc.save(`${title}.pdf`);

  };

  // ===========================
  // React Table
  // ===========================

  const table = useReactTable({

    data,
    columns,

    state: {
      sorting,
      globalFilter,
      pagination,
    },

    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,

    globalFilterFn: "includesString",

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel:
      getPaginationRowModel(),

  });

  return (

    <div
      className="
      bg-white
      dark:bg-slate-800
      rounded-3xl
      border
      border-slate-200
      dark:border-slate-700
      shadow-sm
      overflow-hidden
      transition-colors
      duration-300
      "
    >

      <div className="overflow-x-auto">

        {/* ================= Toolbar ================= */}

        <div
          className="
          p-6
          border-b
          border-slate-200
          dark:border-slate-700
          bg-white
          dark:bg-slate-800
          transition-colors
          duration-300
          "
        >

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                {title}
              </h2>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Total Records: {data.length}
              </p>

            </div>

            <div className="flex gap-3 flex-wrap">

              {onRefresh && (

                <button
                  onClick={onRefresh}
                  className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  hover:bg-slate-100
                  dark:hover:bg-slate-700
                  transition
                  "
                >
                  <RefreshCw size={18} />
                  Refresh
                </button>

              )}

              <button
  onClick={exportExcel}
  className="
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-xl
    border
    border-emerald-200
    dark:border-emerald-800
    bg-emerald-50
    dark:bg-emerald-900/20
    text-emerald-700
    dark:text-emerald-300
    hover:bg-emerald-100
    dark:hover:bg-emerald-900/40
    transition-all
    duration-300
  "
>
  <FileSpreadsheet size={18} />
  Excel
</button>

              <button
  onClick={exportPDF}
  className="
    flex
    items-center
    gap-2
    px-4
    py-2
    rounded-xl
    border
    border-rose-200
    dark:border-rose-800
    bg-rose-50
    dark:bg-rose-900/20
    text-rose-700
    dark:text-rose-300
    hover:bg-rose-100
    dark:hover:bg-rose-900/40
    transition-all
    duration-300
  "
>
  <FileText size={18} />
  PDF
</button>

            </div>

          </div>

          <div className="relative mt-6 max-w-md">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={globalFilter}
              onChange={(e) =>
                setGlobalFilter(e.target.value)
              }
              className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-600
              bg-white
              dark:bg-slate-700
              text-slate-800
              dark:text-white
              placeholder:text-slate-400
              pl-10
              pr-4
              py-2.5
              outline-none
              focus:ring-2
              focus:ring-blue-500
              transition-colors
              "
            />

          </div>

        </div>
                {/* ================= Table ================= */}

<table className="w-full">

  <thead
    className="
    bg-slate-50
    dark:bg-slate-900
    transition-colors
    duration-300
    "
  >

    {table.getHeaderGroups().map((headerGroup) => (

      <tr key={headerGroup.id}>

        {headerGroup.headers.map((header) => (

          <th
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            className={`px-6 py-4 text-sm font-semibold uppercase cursor-pointer select-none transition-colors ${
              header.column.id === "actions"
                ? "text-center"
                : "text-left"
            } text-slate-600 dark:text-slate-300`}
          >

            <div className="flex items-center gap-2">

              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}

              {header.column.getIsSorted() === "asc" ? (

                <ArrowUp size={15} />

              ) : header.column.getIsSorted() === "desc" ? (

                <ArrowDown size={15} />

              ) : (

                <ArrowUpDown
                  size={15}
                  className="text-slate-400"
                />

              )}

            </div>

          </th>

        ))}

      </tr>

    ))}

  </thead>

  <tbody>

    {table.getRowModel().rows.length === 0 ? (

      <tr>

        <td
          colSpan={columns.length}
          className="
          py-20
          text-center
          bg-white
          dark:bg-slate-800
          "
        >

          <div className="flex flex-col items-center">

            <div className="text-6xl">
              📭
            </div>

            <h3 className="text-xl font-bold mt-4 text-slate-800 dark:text-white">
              No Records Found
            </h3>

            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Try changing your search.
            </p>

          </div>

        </td>

      </tr>

    ) : (

      table.getRowModel().rows.map((row) => (

        <tr
          key={row.id}
          className="
          border-t
          border-slate-200
          dark:border-slate-700
          hover:bg-slate-50
          dark:hover:bg-slate-700/40
          transition-colors
          duration-200
          "
        >

          {row.getVisibleCells().map((cell) => (

            <td
              key={cell.id}
              className={`px-6 py-4 text-slate-700 dark:text-slate-200 ${
                cell.column.id === "actions"
                  ? "text-center"
                  : ""
              }`}
            >

              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}

            </td>

          ))}

        </tr>

      ))

    )}

  </tbody>

</table>
                {/* ================= Pagination ================= */}

<div
  className="
  flex
  flex-col
  md:flex-row
  items-center
  justify-between
  gap-4
  px-6
  py-4
  border-t
  border-slate-200
  dark:border-slate-700
  bg-white
  dark:bg-slate-800
  transition-colors
  duration-300
  "
>

  <p className="text-sm text-slate-500 dark:text-slate-400">

    {data.length === 0
      ? "No records found"
      : `Showing ${
          table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
          1
        } - ${Math.min(
          (table.getState().pagination.pageIndex + 1) *
            table.getState().pagination.pageSize,
          data.length
        )} of ${data.length} ${title.toLowerCase()}`}

  </p>

  <div className="flex items-center gap-3">

    <button
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
      className="
      px-4
      py-2
      rounded-lg
      border
      border-slate-300
      dark:border-slate-600
      bg-white
      dark:bg-slate-700
      text-slate-700
      dark:text-white
      hover:bg-slate-100
      dark:hover:bg-slate-600
      disabled:opacity-50
      disabled:cursor-not-allowed
      transition-colors
      "
    >
      Previous
    </button>

    <span className="px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
      Page {table.getState().pagination.pageIndex + 1} of{" "}
      {table.getPageCount()}
    </span>

    <button
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
      className="
      px-4
      py-2
      rounded-lg
      border
      border-slate-300
      dark:border-slate-600
      bg-white
      dark:bg-slate-700
      text-slate-700
      dark:text-white
      hover:bg-slate-100
      dark:hover:bg-slate-600
      disabled:opacity-50
      disabled:cursor-not-allowed
      transition-colors
      "
    >
      Next
    </button>

  </div>

</div>

      </div>

    </div>

  );
}