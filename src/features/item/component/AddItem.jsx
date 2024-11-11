import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorText from "../../../components/Typography/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { addItems } from "../../../redux/itemSlice";
import useHandleResponse from "../../../hooks/useHandleResponse";

const validationSchema = yup.object({
  name: yup.string().required("Please input name item !"),
  description: yup.string(),
});

const AddItem = ({ open, size, onClose }) => {
  const dispatch = useDispatch();
  const handleResponse = useHandleResponse();

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
      description: "",
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
    dispatch(addItems(data)).then((response) =>
      handleResponse(response, "Add new item successfully", handleClose)
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
        <h3 className="pb-4 text-2xl font-semibold text-center">Add Item</h3>

        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Name</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter Name"
                  {...register("name")}
                />
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">
                  Description
                </label>
                <textarea
                  placeholder="Enter description"
                  className="w-full resize-none textarea textarea-bordered"
                  rows={5}
                  {...register("description")}
                />
              </div>
            </div>
            <ErrorText styleClass="my-4">{errors?.name?.message}</ErrorText>
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

export default AddItem;
