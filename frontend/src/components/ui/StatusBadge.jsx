export default function StatusBadge({ status }) {
  const normalizedStatus =
    status?.trim().toLowerCase();

  const getStatusStyle = () => {
    switch (normalizedStatus) {
      case "pending":
        return `
          bg-yellow-100
          dark:bg-yellow-900/40
          text-yellow-800
          dark:text-yellow-300
        `;

      case "paid":
      case "completed":
      case "done":
      case "available":
        return `
          bg-green-100
          dark:bg-green-900/40
          text-green-800
          dark:text-green-300
        `;

      case "failed":
      case "cancelled":
        return `
          bg-red-100
          dark:bg-red-900/40
          text-red-800
          dark:text-red-300
        `;

      case "assigned":
        return `
          bg-blue-100
          dark:bg-blue-900/40
          text-blue-800
          dark:text-blue-300
        `;

      case "in transit":
        return `
          bg-purple-100
          dark:bg-purple-900/40
          text-purple-800
          dark:text-purple-300
        `;

      default:
        return `
          bg-slate-100
          dark:bg-slate-700
          text-slate-700
          dark:text-slate-300
        `;
    }
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        whitespace-nowrap
        transition-colors
        duration-300
        ${getStatusStyle()}
      `}
    >
      {status}
    </span>
  );
}