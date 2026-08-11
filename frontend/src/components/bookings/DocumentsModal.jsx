import { useEffect, useState } from "react";

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
  const [documents, setDocuments] =
    useState([]);

  const [selectedFile, setSelectedFile] =
  useState(null);

const [uploading, setUploading] =
  useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen]);

  const fetchDocuments = async () => {
    try {
      const data = await getDocuments(
        bookingId
      );

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

    fetchDocuments();

  } catch (err) {

    console.error(err);

    toast.error(
      "Upload failed."
    );

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

    fetchDocuments();

  } catch (err) {

    console.error(err);

    toast.error(
      "Failed to delete document."
    );

  }

};

  

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div
  className="
  w-[720px]
  rounded-3xl
  bg-white
  dark:bg-slate-900
  border
  border-slate-200
  dark:border-slate-700
  shadow-2xl
  p-8
"
>

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Booking Documents
          </h2>

          <button
  onClick={onClose}
  className="
  text-slate-500
  hover:text-red-500
  text-2xl
  transition
  "

          >
            ✕
          </button>

        </div>

        <div className="mt-6 flex items-center gap-4">

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
  "
>
    Choose File

    <input
  type="file"
  className="hidden"
  disabled={uploading}
  onChange={(e) =>
    setSelectedFile(
      e.target.files[0]
    )
  }
/>
  </label>

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

  <Button
  loading={uploading}
  disabled={uploading}
  onClick={handleUpload}
  className="ml-auto"
>
  Upload
</Button>

</div>

        <div className="mt-8">

          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="border rounded-lg p-4 mb-3 flex justify-between"
            >
              <div className="flex justify-between items-center w-full">

  <div>
    <p className="font-medium">
      {doc.file_name}
    </p>

    <p className="text-sm text-gray-500">
      {doc.uploaded_by}
    </p>
  </div>

  <div className="flex gap-2">

    <button
      onClick={() =>
        downloadDocument(doc.document_id)
      }
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
    >
      Download
    </button>

    <button
      onClick={() =>
        handleDelete(doc.document_id)
      }
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      Delete
    </button>

  </div>

</div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}