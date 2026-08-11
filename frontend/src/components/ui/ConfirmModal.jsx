import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

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
      "
    >
      <div
        className="
          w-full
          max-w-md

          rounded-3xl

          bg-white
          dark:bg-slate-900

          border
          border-slate-200
          dark:border-slate-700

          shadow-2xl

          p-8

          transition-colors
          duration-300
        "
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}