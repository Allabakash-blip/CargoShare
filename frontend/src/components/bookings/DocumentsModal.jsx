import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  getDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
} from "../../services/documentService";

import { toast } from "react-toastify";
import Button from "../ui/Button";

export default function DocumentsModal({
  bookingId,
  isOpen,
  onClose,
}) {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen, bookingId]);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments(bookingId);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    try {
      setUploading(true);

      await uploadDocument(
        bookingId,
        selectedFile
      );

      toast.success(
        "Document uploaded successfully."
      );

      setSelectedFile(null);

      await fetchDocuments();
    } catch (err) {
      console.error(err);

      toast.error("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    try {
      await deleteDocument(documentId);

      toast.success(
        "Document deleted successfully."
      );

      await fetchDocuments();
    } catch (err) {
      console.error(err);

      toast.error(
        "Failed to delete document."
      );
    }
  };

  // Do not render anything when modal is closed
  if (!isOpen) return null;

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        p-4
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-3xl
          max-h-[90vh]
          overflow-y-auto
          rounded-3xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-700
          shadow-2xl
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            px-8
            py-6
            border-b
            border-slate-200
            dark:border-slate-700
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              text-slate-900
              dark:text-white
            "
          >
            Booking Documents
          </h2>

          <button
            onClick={onClose}
            disabled={uploading}
            className="
              text-slate-500
              dark:text-slate-400
              hover:text-red-500
              dark:hover:text-red-400
              text-2xl
              transition
              duration-200
              disabled:opacity-50
            "
          >
            ✕
          </button>
        </div>

        {/* Upload Section */}
        <div
          className="
            px-8
            py-6
            border-b
            border-slate-200
            dark:border-slate-700
          "
        >
          <div className="flex items-center gap-4">
            {/* Choose File */}
            <label
              className="
                cursor-pointer
                shrink-0
                rounded-xl
                border
                border-slate-300
                dark:border-slate-600
                bg-slate-100
                dark:bg-slate-800
                hover:bg-slate-200
                dark:hover:bg-slate-700
                px-5
                py-2.5
                font-medium
                text-slate-700
                dark:text-white
                transition
                duration-200
              "
            >
              Choose File

              <input
                type="file"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  setSelectedFile(
                    e.target.files?.[0] || null
                  );
                }}
              />
            </label>

            {/* Selected File */}
            <span
              className="
                flex-1
                truncate
                text-sm
                text-slate-700
                dark:text-slate-300
              "
            >
              {selectedFile
                ? selectedFile.name
                : "No file selected"}
            </span>

            {/* Upload */}
            <Button
              loading={uploading}
              disabled={uploading}
              onClick={handleUpload}
              className="shrink-0"
            >
              Upload
            </Button>
          </div>
        </div>

        {/* Documents List */}
        <div className="px-8 py-6">
          {documents.length === 0 ? (
            <div
              className="
                py-8
                text-center
                text-slate-500
                dark:text-slate-400
              "
            >
              No documents uploaded yet.
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.document_id}
                className="
                  border
                  border-slate-200
                  dark:border-slate-700
                  rounded-xl
                  p-4
                  mb-3
                  flex
                  items-center
                  justify-between
                  gap-4
                  bg-white
                  dark:bg-slate-800
                "
              >
                {/* Document Information */}
                <div className="min-w-0">
                  <p
                    className="
                      font-medium
                      text-slate-900
                      dark:text-white
                      truncate
                    "
                  >
                    {doc.file_name}
                  </p>

                  <p
                    className="
                      text-sm
                      text-slate-500
                      dark:text-slate-400
                      mt-1
                    "
                  >
                    {doc.uploaded_by}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() =>
                      downloadDocument(
                        doc.document_id
                      )
                    }
                    className="
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      transition
                    "
                  >
                    Download
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        doc.document_id
                      )
                    }
                    className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      transition
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}