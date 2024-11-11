import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { EToastType, showToast } from "../../../app/toast";
import ErrorText from "../../../components/Typography/ErrorText";
import {
  editCar,
  resetEditCarResult,
  selectCarState,
} from "../../../redux/carSlice";

const validationSchema = yup.object({
  name: yup.string().required("Vui lòng nhập tên xe!"),
  registrationPlate: yup.string().required("Vui lòng nhập biển số xe!"),
});

const EditModal = ({ size, onClose, refresh, car }) => {
  const { editCarResult } = useSelector(selectCarState);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      registrationPlate: "",
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
    if (car) {
      dispatch(editCar({ id: car.id, data }));
    }
  };

  const onResetClick = () => {
    setValue("name", car.name);
    setValue("registrationPlate", car.registrationPlate);
  };

  useEffect(() => {
    if (editCarResult) {
      if (editCarResult === "success") {
        reset();
        onClose();
        refresh();
        showToast("Sửa thông tin xe thành công!", EToastType.SUCCESS);
      } else {
        showToast(editCarResult, EToastType.ERROR);
      }
      dispatch(resetEditCarResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editCarResult]);

  useEffect(() => {
    if (car) {
      setValue("name", car.name);
      setValue("registrationPlate", car.registrationPlate);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [car]);

  return (
    <div className={`modal ${!!car ? "modal-open" : ""}`}>
      <div className={`modal-box  ${size === "lg" ? "max-w-2xl" : ""}`}>
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">
          Add Car Contract
        </h3>

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
          </div>

          <ErrorText styleClass="my-4">
            {errors?.name?.message || errors?.registrationPlate?.message}
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
              onClick={onResetClick}
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

export default EditModal;