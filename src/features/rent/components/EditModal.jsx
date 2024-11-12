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
import { selectConstractState } from "../../../redux/contractSlice";
import {
  editRental,
  resetEditRentalResult,
  selectRentalState,
} from "../../../redux/rentalSlice";

dayjs.extend(isSameOrAfter);

const minDate = dayjs().startOf("day");

const validationSchema = yup.object({
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
    .typeError("Invalid date format"),
  lateDays: yup
    .number()
    .required("Late days is required")
    .typeError("Late days must be a number")
    .min(0, "Late days must be greater than or equal 0"),
  duration: yup
    .number()
    .required("Duration is required")
    .typeError("Duration must be a number")
    .integer("Must be an integer")
    .min(1, "Duration must be greater than or equal 1"),
  amount: yup
    .number()
    .required("Duration is required")
    .typeError("Duration must be a number")
    .test("min-amount", "Amount must be greater than 0", (value) => {
      return value && Number(value) > 0;
    }),
  payment: yup.string().required("Payment method is required"),
  feeType: yup.string().required("Fee type is required"),
  note: yup.string(),
  contractId: yup.string().required("Contract is required"),
});

const EditModal = ({ rental, size, onClose, refresh }) => {
  const { cars } = useSelector(selectCarState);
  const { contracts } = useSelector(selectConstractState);
  const { editRentalResult } = useSelector(selectRentalState);

  const [selectCar, setSelectCar] = useState(null);
  const [step, setStep] = useState(1);
  const [carName, setCarname] = useState("");

  const dispatch = useDispatch();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      note: "",
      date: dayjs().format("YYYY-MM-DD"),
      startDate: dayjs().format("YYYY-MM-DD"),
      duration: 1,
      lateDays: 0,
      amount: 0,
      feeType: "RENTAL_FEE",
      payment: "CASH",
    },
  });

  const filteredCars = useMemo(() => {
    const name = carName.toLowerCase();
    return cars.list.filter((car) => car.name.toLowerCase().includes(name));
  }, [cars, carName]);

  const filteredContracts = useMemo(() => {
    if (selectCar) {
      return contracts.list.filter(
        (contract) => contract.car.id === selectCar.id
      );
    }

    return [];
  }, [selectCar, contracts]);

  const handleClose = () => {
    onClose();
    setStep(1);
    setSelectCar(null);
  };

  const onCancelClick = () => {
    if (step === 2) {
      setStep(1);
    } else {
      handleClose();
    }
  };

  const onNextClick = () => {
    if (step === 1 && selectCar) {
      setStep(2);
      return;
    }

    if (step === 2) {
      // Save data
      handleClose();
    }
  };

  const onSubmit = (data) => {
    dispatch(editRental({ data, id: rental.id }));
  };

  const errorText =
    errors?.date?.message ||
    errors?.startDate?.message ||
    errors?.lateDays?.message ||
    errors?.duration?.message ||
    errors?.amount?.message ||
    errors?.payment?.message ||
    errors?.feeType?.message ||
    errors?.contractId?.message ||
    "";

  useEffect(() => {
    if (editRentalResult) {
      if (editRentalResult === "success") {
        reset();
        onClose();
        refresh();
        showToast("Edit payment receipt successfully!", EToastType.SUCCESS);
      } else {
        showToast(editRentalResult, EToastType.ERROR);
      }
      dispatch(resetEditRentalResult());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRentalResult]);

  useEffect(() => {
    if (!rental) {
      reset();
    } else {
      setStep(2);
      setSelectCar(rental.contract.car);
      reset({
        date: dayjs(rental.date).format("YYYY-MM-DD"),
        startDate: dayjs(rental.startDate).format("YYYY-MM-DD"),
        lateDays: rental.lateDays,
        duration: rental.duration,
        amount: rental.amount,
        payment: rental.payment,
        feeType: rental.feeType,
        note: rental.note,
        contractId: rental.contract.id,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rental]);

  return (
    <div className={`modal ${!!rental ? "modal-open" : ""}`}>
      <div className={`modal-box  ${size === "lg" ? "max-w-2xl" : ""}`}>
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">
          Edit Payment Receipt
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
                <label className="ml-3 text-base font-medium">Late days</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter late days"
                  {...register("lateDays")}
                />
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Contract</label>
                <select
                  className="w-full select select-bordered"
                  {...register("contractId")}
                >
                  {filteredContracts.map((contract) => (
                    <option
                      key={`contract-option-${contract.id}`}
                      value={contract.id}
                    >
                      <p className="break-all whitespace-pre">{`${
                        contract.customerName
                      } - ${dayjs(contract.startDate).format(
                        "DD/MM/YYYY"
                      )} - ${dayjs(contract.endDate).format("DD/MM/YYYY")}`}</p>
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Payment</label>
                <select
                  className="w-full select select-bordered"
                  {...register("payment")}
                >
                  <option value="CASH">Cash</option>
                  <option value="BANK">Bank</option>
                  <option value="SQUARE">Square</option>
                </select>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Fee Type</label>
                <select
                  className="w-full select select-bordered"
                  {...register("feeType")}
                >
                  <option value="RENTAL_FEE">Rental Fee</option>
                  <option value="LATE_FEE">Late Fee</option>
                  <option value="ACCIDENT_FEE">Accident Fee</option>
                </select>
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Amount</label>
                <input
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter amount"
                  {...register("amount")}
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
                  type="text"
                  className="w-full input input-bordered"
                  placeholder="Enter duration"
                  {...register("duration")}
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
              className="w-32 btn btn-outline btn-sm"
              onClick={onCancelClick}
              type="button"
            >
              {step === 2 ? "Back" : "Cancel"}
            </button>
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

export default EditModal;
