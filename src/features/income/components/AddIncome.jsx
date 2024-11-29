import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorText from "../../../components/Typography/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import useHandleResponse from "../../../hooks/useHandleResponse";
import { addInout } from "../../../redux/inoutSlice";
import { getItems, selectItems } from "../../../redux/itemSlice";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);

const minDate = dayjs().startOf("day");
const validationSchema = yup.object({
  income: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid income")
    .default("0"),
  outcomeCash: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid outcome")
    .default("0"),
  outcomeBank: yup
    .string()
    .matches(/^\d*[0-9]\d*$/, "Invalid outcome")
    .default("0"),
  note: yup.string(),
  date: yup
    .date()
    .required("Date is required")
    .typeError("Invalid date format")
    .test("min-date", "Date cannot be in the past", (value) => {
      return value && dayjs(value).isSameOrAfter(minDate, "day");
    })
    .max(
      new Date(new Date().setDate(new Date().getDate() + 3)),
      "Date cannot be more than 3 days in the future"
    ),
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
      income: "0",
      outcomeBank: "0",
      outcomeCash: "0",
      note: "",
      date: dayjs().format("YYYY-MM-DD hh:mm"),
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
                <label className="ml-3 text-base font-medium">Pick</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter pick"
                  {...register("income")}
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">
                  Expense By Cash
                </label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter expense"
                  {...register("outcomeCash")}
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">
                  Expense By Bank
                </label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter expense"
                  {...register("outcomeBank")}
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Date</label>
                <input
                  type="datetime-local"
                  className="w-full input input-bordered"
                  placeholder="Select date and time"
                  {...register("date")}
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
              {errors?.income?.message ||
                errors?.date?.message ||
                errors?.outcomeBank?.message ||
                errors?.outcomeCash?.message}
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
