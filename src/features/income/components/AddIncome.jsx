import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorText from "../../../components/Typography/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import useHandleResponse from "../../../hooks/useHandleResponse";
import { addInout } from "../../../redux/inoutSlice";
import { getItems, selectItems } from "../../../redux/itemSlice";

const validationSchema = yup.object({
  amount: yup
    .string()
    .matches(/^\d*[1-9]\d*$/, "Invalid amount")
    .required("Please input amount !"),
  itemId: yup.string().required("Please input item !"),
  note: yup.string(),
  type: yup.string().required("Please select type !"),
  payment: yup.string().required("Please select payment !"),
});

const AddIncome = ({ open, size, onClose }) => {
  const dispatch = useDispatch();
  const handleResponse = useHandleResponse();
  const { items } = useSelector(selectItems);

  useEffect(() => {
    if (open) {
      dispatch(getItems({ pagination: { page: 0, size: 99999 } }));
    }
  }, [open]);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: "",
      itemId: null,
      note: "",
      type: null,
      payment: null,
    },
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const onCancelClick = () => {
    handleClose();
  };

  const onSubmit = (data) => {
    dispatch(addInout(data)).then((response) =>
      handleResponse(response, `Add new ${data.type} successfully`, handleClose)
    );
  };

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className={`modal-box  ${size === "lg" ? "max-w-xl" : ""}`}>
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={onCancelClick}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">Add New</h3>

        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Type</label>
                <select
                  className="w-full select select-bordered"
                  {...register("type")}
                >
                  <option value={null}></option>
                  <option value="INCOME">INCOME</option>
                  <option value="OUTCOME">OUTCOME</option>
                </select>
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Payment</label>
                <select
                  className="w-full select select-bordered"
                  {...register("payment")}
                >
                  <option value={null}></option>
                  <option value="CASH">CASH</option>
                  <option value="BANK">BANK</option>
                </select>
              </div>
              {!!items.total && (
                <div className="flex flex-col items-start w-full gap-1">
                  <label className="ml-3 text-base font-medium">Item</label>
                  <select
                    className="w-full select select-bordered"
                    {...register("itemId")}
                  >
                    <option value={null}></option>
                    {items.list.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Amount</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter Amount"
                  {...register("amount")}
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
              {errors?.amount?.message ||
                errors?.type?.message ||
                errors?.itemId?.message ||
                errors?.payment?.message}
            </ErrorText>
            <div className="flex items-center justify-center w-full gap-4 mt-5">
              <button
                className="w-32 btn btn-outline btn-sm"
                type="button"
                onClick={() => reset()}
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
    </div>
  );
};

export default AddIncome;
