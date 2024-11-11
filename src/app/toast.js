import { toast } from "react-toastify";

const EToastType = {
  DEFAULT: "default",
  ERROR: "error",
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
};

const showToast = (message, type) => {
  toast(message, {
    autoClose: 2000,
    pauseOnFocusLoss: false,
    pauseOnHover: false,
    type,
  });
};

export { EToastType, showToast };
