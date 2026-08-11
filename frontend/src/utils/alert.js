import { toast } from "react-toastify";

export const showSuccess = (
  title = "Success",
  text = ""
) => {
  toast.success(text || title);
};

export const showError = (
  title = "Error",
  text = ""
) => {
  toast.error(text || title);
};

export const showWarning = (
  title = "Warning",
  text = ""
) => {
  toast.warning(text || title);
};

export const showInfo = (
  title = "Info",
  text = ""
) => {
  toast.info(text || title);
};