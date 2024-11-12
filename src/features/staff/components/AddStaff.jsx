import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import ErrorText from "../../../components/Typography/ErrorText";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { addItems } from "../../../redux/itemSlice";
import useHandleResponse from "../../../hooks/useHandleResponse";
import { addStaffs } from "../../../redux/staffSlice";

const validationSchema = yup.object({
  email: yup.string().required("Please input email !"),
  username: yup.string().required("Please input username !"),
  password: yup.string().required("Please input password !"),
  role: yup.string(),
});

const AddStaff = ({ open, size, onClose }) => {
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
      email: "",
      username: "",
      password: "",
      role: "STAFF",
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
    dispatch(addStaffs(data)).then((response) =>
      handleResponse(response, "Add new staff successfully", handleClose)
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
        <h3 className="pb-4 text-2xl font-semibold text-center">Add Staff</h3>

        <div className="w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Email</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter Email"
                  {...register("email")}
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Username</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter Username"
                  {...register("username")}
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="w-full input input-bordered"
                  autoComplete="off"
                  {...register("password")}
                />
              </div>
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Role</label>
                <select
                  className="w-full select select-bordered"
                  {...register("role")}
                >
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            </div>
            <ErrorText styleClass="my-4">
              {errors?.email?.message ||
                errors?.username?.message ||
                errors?.password?.message ||
                errors?.role?.message}
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

export default AddStaff;
