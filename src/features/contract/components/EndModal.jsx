import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EToastType, showToast } from "../../../app/toast";
import {
  endContract,
  resetEndContractResult,
  selectConstractState,
} from "../../../redux/contractSlice";

const EndModal = ({ selectedContract, size, onClose, refresh }) => {
  const dispatch = useDispatch();
  const { endContractResult } = useSelector(selectConstractState);

  const handleEndContract = () => {
    dispatch(endContract(selectedContract.car.id));
  };

  useEffect(() => {
    if (endContractResult) {
      if (endContractResult === "success") {
        refresh();
        showToast("End contract successfully!", EToastType.SUCCESS);
      } else {
        showToast(endContractResult, EToastType.ERROR);
      }
      onClose();
      dispatch(resetEndContractResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endContractResult]);

  return (
    <div className={`modal ${!!selectedContract ? "modal-open" : ""}`}>
      <div
        className={`modal-box scroll-custom  ${
          size === "lg" ? "max-w-2xl" : ""
        }`}
      >
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">
          End contract
        </h3>

        <div className="w-full">
          <p className="w-full text-base text-center">
            Are you sure you want to end this contract?
          </p>

          <div className="flex items-center justify-center w-full gap-4 mt-5">
            <button
              className="w-32 btn btn-primary btn-outline btn-sm"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-32 btn btn-primary btn-sm"
              type="button"
              onClick={handleEndContract}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndModal;
