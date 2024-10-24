import React, { useState } from "react";

const AddModal = ({ open, size, onClose }) => {
  const [selectCar, setSelectCar] = useState(null);
  const [step, setStep] = useState(1);

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

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
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

        <div className="w-full">
          {step === 2 ? (
            <div className="flex flex-col w-full gap-2">
              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Car ID</label>
                <input
                  type="text"
                  value={`Toyota ${selectCar}`}
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
                  />
                </div>

                <div className="flex flex-col items-start w-full gap-1">
                  <label className="ml-3 text-base font-medium">Email</label>
                  <input
                    type="text"
                    className="w-full input input-bordered"
                    placeholder="Enter email"
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
                  />
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-3">
                <div className="flex flex-col items-start w-full gap-1">
                  <label className="ml-3 text-base font-medium">
                    Start date
                  </label>
                  <input
                    type="date"
                    className="w-full input input-bordered"
                    placeholder="Select start date"
                  />
                </div>

                <div className="flex flex-col items-start w-full gap-1">
                  <label className="ml-3 text-base font-medium">Duration</label>
                  <input
                    type="number"
                    className="w-full input input-bordered"
                    placeholder="Enter duration"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start w-full gap-1">
                <label className="ml-3 text-base font-medium">Note</label>
                <textarea
                  placeholder="Enter note"
                  className="w-full resize-none textarea textarea-bordered"
                  rows={5}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full gap-4">
              <input
                type="search"
                //   value={searchText}
                placeholder="Car ID"
                //   onChange={(e) => updateSearchInput(e.target.value)}
                className="w-full input input-bordered"
              />

              <div className="flex flex-col items-center w-full gap-1">
                <div className="grid w-full grid-cols-3">
                  <h3 className="text-base font-medium">Car ID</h3>
                  <h3 className="col-span-2 text-base font-medium">Car Name</h3>
                </div>
                <div className="m-0 divider" />
                <div className="w-full overflow-y-auto max-h-40 scroll-custom">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <button
                      key={`car-${index}`}
                      className={`grid w-full grid-cols-3 btn btn-ghost ${
                        selectCar === index ? "btn-active" : ""
                      }`}
                      onClick={() => setSelectCar(index)}
                    >
                      <span className="inline-block text-left">
                        {index + 1}
                      </span>
                      <span className="inline-block col-span-2 text-left">
                        Toyota {index}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center w-full gap-4 mt-5">
            <button
              className="w-32 btn btn-outline btn-sm"
              onClick={onCancelClick}
            >
              {step === 2 ? "Back" : "Cancel"}
            </button>
            <button className="w-32 btn btn-outline btn-sm">Reset</button>
            <button
              className="w-32 btn btn-primary btn-sm"
              onClick={onNextClick}
              disabled={step === 1 && selectCar === null}
            >
              {step === 2 ? "Save" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
