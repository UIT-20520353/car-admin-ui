import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLogs, selectLogsState } from "../../redux/logSlice";
import { formatDateNoTime } from "../../utils/date";

const LogModal = ({ item, size, onClose, cate }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(selectLogsState);

  const fetchItems = useCallback(() => {
    if (item) {
      dispatch(
        getLogs({
          pagination: { page: 0, size: 9999, sort: "createdDate,desc" },
          filter: { cate: cate, type: "", recordId: item.id },
        })
      );
    }
  }, [item, cate]);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className={`modal ${!!item ? "modal-open" : ""}`}>
      <div
        className={`modal-box scroll-custom max-h-[600px] overflow-auto ${
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
          Logs Tracking
        </h3>
        <div className="w-full ">
          {items.total ? (
            <Fragment>
              {items.list.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-300 rounded-lg overflow-hidden mb-4"
                >
                  <div className="bg-blue-300 flex justify-between py-2 px-4">
                    <p className="font-bold">{item.type}</p>
                    <p className="font-bold">
                      {item.createUser ? item.createUser.username : "SYSTEM"} -{" "}
                      {formatDateNoTime(item.createdDate)}
                    </p>
                  </div>
                  <div className="flex justify-between ">
                    <div className="w-[50%] border-r-2 py-2 px-4">
                      <p className="font-bold ">Before Data</p>
                      <pre className="text-sm">{item.beforeData}</pre>
                    </div>
                    <div className="w-[50%] py-2 px-4">
                      <p className="font-bold ">After Data</p>
                      <pre className="text-sm">{item.afterData}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </Fragment>
          ) : (
            <div className="text-center font-semibold">Data not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogModal;
