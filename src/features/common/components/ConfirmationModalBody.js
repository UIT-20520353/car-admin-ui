import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_CLOSE_TYPES,
} from "../../../utils/globalConstantUtil";
import { deleteLead } from "../../leads/leadSlice";
import { showNotification } from "../headerSlice";
import { soldCar } from "../../../redux/carSlice";

function ConfirmationModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, _id, index } = extraObject;

  const proceedWithYes = async () => {
    switch (type) {
      case CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE:
        dispatch(deleteLead({ index }));
        dispatch(showNotification({ message: "Lead Deleted!", status: 1 }));
      case CONFIRMATION_MODAL_CLOSE_TYPES.SOLD_CAR:
        dispatch(soldCar({ id: index }));
        dispatch(showNotification({ message: "Car Sold!", status: 1 }));
    }
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline   " onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Yes
        </button>
      </div>
    </>
  );
}

export default ConfirmationModalBody;
