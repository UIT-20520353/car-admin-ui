import { yupResolver } from "@hookform/resolvers/yup";
import * as dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { EToastType, showToast } from "../../../app/toast";
import ErrorText from "../../../components/Typography/ErrorText";
import { selectCarState } from "../../../redux/carSlice";
import {
  editContract,
  renewContract,
  resetRenewContractResult,
  selectConstractState,
} from "../../../redux/contractSlice";

dayjs.extend(isSameOrAfter);

const minDate = dayjs().startOf("day");

const validationSchema = yup.object({
  customerEmail: yup
    .string()
    .required("Please enter your email!")
    .matches(
      /^[a-zA-Z0-9_\\.-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,4}?$/,
      "Email is not in the correct format!"
    ),
  customerName: yup.string().required("Please enter customer name!"),
  customerPhone: yup
    .string()
    .required("Please enter customer phone!")
    .matches(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number is not in the correct format!"
    ),
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
  startDate: yup
    .date()
    .required("Start date is required")
    .typeError("Invalid date format")
    .test("min-start-date", "Start date cannot be in the past", (value) => {
      return value && dayjs(value).isSameOrAfter(minDate, "day");
    }),
  duration: yup
    .number()
    .required("Duration is required")
    .typeError("Duration must be a number")
    .min(0, "Duration must be greater than 0"),
});

const RenewModal = ({ selectedContract, size, onClose, refresh }) => {
  const dispatch = useDispatch();
  const { cars } = useSelector(selectCarState);
  const { renewContractResult } = useSelector(selectConstractState);
  const [selectCar, setSelectCar] = useState(null);
  const [step, setStep] = useState(1);
  const [carName, setCarname] = useState("");
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customerEmail: "",
      customerName: "",
      customerPhone: "",
      note: "",
      date: dayjs().format("YYYY-MM-DD"),
      startDate: dayjs().format("YYYY-MM-DD"),
      duration: 1,
    },
  });

  const startDate = watch("startDate");
  const duration = watch("duration");

  const handleClose = () => {
    onClose();
    setStep(1);
    setSelectCar(null);
  };

  const onNextClick = () => {
    if (step === 1 && selectCar) {
      setStep(2);
    }
  };

  const filteredCars = useMemo(() => {
    const name = carName.toLowerCase();
    return cars.list.filter((car) => car.name.toLowerCase().includes(name));
  }, [cars, carName]);

  const onSubmit = (data) => {
    if (selectedContract) {
      const body = {
        contractId: selectedContract.id,
        startDate: data.startDate,
        date: data.date,
        duration: data.duration,
        note: data.not,
      };
      dispatch(renewContract({ data: body }));
    }
  };

  const errorText =
    errors?.date?.message ||
    errors?.customerEmail?.message ||
    errors?.customerName?.message ||
    errors?.customerPhone?.message ||
    errors?.startDate?.message ||
    errors?.duration?.message ||
    "";

  useEffect(() => {
    if (renewContractResult) {
      if (renewContractResult === "success") {
        reset();
        onClose();
        refresh();
        showToast("Edit contract successfully!", EToastType.SUCCESS);
      } else {
        showToast(renewContractResult, EToastType.ERROR);
      }
      dispatch(resetRenewContractResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renewContractResult]);

  useEffect(() => {
    if (!selectedContract) {
      reset();
    } else {
      setStep(2);
      setSelectCar(selectedContract.car);
      reset({
        customerEmail: selectedContract.customerEmail,
        customerName: selectedContract.customerName,
        customerPhone: selectedContract.customerPhone,
        note: selectedContract.note,
        date: dayjs(selectedContract.date).format("YYYY-MM-DD"),
        startDate: dayjs(selectedContract.startDate).format("YYYY-MM-DD"),
        duration:
          selectedContract.duration ||
          dayjs(selectedContract.endDate).diff(
            dayjs(selectedContract.startDate),
            "day"
          ),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContract]);

  useEffect(() => {
    const newEndDate = dayjs(startDate)
      .add(duration, "day")
      .format("YYYY-MM-DD");
    setEndDate(newEndDate);
  }, [startDate, duration]);

  return (
    <div className={`modal ${!!selectedContract ? "modal-open" : ""}`}>
      <div
        className={`modal-box scroll-custom  ${
          size === "lg" ? "max-w-2xl" : ""
        }`}
      >
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">
          Renew contract
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div
            className={`flex flex-col w-full gap-2 ${step !== 2 && "hidden"}`}
          >
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Car</label>
              <input
                type="text"
                value={`${selectCar?.id} - ${selectCar?.name} - ${selectCar?.registrationPlate}`}
                className="w-full input input-bordered"
                disabled
              />
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Date</label>
                <input
                  type="date"
                  className="w-full input input-bordered"
                  placeholder="Select date"
                  {...register("date")}
                />
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Email</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter email"
                  {...register("customerEmail")}
                  disabled
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">
                  Customer name
                </label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter customer name"
                  {...register("customerName")}
                  disabled
                />
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">
                  Customer phone
                </label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter customer phone"
                  {...register("customerPhone")}
                  disabled
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Start date</label>
                <input
                  type="date"
                  className="w-full input input-bordered"
                  placeholder="Select start date"
                  {...register("startDate")}
                />
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Duration</label>
                <input
                  type="number"
                  className="w-full input input-bordered"
                  placeholder="Enter duration"
                  min={0}
                  {...register("duration")}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">End date</label>
                <input
                  type="date"
                  className="w-full input input-bordered"
                  placeholder="Emd date"
                  value={endDate}
                  disabled
                />
              </div>
            </div>

            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Note</label>
              <textarea
                placeholder="Enter note"
                className="w-full resize-none textarea textarea-bordered"
                rows={3}
                {...register("note")}
              />
            </div>

            <div className={`w-full mt-2 mb-1 ${!errorText && "hidden"}`}>
              <ErrorText>{errorText}</ErrorText>
            </div>
          </div>

          <div
            className={`flex flex-col items-center w-full gap-4 ${
              step !== 1 && "hidden"
            }`}
          >
            <input
              type="search"
              value={carName}
              placeholder="Car name"
              onChange={(e) => setCarname(e.target.value)}
              className="w-full input input-bordered"
            />

            <div className="flex flex-col items-center w-full gap-1">
              <div className="grid w-full grid-cols-3">
                <h3 className="text-base font-medium">Car ID</h3>
                <h3 className="col-span-2 text-base font-medium">Car Name</h3>
              </div>
              <div className="m-0 divider" />
              <div className="w-full overflow-y-auto max-h-40 scroll-custom hide-scroll">
                {filteredCars.map((car, index) => (
                  <button
                    key={`car-${car.id}`}
                    className={`grid w-full grid-cols-3 btn btn-ghost ${
                      selectCar?.id === car.id ? "btn-active" : ""
                    }`}
                    onClick={() => setSelectCar(car)}
                    type="button"
                  >
                    <span className="inline-block text-left">{car.id}</span>
                    <span className="inline-block col-span-2 text-left">
                      {`${car.name} - ${car.registrationPlate}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center w-full gap-4 mt-5">
            <button
              type="button"
              className="w-32 btn btn-outline btn-sm"
              onClick={() => reset()}
            >
              Reset
            </button>
            <button
              className={`w-32 btn btn-primary btn-sm ${
                step !== 1 && "hidden"
              }`}
              onClick={onNextClick}
              disabled={selectCar === null}
              type="button"
            >
              Next
            </button>
            <button
              className={`w-32 btn btn-primary btn-sm ${
                step === 1 && "hidden"
              }`}
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenewModal;