import React from "react";

const AddOutcome = ({ open, size, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const onCancelClick = () => {
    handleClose();
  };

  const onSave = () => {
    handleClose();
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
        <h3 className="pb-4 text-2xl font-semibold text-center">Add Expense</h3>

        <div className="w-full">
          <div className="flex flex-col w-full gap-2">
            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Date</label>
              <input
                type="date"
                className="w-full input input-bordered"
                placeholder="Select date"
              />
            </div>

            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Payment</label>
              <select className="w-full select select-bordered">
                <option disabled selected>
                  Select payment method
                </option>
                <option>Cash</option>
                <option>Bank</option>
              </select>
            </div>

            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Take</label>
              <input
                type="number"
                className="w-full input input-bordered"
                placeholder="Enter take"
                min={0}
              />
            </div>

            <div className="flex flex-col items-start w-full gap-1">
              <label className="ml-3 text-base font-medium">Item</label>
              <input
                type="text"
                className="w-full input input-bordered"
                placeholder="Enter item"
              />
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

          <div className="flex items-center justify-center w-full gap-4 mt-5">
            <button className="w-32 btn btn-outline btn-sm">Reset</button>
            <button className="w-32 btn btn-primary btn-sm" onClick={onSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOutcome;
