import React, { useState } from "react";

const AddModal = ({ open, size, onClose }) => {
  const [selectCar, setSelectCar] = useState(null);

  const handleClose = () => {
    onClose();
    setSelectCar(null);
  };

  return (
    <div className={`modal ${open ? "modal-open" : ""}`}>
      <div className={`modal-box  ${size === "lg" ? "max-w-3xl" : ""}`}>
        <button
          className="absolute btn btn-sm btn-circle right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h3 className="pb-4 text-2xl font-semibold text-center">
          Add Payment Receipt
        </h3>

        <div className="w-full">
          {!!selectCar ? (
            <div>123123</div>
          ) : (
            <div className="flex flex-col items-center w-full gap-4">
              <input
                type="search"
                //   value={searchText}
                placeholder="Car ID"
                //   onChange={(e) => updateSearchInput(e.target.value)}
                className="w-2/3 input input-bordered"
              />

              <div className="flex flex-col items-center w-2/3 gap-1">
                <div className="grid w-full grid-cols-3">
                  <h3 className="text-base font-medium">Car ID</h3>
                  <h3 className="col-span-2 text-base font-medium">Car Name</h3>
                </div>
                <div className="m-0 divider" />
                <div className="w-full overflow-y-auto max-h-40 scroll-custom">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <button
                      key={`car-${index}`}
                      className="grid w-full grid-cols-3 btn btn-ghost"
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
              onClick={handleClose}
            >
              Cancel
            </button>
            <button className="w-32 btn btn-primary btn-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
