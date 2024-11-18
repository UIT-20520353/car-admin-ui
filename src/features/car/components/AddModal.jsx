import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { EToastType, showToast } from "../../../app/toast";
import ErrorText from "../../../components/Typography/ErrorText";
import {
  addCar,
  resetAddCarResult,
  selectCarState,
} from "../../../redux/carSlice";
import dayjs from "dayjs";

const validationSchema = yup.object({
  name: yup.string().required("Please enter car name!"),
  registrationPlate: yup.string().required("Please enter registration plate!"),
  buyingPrice: yup
    .string()
    .matches(/^\d*[1-9]\d*$/, "Invalid amount")
    .required("Please input amount !"),
  rego: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid amount")
    .default("0"),
  carPlay: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid amount")
    .default("0"),
  keys: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid amount")
    .default("0"),
  gps: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid amount")
    .default("0"),
  note: yup.string(),
  buyingDate: yup.date().required("Start date is required"),
});

const AddModal = ({ open, size, onClose, refresh }) => {
  const { addCarResult } = useSelector(selectCarState);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      registrationPlate: "",
      buyingDate: dayjs().format("YYYY-MM-DD"),
      buyingPrice: "",
      rego: "0",
      keys: "0",
      gps: "0",
      note: "",
      carPlay: "0",
    },
  });

  const handleClose = () => {
    onClose();
  };

  const onCancelClick = () => {
    reset();
    handleClose();
  };

  const onSubmit = (data) => {
    dispatch(addCar(data));
  };

  useEffect(() => {
    if (addCarResult) {
      if (addCarResult === "success") {
        reset();
        onClose();
        refresh();
        showToast("Add car successfully!", EToastType.SUCCESS);
      } else {
        showToast(addCarResult, EToastType.ERROR);
      }
      dispatch(resetAddCarResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addCarResult]);

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className={`modal-box  ${size === "lg" ? "max-w-2xl" : ""}`}>
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">Add car</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Name</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter name"
                {...register("name")}
              />
            </div>

            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">
                Registration plate
              </label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter registration plate"
                {...register("registrationPlate")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Buying Date</label>
              <input
                type="date"
                className="w-full input input-bordered"
                placeholder="Select date"
                {...register("buyingDate")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Buying Price</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter buying price"
                {...register("buyingPrice")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Rego</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter rego"
                {...register("rego")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Car Play</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter car play"
                {...register("carPlay")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Keys</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter keys"
                {...register("keys")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">GPS</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter gps"
                {...register("gps")}
              />
            </div>
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Note</label>
              <textarea
                placeholder="Enter note"
                className="w-full resize-none textarea textarea-bordered"
                rows={5}
                {...register("note")}
              />
            </div>
          </div>

          <ErrorText styleClass="my-4">
            {errors?.name?.message ||
              errors?.registrationPlate?.message ||
              errors?.buyingDate?.message ||
              errors?.buyingPrice?.message ||
              errors?.carPlay?.message ||
              errors?.gps?.message ||
              errors?.keys?.message ||
              errors?.rego?.message}
          </ErrorText>

          <div className="flex items-center justify-center w-full gap-4 mt-5">
            <button
              className="w-32 btn btn-outline btn-sm"
              onClick={onCancelClick}
              type="button"
            >
              Cancel
            </button>
            <button
              className="w-32 btn btn-outline btn-sm"
              onClick={() => reset()}
              type="button"
            >
              Reset
            </button>
            <button className="w-32 btn btn-primary btn-sm" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModal;
