import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorText from "../../../components/Typography/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { editItems } from "../../../redux/itemSlice";
import useHandleResponse from "../../../hooks/useHandleResponse";
import { selectAuthState } from "../../../redux/authSlice";

const validationSchema = yup.object({
  name: yup.string().required("Please input name item !"),
  registrationPlate: yup.string(),
});

const EditItem = ({ size, onClose, refresh, item }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector(selectAuthState);
  const handleResponse = useHandleResponse();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
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
  };

  const onCancelClick = () => {
    handleClose();
  };

  const onSubmit = (data) => {
    dispatch(editItems({ id: item.id, data })).then((response) =>
      handleResponse(response, "Edit item successfully", handleClose)
    );
  };

  useEffect(() => {
    if (item) {
      setValue("name", item.name);
      setValue("description", item.description);
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onResetClick = () => {
    setValue("name", item.name);
    setValue("description", item.description);
  };

  return (
    <div className={`modal ${!!item ? "modal-open" : ""}`}>
      <div className={`modal-box  ${size === "lg" ? "max-w-xl" : ""}`}>
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={onCancelClick}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">Edit Item</h3>

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
                  disabled={profile?.role !== "ADMIN"}
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
                  disabled={profile?.role !== "ADMIN"}
                />
              </div>
            </div>
            <ErrorText styleClass="my-4">{errors?.name?.message}</ErrorText>
            {profile?.role === "ADMIN" && (
              <div className="flex items-center justify-center w-full gap-4 mt-5">
                <button
                  className="w-32 btn btn-outline btn-sm"
                  type="button"
                  onClick={() => onResetClick()}
                >
                  Reset
                </button>
                <button className="w-32 btn btn-primary btn-sm" type="submit">
                  Save
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItem;
