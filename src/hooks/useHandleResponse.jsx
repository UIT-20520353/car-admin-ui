import { useCallback } from "react";
import { EToastType, showToast } from "../app/toast";

const useHandleResponse = () => {
  return useCallback((response, successMsg, onClose = () => {}) => {
    if (response?.type?.includes("/fulfilled")) {
      showToast(successMsg, EToastType.SUCCESS);
      onClose();
    } else if (response?.type?.includes("/rejected")) {
      showToast(
        response?.payload?.detail || "An error occurred.",
        EToastType.ERROR
      );
    }
  }, []);
};
export default useHandleResponse;
